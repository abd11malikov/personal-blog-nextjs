"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { MockPost, Post } from "./types";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching data...");

        const response = await fetch("http://localhost:8080/api/posts");
        const data = await response.json();

        const mappedData: Post[] = data.map((item: MockPost) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          description: item.content,
          author: item.user_id,
        }));

        setPosts(mappedData);
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        My Posts 🖇📃
      </h1>

      {loading ? (
        <p className="text-center text-xl text-blue-500">Loading posts...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.slug}`}>
              <PostCard post={post} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
