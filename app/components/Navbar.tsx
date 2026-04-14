"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Search, User, LogOut, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setOpen(false);
    router.push(`/explore?query=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    setOpen(false);
    const toastId = toast.loading("Signing out...");
    await signOut({ callbackUrl: "/" });
    toast.success("Signed out successfully.", { id: toastId, duration: 2000 });
  };

  const isAuthenticated = status === "authenticated" && !!session?.user;
  const isLoadingSession = status === "loading";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b0f1a]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">✨</span>
          <span className="font-semibold text-lg text-white">
            PromptHub
          </span>
        </Link>

        {/* Desktop search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2"
        >
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
          />
        </form>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/explore"
            className="text-sm text-gray-300 hover:text-white transition"
          >
            Explore
          </Link>

          {isLoadingSession ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : isAuthenticated ? (
            <>
              <Link
                href="/shareOrEditPrompt?mode=create"
                className="px-4 py-1.5 rounded-full bg-purple-600 text-sm text-white hover:bg-purple-500 transition"
              >
                + Share Prompt
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full hover:bg-white/5 px-2 py-1 transition"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                  )}
                  <span className="text-sm text-gray-200">{session.user.name}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                    <Link
                      href={`/profile/${(session.user as User).username}`}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <User size={14} />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-red-400 transition"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full border border-white/20 text-sm text-gray-300 hover:text-white hover:border-white/40 transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0b0f1a] px-4 py-4 space-y-4">
          {/* Mobile search */}
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2"
          >
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
            />
          </form>

          <Link
            href="/explore"
            className="block text-sm text-gray-300 hover:text-white transition"
          >
            Explore
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/shareOrEditPrompt?mode=create"
                className="block px-4 py-2 rounded-full bg-purple-600 text-sm text-white text-center hover:bg-purple-500 transition"
              >
                + Share Prompt
              </Link>

              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                )}
                <div>
                  <p className="text-sm text-white font-medium">{session.user.name}</p>
                  <p className="text-xs text-gray-400">@{(session.user as User).username}</p>
                </div>
              </div>

              <Link
                href={`/profile/${(session.user as User).username}`}
                className="block text-sm text-gray-300 hover:text-white transition"
              >
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-red-400 transition"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block text-center px-4 py-2 rounded-full border border-white/20 text-sm text-gray-300 hover:text-white hover:border-white/40 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
