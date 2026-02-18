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
    setLikes((likes) => {
      return likes + 1;
    });
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white min-h-0">
      <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>
      <p className="text-gray-600 mt-2 break-words line-clamp-5">
        {post.description}
      </p>
      <p className="text-sm text-gray-400 mt-4">{post.author}</p>

      <div className="mt-4 flex items-center">
        <button
          onClick={handleLike}
          className="border p-4 px-3 py-1 rounded hover:bg-gray-700 hover:text-neutral-50"
        >
          Like
        </button>
        <span className="ml-4">{likes}</span>
      </div>
    </div>
  );
}
