// app/for-you/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PromptCard } from "../../components/prompt/PromptCard";
import { ExploreFilters } from "../../components/explore/ExploreFilters";
import { Prisma } from "@prisma/client";

type ForYouPageProps = {
  searchParams: Promise<{
    query?: string;
    category?: string;
    tool?: string;
    sort?: string;
    price?: string;
  }>;
};

export default async function ForYouPage({
  searchParams,
}: ForYouPageProps) {
  const session = await auth();

  // 🔒 Not logged in
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Please login to view your feed.</p>
      </div>
    );
  }

  const resolved = await searchParams;

  const query = resolved.query?.trim() ?? "";
  const category = resolved.category ?? "";
  const tool = resolved.tool ?? "";
  const sort = resolved.sort ?? "";
  const price = resolved.price ?? "";

  const userId = session.user.id;

  // ✅ FIX: Use separate array (NO .push on baseWhere)
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

  // 🏷️ Category
  if (category) {
    andFilters.push({
      tags: { hasSome: category.split(",") },
    });
  }

  // 🤖 Tool
  if (tool) {
    andFilters.push({
      outputType: { in: tool.split(",") },
    });
  }

  // 💰 Price (optional)
  if (price === "Free") {
    // andFilters.push({ price: 0 });
  }

  // ✅ Final WHERE
  const baseWhere: Prisma.PromptWhereInput = {
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

  // 1. Get following users
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);

  // 2. Fetch prompts
  const prompts =
    followingIds.length > 0
      ? await prisma.prompt.findMany({
          where: {
            ...baseWhere,
            authorId: { in: followingIds },
          },
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
        })
      : await prisma.prompt.findMany({
          where: baseWhere,
          orderBy,
          take: 20,
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
              For You
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Prompts from people you follow.
            </p>
          </div>
        </header>

        {/* Filters */}
        <ExploreFilters initialQuery={query} />

        {/* Count */}
        <p className="text-xs text-gray-500 mb-4">
          Showing {prompts.length} prompts
        </p>

        {/* Empty State */}
        {prompts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No prompts found</p>
            <p className="text-sm mt-2">
              Try a different search or follow more creators 🚀
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}