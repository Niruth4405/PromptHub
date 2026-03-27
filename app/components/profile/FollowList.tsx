"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";

export type FollowUser = {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
};

type FollowListProps = {
  users: FollowUser[];
  emptyLabel: string;
  actionLabel: string; // "Unfollow" or "Remove"
  mode?: "unfollow" | "remove-follower";
};

export default function FollowList({
  users,
  emptyLabel,
  actionLabel,
  mode = "unfollow",
}: FollowListProps) {
  const [localUsers, setLocalUsers] = useState(users);
  const [isPending, startTransition] = useTransition();

  if (localUsers.length === 0) {
    return <p className="text-gray-400 text-sm">{emptyLabel}</p>;
  }

  const handleClick = (user: FollowUser) => {
    startTransition(async () => {
      await fetch("/api/follow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: user.id,
          mode: mode === "remove-follower" ? "remove-follower" : undefined,
        }),
      });

      setLocalUsers((prev) => prev.filter((u) => u.id !== user.id));
    });
  };

  return (
    <div className="space-y-3">
      {localUsers.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#111827] border border-white/10"
        >
          <Link
            href={`/profile/${user.username}`}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-xs text-gray-200">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || user.username}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              ) : (
                (user.name || user.username).charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-100">
                {user.name || user.username}
              </span>
              <span className="text-xs text-gray-500">@{user.username}</span>
            </div>
          </Link>

          <button
            onClick={() => handleClick(user)}
            disabled={isPending}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/20 text-gray-200 hover:bg-white/10 disabled:opacity-60"
          >
            {actionLabel}
          </button>
        </div>
      ))}
    </div>
  );
}
