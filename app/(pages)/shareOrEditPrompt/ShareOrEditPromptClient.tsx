"use client";

import { useState, useEffect, useMemo, KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import toast from "react-hot-toast";

type Mode = "create" | "edit";
type OutputType = "image" | "video" | "code" | "text";
type VisibilityType = "public" | "private" | "paid";

type InitialPrompt = {
  id?: string;
  title?: string;
  description?: string;
  promptText?: string;
  tags?: string[];
  image?: string | null;
  outputType?: OutputType;
  visibility?: VisibilityType;
  isDraft?: boolean;
};

const OUTPUT_TYPES: OutputType[] = ["image", "video", "code", "text"];
const VISIBILITY_OPTIONS: VisibilityType[] = ["public", "private", "paid"];

const TOOL_OPTIONS = [
  "Midjourney",
  "DALL·E 3",
  "Stable Diffusion",
  "GPT-4",
  "Claude",
  "Gemini",
  "Runway",
  "Sora",
];

const CATEGORY_OPTIONS = [
  "Art",
  "Development",
  "Marketing",
  "Writing",
  "Video",
  "Product",
  "Fantasy",
  "Portraits",
  "Architecture",
  "NSFW",
];

export default function ShareOrEditPromptPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode: Mode = (searchParams.get("mode") as Mode) || "create";

  const [initial, setInitial] = useState<InitialPrompt | null>(null);

  useEffect(() => {
    if (mode === "edit") {
      const id = searchParams.get("id");
      if (!id) return;

      (async () => {
        const res = await fetch(`/api/prompts/${id}`);
        if (!res.ok) {
          toast.error("Failed to load prompt for editing.");
          return;
        }
        const data = await res.json();
        setInitial({
          id: data.id,
          title: data.title,
          description: data.description,
          promptText: data.promptText,
          tags: data.tags || [],
          image: data.image,
          outputType: (data.outputType as OutputType) || "image",
          visibility: (data.visibility as VisibilityType) || "public",
          isDraft: data.isDraft ?? false,
        });
      })();
    } else {
      setInitial({
        outputType: "image",
        visibility: "public",
        isDraft: false,
        tags: [],
      });
    }
  }, [mode, searchParams]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [promptText, setPromptText] = useState("");
  const [outputType, setOutputType] = useState<OutputType>("image");
  const [visibility, setVisibility] = useState<VisibilityType>("public");
  const [isDraft, setIsDraft] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const tagsInput = useMemo(() => tags.join(", "), [tags]);

  useEffect(() => {
    if (!initial) return;
    setTitle(initial.title || "");
    setDescription(initial.description || "");
    setPromptText(initial.promptText || "");
    setTags(initial.tags || []);
    setOutputType(initial.outputType || "image");
    setVisibility(initial.visibility || "public");
    setIsDraft(initial.isDraft ?? false);
    setPreviewUrl(initial.image || null);
  }, [initial]);

  const handleFileChange = (f: File | null) => {
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(initial?.image || null);
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = tagInput.trim();
      if (!value) return;
      if (!tags.includes(value)) {
        setTags([...tags, value]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const toggleTagFromPreset = (label: string) => {
    if (tags.includes(label)) {
      setTags(tags.filter((t) => t !== label));
    } else {
      setTags([...tags, label]);
    }
  };

  const isPresetSelected = (label: string) => tags.includes(label);

  const handleSubmit = async (submitMode: "publish" | "draft" | "preview") => {
    if (!initial) return;

    if (submitMode === "preview") {
      toast("Preview coming soon!", { icon: "👀" });
      return;
    }

    if (!title.trim()) {
      toast.error("Please add a title before submitting.");
      return;
    }
    if (!promptText.trim()) {
      toast.error("Prompt text cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(
      mode === "create" ? "Publishing your prompt..." : "Saving changes..."
    );

    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("promptText", promptText);
      fd.append("tags", tagsInput);
      fd.append("outputType", outputType);
      fd.append("visibility", visibility);
      fd.append("isDraft", (submitMode === "draft" || isDraft).toString());

      if (file) fd.append("image", file);

      const url = mode === "create" ? "/api/prompts" : `/api/prompts/${initial.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, { method, body: fd });

      if (!res.ok) {
        toast.error(
          mode === "create"
            ? "Failed to publish prompt. Try again."
            : "Failed to save changes. Try again.",
          { id: toastId }
        );
        return;
      }

      const data = await res.json();

      toast.success(
        submitMode === "draft"
          ? "Saved as draft! 📝"
          : mode === "create"
          ? "Prompt published! 🎉"
          : "Changes saved! ✅",
        { id: toastId, duration: 3000 }
      );

      router.push(`/prompt/${data.id}`);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initial) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060a] text-white px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            {mode === "create" ? "Share a Prompt" : "Edit Prompt"}
          </h1>
          <p className="text-sm text-gray-400 mt-2">Share your prompt with the community.</p>
        </div>

        <div className="space-y-8">
          {/* Basic Information */}
          <section className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-sm font-medium text-gray-200 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Title</label>
                <input
                  className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500 transition"
                  placeholder="Give your prompt a catchy title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                <textarea
                  className="w-full min-h-[90px] rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500 transition resize-y"
                  placeholder="Describe what your prompt does..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Prompt Text */}
          <section className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-200">Prompt Text</h2>
              <button type="button" className="text-xs text-purple-400 hover:text-purple-300">
                Improve with AI
              </button>
            </div>
            <textarea
              className="w-full min-h-[160px] rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500 transition resize-y"
              placeholder="Enter your full prompt text here..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
              <button
                type="button"
                className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition text-[11px]"
              >
                Auto-generate Tags
              </button>
              <span>{promptText.length} characters</span>
            </div>
          </section>

          {/* Output Type */}
          <section className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-sm font-medium text-gray-200 mb-4">Output Type</h2>
            <div className="flex flex-wrap gap-2">
              {OUTPUT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOutputType(type)}
                  className={clsx(
                    "px-3 py-1.5 rounded-full text-xs border transition",
                    outputType === type
                      ? "bg-purple-600 text-white border-purple-500"
                      : "bg-black/40 border-white/10 text-gray-300 hover:border-purple-500/60"
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </section>

          {/* Tags */}
          <section className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-sm font-medium text-gray-200 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {CATEGORY_OPTIONS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleTagFromPreset(label)}
                  className={clsx(
                    "px-2.5 py-1 rounded-full text-[11px] border transition",
                    isPresetSelected(label)
                      ? "bg-purple-600/80 text-white border-purple-500"
                      : "bg-black/40 border-white/10 text-gray-300 hover:border-purple-500/60"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500 transition"
              placeholder="Type a tag and press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-purple-900/30 px-2.5 py-0.5 text-[11px] text-purple-200 border border-purple-500/30"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-white transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Visibility */}
          <section className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-sm font-medium text-gray-200 mb-4">Visibility</h2>
            <div className="flex flex-wrap gap-2">
              {VISIBILITY_OPTIONS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisibility(v)}
                  className={clsx(
                    "px-3 py-1.5 rounded-full text-xs border transition",
                    visibility === v
                      ? "bg-purple-600 text-white border-purple-500"
                      : "bg-black/40 border-white/10 text-gray-300 hover:border-purple-500/60"
                  )}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </section>

          {/* Submit Buttons */}
          <div className="flex flex-wrap gap-3 pb-10">
            <button
              type="button"
              onClick={() => handleSubmit("publish")}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-purple-600 text-sm font-medium text-white hover:bg-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Publishing..." : mode === "create" ? "Publish" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full border border-white/20 text-sm text-gray-300 hover:border-white/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("preview")}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full border border-white/10 text-sm text-gray-400 hover:border-white/20 transition disabled:opacity-50"
            >
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
