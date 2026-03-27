"use client";

import { useState } from "react";
import EngagementPanel from "./EngagementPanel";
import StatsPanel from "./StatsPanel";
import CreatorPanel from "./CreatorPanel";
import OwnerActions from "./OwnerActions";
import AIEnhancementPanel from "./AIEnhancementPanel";

type PromptSidebarClientProps = {
  prompt: any;
  isOwner: boolean;
  userId: string | null;
  initialIsLiked: boolean;
  initialIsSaved: boolean;
  initialIsFollowing: boolean;
};

export default function PromptSidebarClient({
  prompt,
  isOwner,
  userId,
  initialIsLiked,
  initialIsSaved,
  initialIsFollowing,
}: PromptSidebarClientProps) {
  const author = prompt?.author;

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  async function handleToggleFollow() {
    if (!userId || !author?.id) {
      return;
    }

    try {
      setIsLoadingFollow(true);
      const method = isFollowing ? "DELETE" : "POST";

      await fetch("/api/follow", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId: author.id }),
      });

      setIsFollowing(!isFollowing);
    } finally {
      setIsLoadingFollow(false);
    }
  }

  return (
    <div className="w-full lg:w-72 flex flex-col gap-4">
      <EngagementPanel
        promptId={prompt.id}
        initialLikes={prompt.likes}
        initialIsLiked={initialIsLiked}
        initialIsSaved={initialIsSaved}
      />
      {isOwner && <OwnerActions promptId={prompt.id} />}
      <StatsPanel prompt={prompt} />
      {author && (
        <CreatorPanel
          prompt={prompt}
          isOwner={isOwner}
          isFollowing={isFollowing}
          isLoadingFollow={isLoadingFollow}
          onToggleFollow={handleToggleFollow}
        />
      )}
      <AIEnhancementPanel />
    </div>
  );
}
