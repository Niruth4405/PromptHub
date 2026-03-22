export default function ParametersSection() {
  return (
    <section className="bg-[#05060a] border border-white/10 rounded-2xl p-4 sm:p-5">
      <h2 className="text-xs font-medium text-gray-300 mb-3">
        Parameters
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-black/60 border border-white/10 px-3 py-3">
          <p className="text-[11px] text-gray-500 mb-1">AR</p>
          <p className="text-sm text-gray-200">16:9</p>
        </div>
        <div className="rounded-xl bg-black/60 border border-white/10 px-3 py-3">
          <p className="text-[11px] text-gray-500 mb-1">Stylize</p>
          <p className="text-sm text-gray-200">750</p>
        </div>
        <div className="rounded-xl bg-black/60 border border-white/10 px-3 py-3">
          <p className="text-[11px] text-gray-500 mb-1">Chaos</p>
          <p className="text-sm text-gray-200">15</p>
        </div>
      </div>
    </section>
  );
}
