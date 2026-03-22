"use client";

import { useRouter } from "next/navigation";

export default function OwnerActions({ promptId }: { promptId: string }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/shareOrEditPrompt?mode=edit&id=${promptId}`);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this prompt permanently?")) return;

    const res = await fetch(`/api/prompts/${promptId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/profile/me"); // or `/profile/${username}`
      router.refresh();
    } else {
      console.error("Failed to delete prompt");
    }
  };

  return (
    <div className="bg-[#05060a] border border-white/10 rounded-2xl p-3 flex gap-2 text-xs">
      <button
        onClick={handleEdit}
        className="flex-1 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-gray-100 hover:border-purple-400 hover:bg-purple-500/10 transition"
      >
        Edit Prompt
      </button>
      <button
        onClick={handleDelete}
        className="flex-1 rounded-full border border-red-500/60 bg-red-500/10 px-3 py-2 text-red-200 hover:bg-red-500/20 transition"
      >
        Delete
      </button>
    </div>
  );
}
