"use client";
import { useState } from "react";
import { Post } from "@/app/types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [likes, setLikes] = useState(0);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikes((prev) => prev + 1);
  };

  // Create a clean excerpt from the content
  const excerpt = post.content
    ? post.content.replace(/<[^>]*>/g, "").substring(0, 160) + "..."
    : "";

  return (
    <div className="flex flex-col md:flex-row gap-8 py-4 group cursor-pointer">
      {/* Content Column */}
      <div className="flex-1 flex flex-col justify-between order-2 md:order-1">
        <div>
          {/* Author Info */}
          <div className="flex items-center space-x-2 mb-3">
            {post.author.profileImageUrl ? (
              <img
                src={post.author.profileImageUrl}
                alt={post.author.username}
                className="h-6 w-6 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase">
                {post.author.firstName?.[0] || post.author.username?.[0]}
              </div>
            )}
            <span className="text-xs font-semibold text-gray-900">
              {post.author.firstName} {post.author.lastName}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 leading-tight">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-500 font-light text-sm md:text-base leading-relaxed line-clamp-3 mb-4">
            {excerpt}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1.5 text-gray-400 hover:text-red-500 transition-colors group/like"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${
                  likes > 0 ? "fill-red-500 text-red-500" : "fill-none"
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-xs font-medium">
                {likes > 0 ? likes : "Like"}
              </span>
            </button>
            <div className="flex gap-2">
              {post.categories?.slice(0, 2).map((cat) => (
                <span
                  key={cat.id}
                  className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider font-bold rounded-full"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>

          <div className="text-gray-300">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Image Column */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="w-full md:w-48 lg:w-56 h-32 md:h-auto order-1 md:order-2 overflow-hidden rounded-xl border border-gray-50">
          <img
            src={post.imageUrls[0]}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
