import Image from "next/image";
import Link from "next/link";

type CreatorPanelProps = {
  prompt: any;
  isOwner: boolean;
  isFollowing: boolean;
  isLoadingFollow?: boolean;
  onToggleFollow: () => void;
};

export default function CreatorPanel({
  prompt,
  isOwner,
  isFollowing,
  isLoadingFollow = false,
  onToggleFollow,
}: CreatorPanelProps) {
  const author = prompt?.author;
  if (isOwner || !author) return null;

  return (
    <section className="bg-[#05060a] border border-white/10 rounded-2xl p-4 text-[11px] text-gray-300">
      <h2 className="text-xs font-medium text-gray-200 mb-3">Creator</h2>

      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-[12px] text-gray-200">
          {author.image ? (
            <Image
              src={author.image}
              alt={author.name || author.username}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          ) : (
            (author.name || author.username).charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex flex-col">
          <Link
            href={`/profile/${author.username}`}
            className="text-[14px] text-gray-100"
          >
            <span>{author.name || author.username}</span>
          </Link>

          <span className="text-[11px] text-gray-500">@{author.username}</span>
        </div>
      </div>

      <button
        className={`cursor-pointer w-full rounded-full text-xs font-medium py-2 mb-2 transition ${
          isFollowing
            ? "bg-white/5 border border-white/30 text-gray-200 hover:bg-white/10"
            : "bg-white text-black hover:bg-gray-100"
        }`}
        disabled={isLoadingFollow}
        onClick={onToggleFollow}
      >
        {isLoadingFollow ? "..." : isFollowing ? "Following" : "Follow"}
      </button>

      <button className="w-full rounded-full bg-white/5 border border-white/15 text-[11px] py-2 text-gray-200 hover:bg-white/10 transition">
        $
      </button>
    </section>
  );
}
