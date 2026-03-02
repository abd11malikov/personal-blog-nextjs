"use client";

import Link from "next/link";
import { UserResponseDTO, PostResponseDTO } from "@/app/types";
import UserProfileHeader from "@/components/UserProfileHeader";
import PostCard from "@/components/PostCard";

interface ProfileViewProps {
  user: UserResponseDTO;
  posts: PostResponseDTO[];
  isDashboard?: boolean;
}

export default function ProfileView({
  user,
  posts,
  isDashboard = false,
}: ProfileViewProps) {
  return (
    <div
      style={{
        maxWidth: "1080px",
        margin: "0 auto",
        padding: "0 40px",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "56px",
          flexWrap: "wrap",
          gap: "20px",
          animation: "fadeUp 0.6s cubic-bezier(.22,1,.36,1) both",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <Link
            href="/"
            style={{
              color: "rgba(245,240,232,0.4)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#f5f0e8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "rgba(245,240,232,0.4)")
            }
          >
            Home
          </Link>
          <span style={{ color: "rgba(245,240,232,0.15)" }}>—</span>
          <span
            style={{
              color: "#c0392b",
            }}
          >
            {isDashboard ? "Dashboard" : "Profile"}
          </span>
        </div>

        {/* Dashboard actions */}
        {isDashboard && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              href="/settings"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "transparent",
                border: "1px solid rgba(245,240,232,0.15)",
                color: "rgba(245,240,232,0.6)",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(245,240,232,0.35)";
                (e.currentTarget as HTMLElement).style.color = "#f5f0e8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(245,240,232,0.15)";
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(245,240,232,0.6)";
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              Edit Profile
            </Link>
            <Link
              href="/admin/create"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "11px 24px",
                background: "#c0392b",
                color: "#f5f0e8",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)")
              }
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Post
            </Link>
          </div>
        )}
      </div>

      {/* ── Profile header ── */}
      <div
        style={{
          marginBottom: "80px",
          animation: "fadeUp 0.7s 0.1s cubic-bezier(.22,1,.36,1) both",
        }}
      >
        <UserProfileHeader user={user} postCount={posts.length} />
      </div>

      {/* ── Divider ── */}
      <div
        style={{
          borderTop: "1px solid rgba(245,240,232,0.08)",
          marginBottom: "64px",
        }}
      />

      {/* ── Posts section ── */}
      <div style={{ maxWidth: "720px" }}>
        {/* Section heading */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "56px",
            animation: "fadeUp 0.7s 0.2s cubic-bezier(.22,1,.36,1) both",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#c0392b",
                marginBottom: "8px",
              }}
            >
              {posts.length} {posts.length === 1 ? "story" : "stories"}
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                color: "#f5f0e8",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {isDashboard
                ? "Your Published Work"
                : `Stories by ${user.firstName || user.username}`}
            </h2>
          </div>
        </div>

        {/* Posts list */}
        {posts.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {posts.map((post, i) => (
              <div
                key={post.id}
                style={{
                  position: "relative",
                  borderBottom: "1px solid rgba(245,240,232,0.07)",
                  animation: `fadeUp 0.7s ${0.25 + i * 0.07}s cubic-bezier(.22,1,.36,1) both`,
                }}
              >
                {/* Dashboard edit button */}
                {isDashboard && (
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "0",
                      zIndex: 10,
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Link
                      href={`/admin/edit/${post.slug}`}
                      title="Edit"
                      style={{
                        width: "32px",
                        height: "32px",
                        background: "rgba(245,240,232,0.04)",
                        border: "1px solid rgba(245,240,232,0.1)",
                        color: "rgba(245,240,232,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                        transition:
                          "background 0.2s, color 0.2s, border-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(192,57,43,0.12)";
                        (e.currentTarget as HTMLElement).style.color =
                          "#c0392b";
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(192,57,43,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(245,240,232,0.04)";
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(245,240,232,0.4)";
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(245,240,232,0.1)";
                      }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </Link>
                  </div>
                )}

                <Link
                  href={`/post/${post.slug}`}
                  style={{ display: "block", textDecoration: "none" }}
                >
                  <PostCard post={post} author={user} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            style={{
              padding: "72px 40px",
              border: "1px dashed rgba(245,240,232,0.1)",
              textAlign: "center",
              animation: "fadeUp 0.7s 0.3s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            {/* Ghost icon */}
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "5rem",
                color: "rgba(245,240,232,0.04)",
                lineHeight: 1,
                marginBottom: "32px",
                userSelect: "none",
              }}
            >
              ∅
            </div>

            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#c0392b",
                marginBottom: "16px",
              }}
            >
              No Stories Yet
            </p>

            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "1.8rem",
                color: "#f5f0e8",
                marginBottom: "16px",
                letterSpacing: "-0.02em",
              }}
            >
              {isDashboard ? "The page is blank." : "Coming soon."}
            </h3>

            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                lineHeight: 1.8,
                color: "rgba(245,240,232,0.35)",
                maxWidth: "360px",
                margin: "0 auto 40px",
              }}
            >
              {isDashboard
                ? "You haven't published anything yet. Every great writer starts with a single sentence."
                : "This author is currently preparing their first story. Check back soon."}
            </p>

            {isDashboard && (
              <Link
                href="/admin/create"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 32px",
                  background: "#c0392b",
                  color: "#f5f0e8",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform =
                    "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)")
                }
              >
                Write Your First Post
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
