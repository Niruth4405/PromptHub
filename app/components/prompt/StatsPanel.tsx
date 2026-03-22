export default function StatsPanel({ prompt }: { prompt: any }) {
  return (
    <section className="bg-[#05060a] border border-white/10 rounded-2xl p-4 text-[11px] text-gray-300">
      <h2 className="text-xs font-medium text-gray-200 mb-3">
        Stats
      </h2>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Views</span>
          <span>{prompt.views.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Likes</span>
          <span>{prompt.likes.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Remixes</span>
          <span>234</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Bookmarks</span>
          <span>89</span>
        </div>
      </div>
    </section>
  );
}