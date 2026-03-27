"use client";


import { useState, useEffect, useMemo, KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";


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
        if (!res.ok) return;
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
      // implement preview later
      return;
    }


    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("promptText", promptText);
      fd.append("tags", tagsInput);
      fd.append("outputType", outputType);
      fd.append("visibility", visibility);
      fd.append("isDraft", (submitMode === "draft" || isDraft).toString());


      if (file) {
        fd.append("image", file);
      }


      const url =
        mode === "create" ? "/api/prompts" : `/api/prompts/${initial.id}`;


      const method = mode === "create" ? "POST" : "PATCH";


      const res = await fetch(url, {
        method,
        body: fd,
      });


      if (!res.ok) {
        console.error("Failed to save prompt");
        setIsSubmitting(false);
        return;
      }


      const data = await res.json();


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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            {mode === "create" ? "Share a Prompt" : "Edit Prompt"}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Share your prompt with the community.
          </p>
        </div>


        <div className="space-y-8">
          {/* Basic Information */}
          <section className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-sm font-medium text-gray-200 mb-4">
              Basic Information
            </h2>


            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Title
                </label>
                <input
                  className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500 transition"
                  placeholder="Give your prompt a catchy title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>


              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Description
                </label>
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
              <h2 className="text-sm font-medium text-gray-200">
                Prompt Text
              </h2>
              <button
                type="button"
                className="text-xs text-purple-400 hover:text-purple-300"
              >
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


          {/* Output + Upload */}
          <section className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-sm font-medium text-gray-200 mb-4">
              Output
            </h2>


            <div className="flex flex-wrap gap-2 mb-4">
              {OUTPUT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOutputType(type)}
                  className={clsx(
                    "px-3 py-1.5 rounded-full text-xs border transition",
                    outputType === type
                      ? "bg-purple-600 text-white border-purple-500"
                      : "bg-black/40 border-white/10 text-gray-300 hover:border-purple-500/60",
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>


            <div
              className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-dashed border-white/20 bg-black/30 px-4 py-6 text-center sm:text-left"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleFileChange(f);
              }}
            >
              <div className="flex-1">
                <p className="text-sm text-gray-200">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Supports PNG, JPG, GIF, MP4, WEBM up to 50MB
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="mt-3 text-xs"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    handleFileChange(f);
                  }}
                />
              </div>


              {previewUrl && outputType === "image" && (
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </section>


          {/* Details (Tools & Category) */}
          <section className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-sm font-medium text-gray-200 mb-4">
              Details
            </h2>


            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-2">AI Tool Used</p>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {TOOL_OPTIONS.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTagFromPreset(tool)}
                      className={clsx(
                        "px-2.5 py-1 rounded-full border transition",
                        isPresetSelected(tool)
                          ? "bg-purple-600 text-white border-purple-500"
                          : "bg-white/5 text-gray-200 border-white/10 hover:border-purple-500/60",
                      )}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>


              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-2">Category</p>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleTagFromPreset(cat)}
                      className={clsx(
                        "px-2.5 py-1 rounded-full border transition",
                        isPresetSelected(cat)
                          ? "bg-purple-600 text-white border-purple-500"
                          : "bg-white/5 text-gray-200 border-white/10 hover:border-purple-500/60",
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>


          {/* Tags */}
          <section className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-sm font-medium text-gray-200 mb-3">Tags</h2>


            {tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="flex items-center gap-1 rounded-full bg-purple-900/20 px-2.5 py-1 text-[11px] text-purple-200 border border-purple-500/30"
                  >
                    <span>{tag}</span>
                    <span className="text-[10px] text-purple-300">×</span>
                  </button>
                ))}
              </div>
            )}


            <input
              className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500 transition"
              placeholder="Type a tag and press Enter (up to 10 tags)..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
          </section>


          {/* Visibility & Actions */}
          <section className="bg-[#0b0f16] border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-sm font-medium text-gray-200 mb-4">
              Visibility
            </h2>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {VISIBILITY_OPTIONS.map((v) => {
                const isActive = visibility === v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisibility(v)}
                    className={clsx(
                      "flex flex-col items-start rounded-xl border px-4 py-3 text-left transition",
                      isActive
                        ? "bg-purple-600/30 border-purple-500"
                        : "bg-black/40 border-white/10 hover:border-purple-500/60",
                    )}
                  >
                    <span className="text-sm font-medium capitalize">
                      {v}
                    </span>
                    <span className="mt-1 text-[11px] text-gray-400">
                      {v === "public" && "Anyone can view"}
                      {v === "private" && "Only you can view"}
                      {v === "paid" && "Users pay to access"}
                    </span>
                  </button>
                );
              })}
            </div>


            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDraft}
                    onChange={(e) => setIsDraft(e.target.checked)}
                    className="accent-purple-500"
                  />
                  <span>Save as draft by default</span>
                </label>
              </div>


              <div className="flex w-full sm:w-auto justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmit("draft")}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-white/15 bg-white/5 text-xs sm:text-sm text-gray-200 hover:border-purple-500/60 transition disabled:opacity-60"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit("preview")}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-white/15 bg-white/5 text-xs sm:text-sm text-gray-200 hover:border-purple-500/60 transition disabled:opacity-60"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit("publish")}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-xs sm:text-sm font-medium text-white shadow-md hover:opacity-90 transition disabled:opacity-60"
                >
                  {mode === "create" ? "Publish Prompt" : "Save Changes"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
