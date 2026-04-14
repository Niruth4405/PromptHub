"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Search, User, LogOut, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

type UserResult = {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = searchQuery.trim();

    if (!q) {
      setSearchResults([]);
      setSearchOpen(false);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      setSearchLoading(true);

      try {
        const res = await fetch(
          `/api/search/users?q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );

        if (!res.ok || controller.signal.aborted) return;

        const data = await res.json();

        if (controller.signal.aborted) return;

        setSearchResults(data.users || []);
        setSearchOpen(true);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("User search failed:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  const handleDesktopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    router.push(`/explore?query=${encodeURIComponent(q)}`);
    setSearchOpen(false);
  };

  const handleMobileSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = String(formData.get("mobile-search") || "").trim();

    if (!q) return;

    setOpen(false);
    router.push(`/explore?query=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    setOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  const isAuthenticated = status === "authenticated" && !!session?.user;
  const isLoadingSession = status === "loading";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b0f1a]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">✨</span>
          <span className="font-semibold text-lg text-white">
            Prompt<span className="text-purple-400">Hub</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <Link
            href="/explore"
            className="hover:text-white transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/forYou"
            className="hover:text-white transition-colors"
          >
            For You
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleDesktopSearchSubmit}>
              <Search
                className="absolute left-3 top-2.5 text-gray-500"
                size={16}
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                autoComplete="off"
                className="w-56 lg:w-72 pl-9 pr-3 py-2 rounded-lg bg-[#111827] text-sm text-white placeholder-gray-500 outline-none border border-white/10 focus:border-purple-500"
              />
            </form>

            {searchOpen && (searchResults.length > 0 || searchLoading) && (
              <div className="absolute mt-1 w-full rounded-xl bg-black border border-white/10 shadow-lg z-40 max-h-64 overflow-y-auto">
                {searchLoading && (
                  <div className="px-3 py-2 text-[11px] text-gray-500">
                    Searching users...
                  </div>
                )}

                {!searchLoading && searchResults.length === 0 && (
                  <div className="px-3 py-2 text-[11px] text-gray-500">
                    No users found
                  </div>
                )}

                {!searchLoading &&
                  searchResults.map((user) => (
                    <Link
                      key={user.id}
                      href={`/profile/${user.username}`}
                      className="flex items-center gap-2 px-3 py-2 text-[12px] text-gray-100 hover:bg-white/5 transition"
                      onClick={() => setSearchOpen(false)}
                    >
                      <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[11px]">
                        {(user.name || user.username).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">
                          {user.name || user.username}
                        </span>
                        <span className="text-[10px] text-gray-500 truncate">
                          @{user.username}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>

          <Link href="/shareOrEditPrompt">
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm hover:opacity-90 transition">
              + Share
            </button>
          </Link>

          {isLoadingSession ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
              <div className="h-4 w-20 rounded bg-white/10 animate-pulse" />
            </div>
          ) : isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2"
              >
                <Image
                  width={32}
                  height={32}
                  src={session.user.image || "/avatar.png"}
                  className="w-8 h-8 rounded-full border border-white/10 object-cover"
                  alt="avatar"
                />
                <span className="text-sm text-gray-200 max-w-28 truncate">
                  {session.user.name}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#111827] border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
                  <Link
                    href={`/profile/${session.user.username}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition"
                  >
                    <User size={16} />
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Login
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden text-white shrink-0"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-5 space-y-4 text-sm text-gray-300 border-t border-white/10">
          <div className="flex flex-col gap-3 pt-4">
            <Link href="/explore" className="hover:text-white transition-colors">
              Explore
            </Link>
            <Link href="/forYou" className="hover:text-white transition-colors">
              For You
            </Link>
          </div>

          <form onSubmit={handleMobileSearchSubmit}>
            <input
              name="mobile-search"
              placeholder="Search users..."
              autoComplete="off"
              className="w-full px-3 py-2 rounded-lg bg-[#111827] text-white outline-none border border-white/10 focus:border-purple-500"
            />
          </form>

          <Link href="/shareOrEditPrompt">
            <button className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90 transition">
              + Share
            </button>
          </Link>

          {isLoadingSession ? (
            <div className="border border-white/10 rounded-xl bg-[#0f172a] p-3 space-y-3 mt-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-white/10" />
                  <div className="h-3 w-16 rounded bg-white/5" />
                </div>
              </div>
            </div>
          ) : isAuthenticated ? (
            <div className="border border-white/10 rounded-xl bg-[#0f172a] p-3 space-y-3 mt-4">
              <div className="flex items-center gap-3">
                <Image
                  src={session.user.image || "/avatar.png"}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border border-white/10 object-cover"
                  alt="avatar"
                  priority
                />
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {session.user.name}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    @{session.user.username}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href={`/profile/${session.user.username}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition"
                >
                  <User size={16} />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-white/10 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="block text-center border border-white/10 py-2 rounded-lg hover:bg-white/5 transition"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}