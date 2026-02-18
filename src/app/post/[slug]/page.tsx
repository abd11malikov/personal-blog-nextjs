import Link from "next/link";
import { Post } from "@/app/types";

async function getPost(slug: string): Promise<Post> {
  const res = await fetch(`http://localhost:8080/api/posts/slug/${slug}`);

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const data = await res.json();
  
  const author = await data.author;
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.content,
    author: author.firstName,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <div className="max-w-3xl mx-auto p-10 bg-white min-h-screen mt-10 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 capitalize break-words">
        {post.title}
      </h1>

      <div className="flex items-center text-gray-500 mb-8 border-b pb-4">
        <span>By {post.author}</span>
        <span className="mx-2">|</span>
        <span className="text-sm italic break-all">{post.slug}</span>
      </div>

      <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
        {post.description}
      </p>

      <div className="mt-12">
        <Link
          href="/"
          className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-900 transition"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
