export default function CommentsPlaceholder() {
  return (
    <section className="bg-[#05060a] border border-white/10 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-medium text-gray-300">Comments</h2>
        <span className="text-[11px] text-gray-500">12</span>
      </div>

      <div className="rounded-xl bg-black/60 border border-white/10 px-4 py-10 flex flex-col items-center justify-center gap-3 text-center">
        <div className="text-gray-500 text-sm">
          Sign in to view and post comments
        </div>
        <button className="px-4 py-2 rounded-full bg-white text-black text-xs font-medium hover:bg-gray-100">
          Sign in
        </button>
      </div>
    </section>
  );
}