"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProfileView from "@/components/ProfileView";
import { PostResponseDTO, UserResponseDTO } from "../types";
import { BASE_STYLES } from "@/lib/theme";
import Link from "next/link";

export default function UserProfile() {
  const params = useParams();
  const { token, username: loggedInUsername } = useAuth();
  const username = Array.isArray(params.username)
    ? params.username[0]
    : params.username;

  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);

  /* ── cursor ── */
  useEffect(() => {
    let raf: number;
    let rx = 0,
      ry = 0;
    const onMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
      rx += (e.clientX - rx) * 0.12;
      ry += (e.clientY - ry) * 0.12;
    };
    const loop = () => {
      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top = ry + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ── scroll progress ── */
  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      setScrollPct((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── fetch profile ── */
  useEffect(() => {
    async function fetchProfileData() {
      if (!username) return;
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.webnote.uz/api/users/${encodeURIComponent(username)}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        if (res.ok) {
          const data: UserResponseDTO = await res.json();
          setUser(data);
          setPosts(data.posts || []);
        } else {
          setUser(null);
          setPosts([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, [username, token]);

  /* ── loading state ── */
  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: BASE_STYLES }} />
        <div
          style={{
            minHeight: "100vh",
            background: "#0a0a08",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          {/* Animated dots */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "8px",
                  background: "#c0392b",
                  borderRadius: "50%",
                  animation: `blink 1.2s ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(245,240,232,0.25)",
            }}
          >
            Loading Profile
          </p>
        </div>
      </>
    );
  }

  /* ── not found state ── */
  if (!user) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: BASE_STYLES }} />
        <div ref={cursorRef} className="cursor" />
        <div ref={ringRef} className="cursor-ring" />

        <div
          style={{
            minHeight: "100vh",
            background: "#0a0a08",
            color: "#f5f0e8",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Grid background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(245,240,232,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,0.02) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              pointerEvents: "none",
            }}
          />

          {/* Ghost 404 */}
          <div
            style={{
              position: "absolute",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "clamp(14rem, 35vw, 30rem)",
              lineHeight: 1,
              color: "rgba(245,240,232,0.025)",
              userSelect: "none",
              letterSpacing: "-0.06em",
              pointerEvents: "none",
            }}
          >
            404
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              maxWidth: "500px",
              animation: "fadeUp 0.8s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            <p className="section-label" style={{ marginBottom: "24px" }}>
              Profile Not Found
            </p>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: "#f5f0e8",
                marginBottom: "32px",
              }}
            >
              No one here
              <br />
              <em style={{ color: "#c0392b", fontStyle: "italic" }}>
                by that name.
              </em>
            </h1>

            <div
              style={{
                borderLeft: "3px solid #c0392b",
                paddingLeft: "24px",
                textAlign: "left",
                marginBottom: "48px",
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  lineHeight: 1.8,
                  color: "rgba(245,240,232,0.4)",
                }}
              >
                The profile for{" "}
                <span
                  style={{
                    color: "#f5f0e8",
                    borderBottom: "1px solid rgba(192,57,43,0.5)",
                  }}
                >
                  @{username}
                </span>{" "}
                doesn&apos;t exist or may have been removed.
              </p>
            </div>

            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 32px",
                background: "#c0392b",
                color: "#f5f0e8",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  const isDashboard = loggedInUsername === username;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BASE_STYLES }} />
      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
      <div className="scanline" />
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a08",
          color: "#f5f0e8",
          paddingTop: "40px",
          paddingBottom: "80px",
        }}
      >
        <ProfileView user={user} posts={posts} isDashboard={isDashboard} />
      </div>
    </>
  );
}
