export default function AIEnhancementPanel() {
  const actions = [
    "Make it more cinematic",
    "Increase detail level",
    "Make it more realistic",
    "Auto-generate tags",
  ];

  return (
    <section className="bg-[#05060a] border border-white/10 rounded-2xl p-4 text-[11px] text-gray-300">
      <h2 className="text-xs font-medium text-gray-200 mb-3">
        AI Enhancement
      </h2>

      <div className="space-y-2">
        {actions.map((a) => (
          <button
            key={a}
            className="w-full rounded-lg bg-black/50 border border-white/10 px-3 py-2 text-left text-[11px] text-gray-200 hover:border-purple-500/60 hover:bg-black/70 transition"
          >
            {a}
          </button>
        ))}
      </div>

      <button className="mt-3 w-full text-[11px] text-gray-500 hover:text-gray-300 text-left">
        Report this prompt
      </button>
    </section>
  );
}