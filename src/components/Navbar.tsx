"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { username, logout } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Assuming users are viewed at /[username]
      router.push(`/${searchQuery.trim().replace("@", "")}`);
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight hidden sm:block">
                WebNotes
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className={`h-5 w-5 transition-colors ${isSearchFocused ? "text-blue-500" : "text-gray-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search usernames..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
              />
              {searchQuery && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 border border-gray-200 rounded text-xs font-sans text-gray-400">
                    Enter
                  </kbd>
                </div>
              )}
            </form>
          </div>

          {/* Navigation Links & Auth */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              About
            </Link>

            <div className="h-4 w-[1px] bg-gray-200 mx-2"></div>

            {mounted ? (
              username ? (
                <div className="flex items-center gap-3">
                  <Link
                    href={`/${username}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">
                      {username[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      @{username}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="ml-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all shadow-sm active:scale-95"
                  >
                    Get Started
                  </Link>
                </div>
              )
            ) : (
              <div className="w-24 h-9 bg-gray-100 animate-pulse rounded-lg"></div>
            )}
          </div>

          {/* Mobile Menu Icon (Placeholder for functionality) */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-500 p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
