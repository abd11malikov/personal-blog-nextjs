"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProfileView from "@/components/ProfileView";
import { Post, UserResponseDTO } from "./types";

interface ApiPost extends Omit<Post, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const { username, token } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Dashboard state
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!username) return;

      try {
        setLoadingDashboard(true);

        // 1. Fetch User Details
        const userResponse = await fetch(
          `http://localhost:8080/api/users/${username}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }

        // 2. Fetch All Posts and Filter (assuming no user-posts endpoint)
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
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoadingDashboard(false);
      }
    }

    if (mounted && username) {
      fetchDashboardData();
    }
  }, [username, mounted]);

  if (!mounted) {
    return null; // Or a minimal loader
  }

  // --- LOGGED IN VIEW: DASHBOARD ---
  if (username) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        {loadingDashboard ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        ) : (
          user && <ProfileView user={user} posts={posts} isDashboard={true} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 font-serif text-gray-900">
          Building the Web, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-sans">
            One Line at a Time.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
          Welcome to my digital sandbox. I am <strong>Otabek</strong>, a
          Software Engineer from New Uzbekistan University. This isn&apos;t a
          WordPress template—it&apos;s a custom Full-Stack CMS built from
          scratch.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/blog"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Read My Posts
          </Link>
          <a
            href="https://github.com/abd11malikov"
            target="_blank"
            className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition"
          >
            View Source Code
          </a>
        </div>
      </section>

      <section className="bg-white py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 font-serif text-gray-900">
            How this platform is built ⚙️
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
              <div className="text-4xl mb-4">☕️</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Java Spring Boot 3
              </h3>
              <p className="text-gray-600 leading-relaxed">
                The core engine. A robust REST API built with Java 21. Features
                complex JPA entity mapping, custom Exception Handling, and
                strict input validation.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Next.js 14 & SSR
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Server-Side Rendering for perfect SEO and Telegram link
                previews. Styled with Tailwind CSS for a fully responsive,
                modern design.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
              <div className="text-4xl mb-4">☁️</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Cloud Infrastructure
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Secured by Stateless JWT Authentication. Data persists in a{" "}
                <strong>PostgreSQL</strong> cloud database, with images stored
                globally via <strong>Cloudflare R2 (S3)</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6 font-serif text-gray-900">
          Why reinvent the wheel?
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Anyone can set up a blog in 5 minutes using pre-made tools. But
          building the wheel yourself teaches you mechanics. I built this CMS to
          master <strong>Full-Stack Architecture</strong>, handle multipart
          image uploads, secure admin routes, and deploy Dockerized applications
          to production environments.
        </p>
        <Link
          href="/about"
          className="text-blue-600 font-semibold hover:text-blue-800 underline transition-colors"
        >
          Learn more about my journey &rarr;
        </Link>
      </section>
    </div>
  );
}
