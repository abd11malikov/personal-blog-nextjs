"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface ClientEditButtonProps {
  authorUsername: string;
  slug: string;
}

export default function ClientEditButton({
  authorUsername,
  slug,
}: ClientEditButtonProps) {
  const { username } = useAuth();

  if (!username || username !== authorUsername) {
    return null;
  }

  return (
    <Link
      href={`/admin/edit/${slug}`}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
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
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
      Edit Post
    </Link>
  );
}