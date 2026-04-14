export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-purple-400" />
        <div className="text-sm text-gray-400">Loading PromptHub...</div>
      </div>
    </div>
  );
}