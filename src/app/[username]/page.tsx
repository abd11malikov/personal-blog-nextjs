"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProfileView from "@/components/ProfileView";
import { Post, UserResponseDTO } from "../types";

interface ApiPost extends Omit<Post, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export default function UserProfile() {
  const params = useParams();
  const { token, username: loggedInUsername } = useAuth();
  const username = Array.isArray(params.username)
    ? params.username[0]
    : params.username;

  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      if (!username) return;

      try {
        setLoading(true);

        // 1. Fetch User Details
        const userResponse = await fetch(
          `http://localhost:8080/api/users/${encodeURIComponent(username)}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }

        // 2. Fetch All Posts and Filter
        const postsResponse = await fetch("http://localhost:8080/api/posts");
        if (postsResponse.ok) {
          const data = await postsResponse.json();
          const userPosts = data
            .filter((item: ApiPost) => item.author.username === username)
            .map((item: ApiPost) => ({
              id: item.id,
              slug: item.slug,
              title: item.title,
              content: item.content,
              author: {
                id: item.author.id,
                firstName: item.author.firstName || "",
                lastName: item.author.lastName || "",
                email: item.author.email || "",
                profileImageUrl: item.author.profileImageUrl || "",
                bio: item.author.bio || "",
                username: item.author.username || "",
                socialMediaLinks: item.author.socialMediaLinks || {},
              },
              imageUrls: item.imageUrls || [],
              categories: item.categories || [],
              tags: item.tags || [],
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
            }));
          setPosts(userPosts);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [username, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-50 rounded-full border-t-gray-900 animate-spin"></div>
        </div>
        <div className="text-sm font-bold uppercase tracking-widest text-gray-400 animate-pulse">
          Loading Profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-50 text-red-500">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
            User not found
          </h2>
          <p className="text-gray-500 text-lg font-light mb-10 leading-relaxed">
            The profile for{" "}
            <span className="font-semibold text-gray-900">@{username}</span>{" "}
            doesn't seem to exist or may have been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all shadow-md group"
          >
            <svg
              className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isDashboard = loggedInUsername === username;

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <ProfileView user={user} posts={posts} isDashboard={isDashboard} />
    </div>
  );
}
