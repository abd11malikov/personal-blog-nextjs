"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ClientDeleteButtonProps {
  authorUsername: string;
  postId: number;
}

export default function ClientDeleteButton({
  authorUsername,
  postId,
}: ClientDeleteButtonProps) {
  const { username, token } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!username || username !== authorUsername) {
    return null;
  }

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `https://api.webnote.uz/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      alert("Post deleted successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full border border-gray-200 shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      {isDeleting ? "Deleting..." : "Delete Post"}
    </button>
  );
}
