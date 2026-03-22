// app/explore/page.tsx
import { prisma } from "@/lib/prisma";
import { PromptCard } from "../../components/prompt/PromptCard";
import { ExploreFilters } from "../../components/explore/ExploreFilters";

export default async function ExplorePage() {
  const prompts = await prisma.prompt.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold">
              Explore Prompts
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Discover prompts from the community.
            </p>
          </div>
        </header>

        {/* Search + Filters (client) */}
        <ExploreFilters />

        <p className="text-xs text-gray-500 mb-4">
          Showing {prompts.length} prompts
        </p>

        {/* Cards grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              id={prompt.id}
              title={prompt.title}
              description={prompt.description}
              image={prompt.image}
              tags={prompt.tags}
              tool={prompt.outputType || undefined}
              likes={prompt.likes}
              views={prompt.views}
              author={prompt.author}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
