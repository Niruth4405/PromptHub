// app/explore/page.tsx
import { prisma } from "@/lib/prisma";
import { PromptCard } from "../../components/prompt/PromptCard";
import { ExploreFilters } from "../../components/explore/ExploreFilters";
import { Prisma } from "@prisma/client";

type ExplorePageProps = {
  searchParams: Promise<{
    query?: string;
    category?: string;
    tool?: string;
    sort?: string;
    price?: string;
  }>;
};

export default async function ExplorePage({
  searchParams,
}: ExplorePageProps) {
  const resolved = await searchParams;

  const query = resolved.query?.trim() ?? "";
  const category = resolved.category ?? "";
  const tool = resolved.tool ?? "";
  const sort = resolved.sort ?? "";
  const price = resolved.price ?? "";

  // ✅ Build filters safely (no TS issues)
  const andFilters: Prisma.PromptWhereInput[] = [];

  // 🔍 Search
  if (query) {
    andFilters.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: [query] } },
      ],
    });
  }

  // 🏷️ Category (multi-select)
  if (category) {
    andFilters.push({
      tags: { hasSome: category.split(",") },
    });
  }

  // 🤖 Tool (multi-select)
  if (tool) {
    andFilters.push({
      outputType: { in: tool.split(",") },
    });
  }

  // 💰 Price (optional future use)
  if (price === "Free") {
    // Uncomment if you add price field
    // andFilters.push({ price: 0 });
  }

  // ✅ Final WHERE
  const where: Prisma.PromptWhereInput = {
    isDraft: false,
    visibility: "public",
    ...(andFilters.length > 0 && { AND: andFilters }),
  };

  // 🔥 Sorting
  let orderBy:
    | Prisma.PromptOrderByWithRelationInput
    | Prisma.PromptOrderByWithRelationInput[] = {
    createdAt: "desc",
  };

  if (sort === "Most Liked") orderBy = { likes: "desc" };
  else if (sort === "Most Viewed") orderBy = { views: "desc" };
  else if (sort === "Latest") orderBy = { createdAt: "desc" };
  else if (sort === "Trending") {
    orderBy = [
      { likes: "desc" },
      { views: "desc" },
      { createdAt: "desc" },
    ];
  }

  // ✅ Fetch prompts
  const prompts = await prisma.prompt.findMany({
    where,
    orderBy,
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
        {/* Header */}
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

        {/* Filters */}
        <ExploreFilters initialQuery={query} />

        {/* Count */}
        <p className="text-xs text-gray-500 mb-4">
          Showing {prompts.length} prompts
        </p>

        {/* Grid */}
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