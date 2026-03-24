// app/explore/page.tsx
import { prisma } from "@/lib/prisma";
import { PromptCard } from "../../components/prompt/PromptCard";
import { ExploreFilters } from "../../components/explore/ExploreFilters";

type ExplorePageProps = {
  searchParams: Promise<{ query?: string }>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolved = await searchParams;
  const query = resolved.query?.trim() ?? "";

  const prompts = await prisma.prompt.findMany({
    where: query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { tags: { hasSome: [query] } },
          ],
        }
      : undefined,
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
  }); // awaits searchParams before using it, as required in Next.js app router [web:173][web:176]

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

        <ExploreFilters initialQuery={query} />

        <p className="text-xs text-gray-500 mb-4">
          Showing {prompts.length} prompts
        </p>

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
