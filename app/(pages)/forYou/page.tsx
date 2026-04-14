import Link from "next/link";
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
    page?: string;
  }>;
};

const PAGE_SIZE = 12;

export default async function ForYouPage({
  searchParams,
}: ForYouPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 text-center max-w-md w-full">
          <h1 className="text-xl font-semibold text-white">Login required</h1>
          <p className="text-sm text-gray-400 mt-2">
            Please login to view your personalized feed.
          </p>
          <Link
            href="/login"
            className="inline-flex mt-5 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/5 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const resolved = await searchParams;

  const query = resolved.query?.trim() ?? "";
  const category = resolved.category ?? "";
  const tool = resolved.tool ?? "";
  const sort = resolved.sort ?? "";
  const price = resolved.price ?? "";
  const currentPage = Math.max(Number(resolved.page) || 1, 1);

  const userId = session.user.id;

  const andFilters: Prisma.PromptWhereInput[] = [];

  if (query) {
    andFilters.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: [query] } },
      ],
    });
  }

  if (category) {
    andFilters.push({
      tags: { hasSome: category.split(",") },
    });
  }

  if (tool) {
    andFilters.push({
      outputType: { in: tool.split(",") },
    });
  }

  if (price === "Free") {
    // Add real price filter here later if/when pricing is introduced
  }

  const baseWhere: Prisma.PromptWhereInput = {
    isDraft: false,
    visibility: "public",
    ...(andFilters.length > 0 && { AND: andFilters }),
  };

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

  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);
  const hasFollowing = followingIds.length > 0;

  const feedWhere: Prisma.PromptWhereInput = hasFollowing
    ? {
        ...baseWhere,
        authorId: { in: followingIds },
      }
    : baseWhere;

  const skip = (currentPage - 1) * PAGE_SIZE;

  const [prompts, totalPrompts] = await Promise.all([
    prisma.prompt.findMany({
      where: feedWhere,
      orderBy,
      skip,
      take: PAGE_SIZE,
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
    }),
    prisma.prompt.count({
      where: feedWhere,
    }),
  ]);

  const totalPages = Math.max(Math.ceil(totalPrompts / PAGE_SIZE), 1);

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();

    if (query) params.set("query", query);
    if (category) params.set("category", category);
    if (tool) params.set("tool", tool);
    if (sort) params.set("sort", sort);
    if (price) params.set("price", price);
    params.set("page", String(page));

    return `/forYou?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold">For You</h1>
            <p className="text-sm text-gray-400 mt-1">
              {hasFollowing
                ? "Prompts from people you follow."
                : "A curated public feed while you build your network."}
            </p>
          </div>
        </header>

        <ExploreFilters initialQuery={query} />

        <p className="text-xs text-gray-500 mb-4">
          Showing {prompts.length} of {totalPrompts} prompts
        </p>

        {!hasFollowing && (
          <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
            You’re not following anyone yet, so we’re showing popular public prompts for now.
          </div>
        )}

        {prompts.length === 0 ? (
          <div className="text-center py-20 text-gray-400 rounded-2xl border border-white/10 bg-white/[0.03]">
            <p className="text-lg text-white">No prompts found</p>
            <p className="text-sm mt-2">
              Try a different search, adjust your filters, or follow more creators.
            </p>
          </div>
        ) : (
          <>
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

            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <p className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <Link
                    href={createPageUrl(Math.max(currentPage - 1, 1))}
                    aria-disabled={currentPage === 1}
                    className={`rounded-lg px-4 py-2 text-sm transition ${
                      currentPage === 1
                        ? "pointer-events-none border border-white/10 text-gray-600"
                        : "border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Previous
                  </Link>

                  <Link
                    href={createPageUrl(Math.min(currentPage + 1, totalPages))}
                    aria-disabled={currentPage === totalPages}
                    className={`rounded-lg px-4 py-2 text-sm transition ${
                      currentPage === totalPages
                        ? "pointer-events-none border border-white/10 text-gray-600"
                        : "border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Next
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}