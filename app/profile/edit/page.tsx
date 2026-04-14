"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Globe, Mail, MapPin, Twitter, Linkedin, Github } from "lucide-react";
import toast from "react-hot-toast";

export default function EditProfile() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    name: "",
    role: "",
    location: "",
    email: "",
    website: "",
    twitter: "",
    linkedin: "",
    github: "",
    bio: "",
    expertise: [] as string[],
    tools: [] as string[]
  });
  const [expertiseInput, setExpertiseInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setForm({
          username: data.username || "",
          name: data.name || "",
          role: data.role || "",
          location: data.location || "",
          email: data.email || "",
          website: data.website || "",
          twitter: data.twitter || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          bio: data.bio || "",
          expertise: Array.isArray(data.expertise) ? data.expertise : [],
          tools: Array.isArray(data.tools) ? data.tools : []
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load profile.");
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTag = (field: "expertise" | "tools", value: string) => {
    if (!value.trim()) return;
    const newTags = [...form[field], value.trim()];
    setForm({ ...form, [field]: newTags });
    if (field === "expertise") setExpertiseInput("");
    else setToolsInput("");
  };

  const removeTag = (field: "expertise" | "tools", index: number) => {
    const newTags = form[field].filter((_: string, i: number) => i !== index);
    setForm({ ...form, [field]: newTags });
  };

  const handleSubmit = async () => {
    setSaving(true);
    const toastId = toast.loading("Saving your profile...");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Profile updated! ✅", { id: toastId, duration: 3000 });
        const username = form.username || "user";
        router.push(`/profile/${username}`);
        router.refresh();
      } else {
        toast.error("Failed to update profile. Try again.", { id: toastId });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong. Try again.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* BASIC INFORMATION */}
        <div className="bg-[#050816] rounded-2xl border border-white/8 p-8 space-y-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Aurora Chen" />
            <InputField label="Role / Title" name="role" value={form.role} onChange={handleChange} placeholder="Prompt Engineer / AI Artist" />
            <InputField label="Location" name="location" value={form.location} onChange={handleChange} placeholder="San Francisco, CA" icon={MapPin} />
            <InputField label="Email" name="email" value={form.email} onChange={handleChange} placeholder="aurora@prompthub.ai" icon={Mail} />
            <InputField label="Website" name="website" value={form.website} onChange={handleChange} placeholder="https://aurora.design" icon={Globe} className="lg:col-span-2" />
            <InputField label="Twitter / X" name="twitter" value={form.twitter} onChange={handleChange} placeholder="@aurora_ai" icon={Twitter} />
            <InputField label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="aurora-chen-ai" icon={Linkedin} />
            <InputField label="GitHub" name="github" value={form.github} onChange={handleChange} placeholder="aurora-chen" icon={Github} className="lg:col-span-2" />
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-[#050816] rounded-2xl border border-white/8 p-8 space-y-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            About
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-white/80">Bio</p>
              <p className="text-xs text-white/60 mb-3">Markdown supported</p>
            </div>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="AI artist exploring the boundaries of digital creativity..."
              className="w-full px-4 py-4 bg-[#0f141e]/50 border border-white/10 rounded-xl text-sm placeholder:text-white/30 transition-all duration-200 resize-vertical h-40 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:bg-[#0f141e] hover:border-white/20"
              rows={6}
            />
          </div>

          <TagSection title="Areas of Expertise" tags={form.expertise} inputValue={expertiseInput} onInputChange={setExpertiseInput} onAddTag={() => addTag("expertise", expertiseInput)} onRemoveTag={(i) => removeTag("expertise", i)} />
          <TagSection title="Tools Mastered" tags={form.tools} inputValue={toolsInput} onInputChange={setToolsInput} onAddTag={() => addTag("tools", toolsInput)} onRemoveTag={(i) => removeTag("tools", i)} />
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 border-0 focus:outline-none active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon?: React.ElementType;
  className?: string;
}

function InputField({ label, name, value, onChange, placeholder, icon: Icon, className = "" }: InputFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-medium uppercase tracking-wider text-white/60">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />}
        <input
          name={name}
          type="text"
          value={value}
          onChange={onChange as any}
          placeholder={placeholder}
          className="w-full px-12 py-4 bg-[#0f141e]/50 border border-white/10 rounded-xl text-sm placeholder:text-white/30 transition-all duration-200 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:bg-[#0f141e] hover:border-white/20 pl-11"
        />
      </div>
    </div>
  );
}

interface TagSectionProps {
  title: string;
  tags: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (index: number) => void;
}

function TagSection({ title, tags, inputValue, onInputChange, onAddTag, onRemoveTag }: TagSectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-white/80">{title}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, i) => (
          <div key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/40 text-xs font-medium hover:from-purple-500/30 hover:border-purple-500/60 transition-all duration-200">
            {tag}
            <button type="button" onClick={() => onRemoveTag(i)} className="ml-1 text-white/50 hover:text-white/90 transition-colors">
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAddTag(); } }}
          placeholder={`Add ${title.toLowerCase()}...`}
          className="flex-1 px-4 py-2 bg-[#0f141e]/50 border border-white/10 rounded-xl text-sm placeholder:text-white/30 transition-all duration-200 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:bg-[#0f141e] hover:border-white/20"
        />
        <button type="button" onClick={onAddTag} className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-xs font-medium hover:bg-purple-500/30 transition-all duration-200">
          Add
        </button>
      </div>
    </div>
  );
}
