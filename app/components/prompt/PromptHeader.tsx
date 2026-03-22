import Link from "next/link";
import { prisma } from "@/lib/prisma";

type PromptWithAuthor = Awaited<ReturnType<typeof getPromptStub>>;
// helper only for TS; defined below
async function getPromptStub() {
  return prisma.prompt.findFirst({
    select: { id: true },
  });
}
export default function PromptHeader({ prompt }: { prompt: any }) {
  return (
    <section className="bg-[#05060a] border border-white/10 rounded-2xl px-4 sm:px-6 py-4">
      {/* breadcrumb */}
      <div className="mb-3 text-[11px] text-gray-500 flex items-center gap-1">
        <Link href="/explore" className="hover:text-gray-300">
          Explore
        </Link>
        <span>/</span>
        <span>Art</span>
        <span>/</span>
        <span className="text-gray-300">{prompt.title}</span>
      </div>

      {/* tool + visibility */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {prompt.outputType && (
          <span className="inline-flex items-center rounded-full bg-purple-700/80 px-2.5 py-1 text-[11px] font-medium text-white">
            {prompt.outputType}
          </span>
        )}
        {prompt.visibility && (
          <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-gray-200">
            {prompt.visibility === "paid" ? "Paid" : "Free"}
          </span>
        )}
      </div>

      {/* title + description */}
      <h1 className="text-xl sm:text-2xl font-semibold">
        {prompt.title}
      </h1>
      <p className="mt-2 text-sm text-gray-400">
        {prompt.description}
      </p>

      {/* tags row */}
      {prompt.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          {prompt.tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-full bg-purple-900/20 px-2.5 py-0.5 text-purple-200 border border-purple-500/30"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
