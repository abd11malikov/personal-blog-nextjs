"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from "react";

export default function Navbar() {
  const { username, logout } = useAuth();

  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-800 hover:text-gray-900"
            >
              Otabek&apos;s Blog
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="text-gray-500 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                About Me
              </Link>
              <a
                href="https://github.com/abd11malikov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="hidden md:block">

            {mounted ? (
                username ? (
                    <div className="flex items-center justify-between gap-4">
                      <Link
                        href="/admin/create"
                        className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-500 transition-colors"
                      >
                        + New Post
                      </Link>
                      <button
                        onClick={logout}
                        className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-900 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                ) : (
                    <Link
                      href="/login"
                      className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                    >
                      Login
                    </Link>
                )
            ) : (
                <div className="w-20"></div> 
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}