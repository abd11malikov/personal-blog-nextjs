"use client";

import { PostResponseDTO, UserResponseDTO } from "@/app/types";

interface PostCardProps {
  post: PostResponseDTO;
  author?: UserResponseDTO;
}

export default function PostCard({ post, author }: PostCardProps) {
  const excerpt = post.content
    ? post.content.replace(/<[^>]*>/g, "").substring(0, 180) + "..."
    : "";

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "32px 0",
        position: "relative",
        cursor: "pointer",
        transition: "opacity 0.2s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.opacity = "0.85")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.opacity = "1")
      }
    >
      {/* Top meta row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Author */}
        {author && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {author.profileImageUrl ? (
              <img
                src={author.profileImageUrl}
                alt={author.username}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "1px solid rgba(245,240,232,0.12)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  background: "rgba(192,57,43,0.15)",
                  border: "1px solid rgba(192,57,43,0.3)",
                  color: "#c0392b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.5rem",
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {(
                  author.firstName?.[0] ||
                  author.username?.[0] ||
                  "?"
                ).toUpperCase()}
              </div>
            )}
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,0.45)",
              }}
            >
              {author.firstName
                ? `${author.firstName}${author.lastName ? ` ${author.lastName}` : ""}`
                : author.username}
            </span>
          </div>
        )}

        {author && (
          <span
            style={{
              color: "rgba(245,240,232,0.12)",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
            }}
          >
            /
          </span>
        )}

        {/* Date */}
        <time
          dateTime={post.createdAt}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(245,240,232,0.3)",
          }}
        >
          {formattedDate}
        </time>

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <>
            <span
              style={{
                color: "rgba(245,240,232,0.12)",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
              }}
            >
              /
            </span>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {post.categories.slice(0, 2).map((cat) => (
                <span
                  key={cat.id}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#c0392b",
                    border: "1px solid rgba(192,57,43,0.3)",
                    padding: "2px 8px",
                  }}
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main content row */}
      <div
        style={{
          display: "flex",
          gap: "32px",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)",
              color: "#f5f0e8",
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              marginBottom: "12px",
              wordBreak: "break-word",
            }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              lineHeight: 1.75,
              color: "rgba(245,240,232,0.4)",
              marginBottom: "0",
              wordBreak: "break-word",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {excerpt}
          </p>
        </div>

        {/* Thumbnail */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div
            style={{
              width: "100px",
              flexShrink: 0,
              alignSelf: "center",
              overflow: "hidden",
              border: "1px solid rgba(245,240,232,0.07)",
            }}
            className="hidden sm:block"
          >
            <img
              src={post.imageUrls[0]}
              alt={post.title}
              style={{
                width: "100%",
                height: "68px",
                objectFit: "cover",
                display: "block",
                filter: "grayscale(20%)",
                transition: "filter 0.3s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLImageElement).style.filter =
                  "grayscale(0%)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLImageElement).style.filter =
                  "grayscale(20%)")
              }
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Read arrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "4px",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(245,240,232,0.2)",
            transition: "color 0.2s",
          }}
        >
          Read
        </span>
        <svg
          width="16"
          height="8"
          viewBox="0 0 24 12"
          fill="none"
          stroke="rgba(245,240,232,0.2)"
          strokeWidth="1.5"
        >
          <path
            d="M0 6h22M16 1l6 5-6 5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </article>
  );
}
