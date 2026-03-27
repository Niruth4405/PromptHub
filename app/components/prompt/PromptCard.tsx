// components/PromptCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Heart, Eye } from "lucide-react";

type PromptAuthor = {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
};

type PromptCardProps = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  tags: string[];
  tool?: string; // e.g. "Midjourney"
  likes: number;
  views: number;
  author: PromptAuthor;
};

export function PromptCard({
  id,
  title,
  description,
  image,
  tags,
  tool,
  likes,
  views,
  author,
}: PromptCardProps) {
  const mainTags = tags.slice(0, 3);
  const extraCount = tags.length > 3 ? tags.length - 3 : 0;

  return (
    <Link
      href={`/prompt/${id}`}
      className="group block rounded-3xl bg-[#05060a] border border-white/10 hover:border-purple-400 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] transition-all duration-200 overflow-hidden"
    >
      {/* Top image area */}
      <div className="relative h-56 w-full overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Tool pill */}
        {tool && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-purple-600/90 px-2.5 py-1 text-[11px] font-medium text-white shadow-md">
              {tool}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
        {/* Title + description */}
        <div className="mb-3">
          <h3 className="text-sm sm:text-base font-semibold text-gray-100 group-hover:text-purple-300 transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-[11px] sm:text-xs text-gray-400 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Author + stats */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-[10px] text-gray-300">
              {author.image ? (
                <Image
                  src={author.image}
                  alt={author.name || author.username}
                  width={24}
                  height={24}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                (author.name || author.username).charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-200">
                {author.name || author.username}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <div className="flex items-center gap-1">
              <Heart
                size={13}
                className={clsx(
                  "stroke-gray-400 group-hover:stroke-pink-400",
                  likes > 0 && "fill-pink-500/70 stroke-pink-400",
                )}
              />
              <span>{formatCount(likes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye
                size={13}
                className="stroke-gray-400 group-hover:stroke-purple-300"
              />
              <span>{formatCount(views)}</span>
            </div>
          </div>
        </div>

        {/* Divider before tags */}
        {tags.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/5">
            <div className="flex flex-wrap gap-2 mt-1.5">
              {mainTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-purple-900/20 px-2 py-0.5 text-[10px] text-purple-200 border border-purple-500/30"
                >
                  {tag}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="rounded-full bg-purple-900/20 px-2 py-0.5 text-[10px] text-purple-200 border border-purple-500/30">
                  +{extraCount}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

function formatCount(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}
