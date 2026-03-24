"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CommentUser = {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: CommentUser;
};

export default function CommentsSection({
  promptId,
  currentUserId,
  promptAuthorId,
}: {
  promptId: string;
  currentUserId?: string | null;
  promptAuthorId: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const canComment = !!currentUserId;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/prompts/${promptId}/comments`);
        if (!res.ok) return;
        const data = await res.json();
        setComments(data.comments || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [promptId]);

  const handleSubmit = async () => {
    if (!content.trim() || !canComment) return;

    setPosting(true);
    try {
      const res = await fetch(`/api/prompts/${promptId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) return;

      const data = await res.json();
      setComments((prev) => [data.comment, ...prev]);
      setContent("");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    const res = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  return (
    <section className="bg-[#05060a] border border-white/10 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-medium text-gray-300">Comments</h2>
        <span className="text-[11px] text-gray-500">
          {comments.length}
        </span>
      </div>

      {canComment ? (
        <div className="mb-4">
          <textarea
            className="w-full min-h-[70px] rounded-lg bg-black/60 border border-white/10 px-3 py-2 text-[12px] text-gray-200 outline-none focus:border-purple-500 transition resize-y"
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={posting || !content.trim()}
              className="px-3 py-1.5 rounded-full bg-purple-600 text-[11px] text-white hover:bg-purple-500 disabled:opacity-60"
            >
              Post
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-black/60 border border-white/10 px-4 py-6 mb-4 text-center text-sm text-gray-400">
          Sign in to view and post comments
        </div>
      )}

      {loading ? (
        <p className="text-[12px] text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-[12px] text-gray-500">
          No comments yet. Be the first to comment.
        </p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => {
            const isAuthor = c.user.id === currentUserId;
            const isPromptOwner = promptAuthorId === currentUserId;
            const canDelete = isAuthor || isPromptOwner;

            return (
              <li
                key={c.id}
                className="flex gap-3 items-start"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-[11px] text-gray-200">
                  {c.user.image ? (
                    <Image
                      src={c.user.image}
                      alt={c.user.name || c.user.username}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (c.user.name || c.user.username)
                      .charAt(0)
                      .toUpperCase()
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-gray-100">
                        {c.user.name || c.user.username}
                      </span>
                      <span className="text-[11px] text-gray-500">
                       <Link href={`/profile/${c.user.username}`}> @{c.user.username} </Link>  
                      </span>
                    </div>

                    {canDelete && (
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-[10px] text-gray-500 hover:text-red-400"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="mt-1 text-[12px] text-gray-200">
                    {c.content}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}