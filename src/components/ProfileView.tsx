"use client";

import Link from "next/link";
import { UserResponseDTO, Post } from "@/app/types";
import UserProfileHeader from "@/app/components/UserProfileHeader";
import PostCard from "@/components/PostCard";

interface ProfileViewProps {
  user: UserResponseDTO;
  posts: Post[];
  isDashboard?: boolean;
}

export default function ProfileView({
  user,
  posts,
  isDashboard = false,
}: ProfileViewProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Top Navigation / Breadcrumb Style Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex items-center space-x-2 text-sm text-gray-400 uppercase tracking-widest font-bold">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">
            {isDashboard ? "Dashboard" : "Author Profile"}
          </span>
        </div>

        {isDashboard && (
          <div className="flex items-center space-x-3">
            <Link
              href="/settings"
              className="px-5 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              Edit Profile
            </Link>
            <Link
              href="/admin/create"
              className="px-5 py-2 text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all shadow-md flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Write Article
            </Link>
          </div>
        )}
      </div>

      {/* User Info Section */}
      <div className="mb-16">
        <UserProfileHeader user={user} postCount={posts.length} />
      </div>

      {/* Posts Section */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            {isDashboard
              ? "Your Published Stories"
              : `Stories by ${user.firstName || user.username}`}
          </h2>
          <div className="h-px flex-1 bg-gray-100 ml-8 hidden sm:block"></div>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-12">
            {posts.map((post) => (
              <div key={post.id} className="group relative">
                {isDashboard && (
                  <div className="absolute right-2 top-2 lg:right-auto lg:-left-12 lg:top-2 flex flex-col space-y-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10">
                    <Link
                      href={`/admin/edit/${post.id}`}
                      className="p-2.5 bg-white/90 backdrop-blur-md lg:bg-white text-gray-500 hover:text-blue-600 rounded-full border border-gray-200 shadow-lg lg:shadow-sm transition-all"
                      title="Edit Post"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                  </div>
                )}

                <Link
                  href={`/post/${post.slug}`}
                  className="block transition-transform duration-300 group-hover:-translate-y-1"
                >
                  <PostCard post={post} />
                </Link>
                <div className="mt-8 border-b border-gray-50"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 px-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14 2v4a2 2 0 002 2h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              No stories yet
            </h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8 font-light">
              {isDashboard
                ? "You haven't shared any of your thoughts with the world yet."
                : "This author is currently preparing their first masterpiece."}
            </p>
            {isDashboard && (
              <Link
                href="/admin/create"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                Start writing your first post
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
