"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProfileView from "@/components/ProfileView";
import { PostResponseDTO, UserResponseDTO } from "./types";

export default function Home() {
  const { username, token } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Dashboard state
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!username) return;

      try {
        setLoadingDashboard(true);

        // Fetch User Details which now includes posts for efficiency
        const userResponse = await fetch(
          `http://localhost:8080/api/users/${username}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        if (userResponse.ok) {
          const userData: UserResponseDTO = await userResponse.json();
          setUser(userData);
          // PostResponseDTO now has authorId, but ProfileView might expect author object
          // depending on how components are updated. For now, we use the posts from the user.
          setPosts(userData.posts || []);
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
  }, [username, mounted, token]);

  if (!mounted) {
    return null;
  }

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
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-[120px] opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New Portfolio Platform
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 text-gray-900 leading-[1.1]">
            Engineering the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Future of Web.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-xl text-gray-500 leading-relaxed font-medium">
            A bespoke Full-Stack CMS crafted for performance and scale.
            Experience a digital sandbox built with{" "}
            <span className="text-gray-900 font-bold">Spring Boot</span> and{" "}
            <span className="text-gray-900 font-bold">Next.js</span>.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl shadow-gray-200 hover:bg-gray-800 hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Get Started
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <a
              href="https://github.com/abd11malikov"
              target="_blank"
              className="w-full sm:w-auto px-10 py-4 bg-white text-gray-700 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Github
            </a>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
              Architecture
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
              How the platform is built
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "☕️",
                title: "Java Spring Boot 3",
                desc: "Robust REST API built with Java 21. Features complex JPA entity mapping, custom Exception Handling, and strict input validation.",
                color: "blue",
              },
              {
                icon: "⚛️",
                title: "Next.js 14 & SSR",
                desc: "Server-Side Rendering for perfect SEO and metadata. Styled with Tailwind CSS for a fully responsive, modern design system.",
                color: "indigo",
              },
              {
                icon: "☁️",
                title: "Cloud Infrastructure",
                desc: "Secured by Stateless JWT. Data persists in PostgreSQL, with assets served globally via Cloudflare R2 (S3 compatible).",
                color: "purple",
              },
            ].map((tech, i) => (
              <div
                key={i}
                className="group p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-300">
                  {tech.icon}
                </div>
                <h4 className="text-xl font-bold mb-4 text-gray-900">
                  {tech.title}
                </h4>
                <p className="text-gray-500 leading-relaxed text-sm font-medium">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              Why reinvent the wheel?
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-10 font-medium">
              Building a CMS from scratch isn&apos;t just about the tool—it&apos;s about
              mastering mechanics. I built WebNotes to dive deep into Full-Stack
              Architecture, secure authentication flows, and production-grade
              deployments.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors"
            >
              Read my engineering journey
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <span className="font-black tracking-tight text-xl">WebNotes</span>
          </div>
          <p className="text-sm text-gray-400 font-medium">
            © {new Date().getFullYear()} WebNotes. All rights reserved.{" "}
            <br className="sm:hidden" />
            Built with Passion by Otabek.
          </p>
        </div>
      </footer>
    </div>
  );
}