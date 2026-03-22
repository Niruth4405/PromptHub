"use client";

import { useState, useTransition } from "react";
import { Heart, Bookmark, Share2, ArrowRight } from "lucide-react";

export default function EngagementPanel({
  promptId,
  initialLikes,
  initialIsLiked,
  initialIsSaved,
}: {
  promptId: string;
  initialLikes: number;
  initialIsLiked: boolean;
  initialIsSaved: boolean;
}) {
  const safeInitialLikes =
    typeof initialLikes === "number" && !Number.isNaN(initialLikes)
      ? initialLikes
      : 0;

  const [likes, setLikes] = useState(safeInitialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();

  const toggleLike = () => {
    setIsLiked((prev) => !prev);
    setLikes((prev) => prev + (isLiked ? -1 : 1));

    startTransition(async () => {
      await fetch(`/api/prompts/${promptId}/like`, { method: "POST" });
    });
  };

  const toggleSave = () => {
    setIsSaved((prev) => !prev);

    startTransition(async () => {
      await fetch(`/api/prompts/${promptId}/save`, { method: "POST" });
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // ignore
    }
  };

  return (
    <section className="bg-[#05060a] border border-white/10 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        {/* Likes */}
        <button
          onClick={toggleLike}
          disabled={isPending}
          className="flex-1 rounded-full bg-white/5 border border-white/15 px-3 py-2 flex items-center justify-center gap-2 text-xs text-gray-100 hover:border-pink-400 hover:bg-pink-500/10 transition"
        >
          <Heart
            className="w-4 h-4"
            fill={isLiked ? "#ec4899" : "transparent"}
          />
          <span>Like</span>
          <span>{likes}</span>
        </button>

        {/* Save */}
        <button
          onClick={toggleSave}
          disabled={isPending}
          className="flex-1 rounded-full border border-white/20 bg-white/5 px-4 py-2 flex items-center justify-center gap-2 text-xs text-gray-100 hover:border-white/40 hover:bg-white/5 transition"
        >
          <Bookmark
            className="w-4 h-4"
            fill={isSaved ? "#ffffff" : "transparent"}
          />
          <span>{isSaved ? "Saved" : "Save"}</span>
        </button>
      </div>

      <button className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-3 py-2.5 text-xs font-medium text-white flex items-center justify-center gap-2 hover:opacity-90 transition">
        Remix Prompt
        <ArrowRight className="w-3 h-3" />
      </button>

      <button
        onClick={handleShare}
        className="w-full rounded-full bg-white/5 border border-white/15 px-3 py-2 text-[11px] text-gray-200 flex items-center justify-center gap-2 hover:bg-white/10 transition"
      >
        <Share2 className="w-3 h-3" />
        Share
      </button>
    </section>
  );
}
