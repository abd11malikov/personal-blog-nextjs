"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { Post } from "../types";

interface ApiPost extends Omit<Post, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export default function BlogFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8080/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();

        const mappedData: Post[] = data.map((item: ApiPost) => ({
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
          },
          imageUrls: item.imageUrls || [],
          categories: item.categories || [],
          tags: item.tags || [],
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));

        setPosts(mappedData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight mb-6">
            Latest Posts
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed font-serif">
            Explore thoughts, tutorials, and updates from the community.
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="block group"
                >
                  <PostCard post={post} />
                </Link>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-sm border border-gray-100">
                <p className="text-gray-500 font-serif italic">
                  No posts published yet.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400 font-serif">
          © {new Date().getFullYear()} Web Notes. Built with Next.js & Spring
          Boot.
        </p>
      </footer>
    </div>
  );
}
