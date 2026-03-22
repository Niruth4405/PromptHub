"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Search, User, LogOut, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full border-b border-white/10 bg-[#0b0f1a]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="font-semibold text-lg text-white">
            Prompt<span className="text-purple-400">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <Link href="/explore" className="hover:text-white">
            Explore
          </Link>
          <Link href="/leaderboard" className="hover:text-white">
            Leaderboard
          </Link>
          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-500"
              size={16}
            />
            <input
              placeholder="Search prompts..."
              className="pl-9 pr-3 py-2 rounded-lg bg-[#111827] text-sm text-white placeholder-gray-500 outline-none border border-white/10 focus:border-purple-500"
            />
          </div>

          {/* Share */}
          <Link href='/shareOrEditPrompt'>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm">
              + Share
            </button>
          </Link>

          {/* Auth */}
          {session?.user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Trigger */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2"
              >
                <Image
                  width={32}
                  height={32}
                  src={session.user.image || "/avatar.png"}
                  className="w-8 h-8 rounded-full border border-white/10"
                  alt="avatar"
                />
                <span className="text-sm text-gray-200">
                  {session.user.name}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {/* Dropdown */}
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
                    onClick={() => signOut()}
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
              className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-300 hover:text-white"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-3 text-sm text-gray-300">
          <Link href="/explore">Explore</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/pricing">Pricing</Link>

          <input
            placeholder="Search..."
            className="w-full px-3 py-2 rounded-lg bg-[#111827] text-white"
          />

          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
            Share
          </button>

          {session?.user ? (
            <>
              <Link
                href={`/profile/${session.user.username}`}
                className="block"
              >
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="text-red-400 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block text-center border border-white/10 py-2 rounded-lg"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
