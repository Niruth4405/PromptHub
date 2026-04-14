export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-6xl mx-auto animate-pulse">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="h-9 w-56 rounded-lg bg-white/10 sm:h-10 sm:w-64" />
            <div className="h-4 w-72 max-w-full rounded bg-white/5" />
          </div>
        </header>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="h-10 flex-1 rounded-xl bg-white/10" />
            <div className="h-10 w-full rounded-xl bg-white/10 sm:w-40" />
            <div className="h-10 w-full rounded-xl bg-white/10 sm:w-40" />
            <div className="h-10 w-full rounded-xl bg-white/10 sm:w-40" />
          </div>
        </div>

        {/* Count */}
        <div className="mb-4 h-3 w-32 rounded bg-white/5" />

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="aspect-[16/10] w-full bg-white/10" />

              <div className="p-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  <div className="h-6 w-16 rounded-full bg-white/10" />
                  <div className="h-6 w-20 rounded-full bg-white/10" />
                  <div className="h-6 w-14 rounded-full bg-white/10" />
                </div>

                <div className="space-y-3">
                  <div className="h-5 w-4/5 rounded bg-white/10" />
                  <div className="h-4 w-full rounded bg-white/5" />
                  <div className="h-4 w-11/12 rounded bg-white/5" />
                  <div className="h-4 w-2/3 rounded bg-white/5" />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-white/10" />
                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded bg-white/10" />
                      <div className="h-3 w-16 rounded bg-white/5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-4 w-10 rounded bg-white/10" />
                    <div className="h-4 w-10 rounded bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}