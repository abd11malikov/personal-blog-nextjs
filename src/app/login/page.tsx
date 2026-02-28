"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegisteredSuccess, setShowRegisteredSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setShowRegisteredSuccess(true);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://api.webnote.uz/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      const token = data.token;

      login(token, username);

      router.push("/");
    } catch (err) {
      setError("Login failed. Please check your username and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-500 font-light text-lg">
          Sign in to continue to your account.
        </p>
      </div>

      {showRegisteredSuccess && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Registration successful! Please log in.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:outline-none transition-all"
            placeholder="Enter your username"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white p-4 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-md active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-gray-500 mt-8 font-light">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-gray-900 font-semibold hover:underline decoration-2 underline-offset-4"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-gray-100 border-t-gray-900 rounded-full animate-spin"></div>
            <div className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">
              Loading Security...
            </div>
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
