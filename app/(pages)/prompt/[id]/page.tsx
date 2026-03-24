// app/prompt/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Heart, Bookmark, Share2, ArrowRight } from "lucide-react";
import { auth } from "@/auth";

import { PromptViewTracker } from "../../../components/prompt/PromptViewTracker";
import PromptHeader from "../../../components/prompt/PromptHeader";
import OutputPreview from "../../../components/prompt/OutputPreview";
import PromptBody from "../../../components/prompt/PromptBody";
import ParametersSection from "../../../components/prompt/ParametersSection";
import CommentsSection from "../../../components/prompt/CommentsSection";
import EngagementPanel from "../../../components/prompt/EngagementPanel";
import StatsPanel from "../../../components/prompt/StatsPanel";
import CreatorPanel from "../../../components/prompt/CreatorPanel";
import AIEnhancementPanel from "../../../components/prompt/AIEnhancementPanel";
import OwnerActions from "../../../components/prompt/OwnerActions";

type PageProps = {
  params: Promise<{ id: string }>;
};

// 24‑char hex string for Mongo ObjectId
function isValidObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export default async function PromptPage({ params }: PageProps) {
  const { id } = await params;

  if (!isValidObjectId(id)) {
    return notFound();
  }

  const session = await auth();
  const userId = session?.user?.id || null;

  const prompt = await prisma.prompt.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
      likedBy: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
      saves: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
  });

  if (!prompt) return notFound();

  const initialIsLiked =
    Array.isArray((prompt as any).likedBy) &&
    (prompt as any).likedBy.length > 0;

  const initialIsSaved =
    Array.isArray((prompt as any).saves) &&
    (prompt as any).saves.length > 0;

  const isOwner = userId === prompt.authorId;

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-10 py-8">
      <PromptViewTracker id={prompt.id} />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <PromptHeader prompt={prompt} />
          <OutputPreview prompt={prompt} />
          <PromptBody prompt={prompt} />
          <ParametersSection />
          <CommentsSection
            promptId={prompt.id}
            currentUserId={userId}
            promptAuthorId={prompt.authorId}
          />
        </div>

        <div className="w-full lg:w-72 flex flex-col gap-4">
          <EngagementPanel
            promptId={prompt.id}
            initialLikes={prompt.likes}
            initialIsLiked={initialIsLiked}
            initialIsSaved={initialIsSaved}
          />
          {isOwner && <OwnerActions promptId={prompt.id} />}
          <StatsPanel prompt={prompt} />
          <CreatorPanel prompt={prompt} isOwner={isOwner} />
          <AIEnhancementPanel />
        </div>
      </div>
    </div>
  );
}
