// components/explore/ExploreFilters.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

const CATEGORY_OPTIONS = [
  "Art",
  "Development",
  "Marketing",
  "Writing",
  "Video",
  "Product",
];

const TOOL_OPTIONS = ["Midjourney", "DALL·E 3", "Stable Diffusion", "GPT-4"];

const SORT_OPTIONS = ["Trending", "Latest", "Most Liked", "Most Viewed"];

const PRICE_OPTIONS = ["All", "Free", "Paid"];

type ExploreFiltersProps = {
  initialQuery: string;
};

export function ExploreFilters({ initialQuery }: ExploreFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Trending");
  const [price, setPrice] = useState<string>("All");

  // search bar state
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Keep local query in sync with URL (?query=) so navbar and explore stay aligned
  useEffect(() => {
    const q = searchParams.get("query") ?? "";
    setQuery(q);
  }, [searchParams]);

  const toggleArray = (
    value: string,
    list: string[],
    setter: (v: string[]) => void,
  ) => {
    if (list.includes(value)) {
      setter(list.filter((v) => v !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      router.push("/explore");
    } else {
      router.push(`/explore?query=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Search + Filters button row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <form onSubmit={handleSearchSubmit}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts, creators, tags..."
              className="w-full flex items-center gap-2 rounded-full bg-[#05060a] border border-white/10 px-4 py-2 text-sm text-gray-200 placeholder:text-gray-500 outline-none focus:border-purple-500"
            />
          </form>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={clsx(
              "px-4 py-2 rounded-full text-xs sm:text-sm flex items-center gap-2 transition",
              showFilters
                ? "bg-purple-600 text-white"
                : "bg-[#05060a] border border-white/15 text-gray-100 hover:border-purple-500/60",
            )}
          >
            Filters
          </button>
          <button className="px-3 py-2 rounded-full bg-[#05060a] border border-white/10 text-xs">
            ⬜⬜
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="rounded-2xl bg-[#05060a] border border-white/10 px-4 sm:px-6 py-4 text-xs text-gray-300 space-y-4">
          <p className="text-sm font-medium text-gray-200">Filters</p>

          {/* Category */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className="w-24 text-[11px] text-gray-400">Category</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      toggleArray(cat, selectedCategories, setSelectedCategories)
                    }
                    className={clsx(
                      "px-3 py-1.5 rounded-full text-[11px] border transition",
                      active
                        ? "bg-purple-700 text-white border-purple-500"
                        : "bg-transparent text-purple-200 border-purple-700/60 hover:bg-purple-900/30",
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Tool */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className="w-24 text-[11px] text-gray-400">AI Tool</span>
            <div className="flex flex-wrap gap-2">
              {TOOL_OPTIONS.map((tool) => {
                const active = selectedTools.includes(tool);
                const colorClasses =
                  tool === "Midjourney"
                    ? "bg-purple-800/60 border-purple-400"
                    : tool === "DALL·E 3"
                    ? "bg-green-800/60 border-green-400"
                    : tool === "Stable Diffusion"
                    ? "bg-amber-800/60 border-amber-400"
                    : "bg-emerald-800/60 border-emerald-400";

                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() =>
                      toggleArray(tool, selectedTools, setSelectedTools)
                    }
                    className={clsx(
                      "px-3 py-1.5 rounded-full text-[11px] border transition",
                      active
                        ? colorClasses + " text-white"
                        : "bg-transparent text-gray-200 border-white/15 hover:border-purple-500/60",
                    )}
                  >
                    {tool}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className="w-24 text-[11px] text-gray-400">Sort By</span>
            <div className="flex flex-wrap gap-3">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSortBy(option)}
                  className={clsx(
                    "text-[11px] transition",
                    sortBy === option
                      ? "px-3 py-1.5 rounded-full bg-white text-black"
                      : "text-gray-300 hover:text-white",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className="w-24 text-[11px] text-gray-400">Price</span>
            <div className="flex flex-wrap gap-3 items-center">
              {PRICE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPrice(option)}
                  className={clsx(
                    "text-[11px] transition",
                    price === option
                      ? "px-3 py-1.5 rounded-full bg-white text-black"
                      : "text-gray-300 hover:text-white",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
