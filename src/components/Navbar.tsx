"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { username, logout } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${searchQuery.trim().toLowerCase().replace("@", "")}`);
      setSearchQuery("");
      setIsSearchFocused(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <style>{`
        .nb-link {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.55);
          text-decoration: none;
          transition: color 0.2s;
          padding: 6px 0;
          position: relative;
        }
        .nb-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: #c0392b;
          transition: width 0.25s cubic-bezier(.22,1,.36,1);
        }
        .nb-link:hover {
          color: #f5f0e8;
        }
        .nb-link:hover::after {
          width: 100%;
        }
        .nb-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          background: #c0392b;
          color: #f5f0e8;
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.2s, background 0.2s;
          cursor: pointer;
          border: none;
        }
        .nb-btn-primary:hover {
          background: #a93226;
          transform: translateY(-1px);
        }
        .nb-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: transparent;
          color: rgba(245,240,232,0.55);
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid rgba(245,240,232,0.12);
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
          cursor: pointer;
        }
        .nb-btn-ghost:hover {
          border-color: rgba(245,240,232,0.35);
          color: #f5f0e8;
          transform: translateY(-1px);
        }
        .nb-search {
          background: rgba(245,240,232,0.04);
          border: 1px solid rgba(245,240,232,0.1);
          color: #f5f0e8;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          padding: 7px 12px 7px 34px;
          outline: none;
          width: 100%;
          transition: border-color 0.2s, background 0.2s;
        }
        .nb-search::placeholder {
          color: rgba(245,240,232,0.25);
        }
        .nb-search:focus {
          border-color: rgba(192,57,43,0.5);
          background: rgba(245,240,232,0.06);
        }
        .nb-mobile-link {
          display: block;
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.55);
          text-decoration: none;
          padding: 12px 0;
          border-bottom: 1px solid rgba(245,240,232,0.06);
          transition: color 0.2s;
        }
        .nb-mobile-link:hover {
          color: #f5f0e8;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nb-mobile-drawer {
          animation: slideDown 0.22s cubic-bezier(.22,1,.36,1) both;
        }
      `}</style>

      <nav
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 5000,
          padding: "0 16px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          background: scrolled ? "rgba(10,10,8,0.96)" : "rgba(10,10,8,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(245,240,232,0.07)",
          transition: "background 0.3s",
        }}
      >
        {/* ── Wordmark ── */}
        <Link
          href="/"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: "1.2rem",
            color: "#f5f0e8",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: "26px",
              height: "26px",
              background: "#c0392b",
              color: "#f5f0e8",
              fontSize: "0.6rem",
              fontFamily: "'DM Mono', monospace",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}
          >
            WN
          </span>
          <span className="hidden sm:inline">WebNotes</span>
        </Link>

        {/* ── Search bar — always visible, fills available space ── */}
        <div
          ref={searchRef}
          style={{ flex: 1, maxWidth: "380px", position: "relative" }}
        >
          <form onSubmit={handleSearch} style={{ position: "relative" }}>
            <svg
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "14px",
                height: "14px",
                color: isSearchFocused ? "#c0392b" : "rgba(245,240,232,0.3)",
                pointerEvents: "none",
                transition: "color 0.2s",
                flexShrink: 0,
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search usernames..."
              className="nb-search"
            />
            {searchQuery && (
              <span
                className="hidden sm:inline"
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  color: "rgba(245,240,232,0.2)",
                  textTransform: "uppercase",
                  pointerEvents: "none",
                }}
              >
                Enter
              </span>
            )}
          </form>
        </div>

        {/* ── Desktop nav ── */}
        <div
          className="hidden md:flex"
          style={{
            alignItems: "center",
            gap: "32px",
            flexShrink: 0,
          }}
        >
          <Link href="/" className="nb-link">
            Home
          </Link>
          <Link href="/about" className="nb-link">
            About
          </Link>

          {/* Hairline divider */}
          <div
            style={{
              width: "1px",
              height: "18px",
              background: "rgba(245,240,232,0.1)",
              flexShrink: 0,
            }}
          />

          {mounted ? (
            username ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <Link
                  href={`/${username}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "0.75")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "1")
                  }
                >
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      background: "rgba(192,57,43,0.18)",
                      border: "1px solid rgba(192,57,43,0.35)",
                      color: "#c0392b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.6rem",
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    {username[0].toUpperCase()}
                  </div>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      color: "rgba(245,240,232,0.7)",
                      textTransform: "uppercase",
                    }}
                  >
                    @{username}
                  </span>
                </Link>

                <button onClick={logout} className="nb-btn-ghost">
                  Logout
                </button>
              </div>
            ) : (
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Link href="/login" className="nb-link">
                  Sign in
                </Link>
                <Link href="/register" className="nb-btn-primary">
                  Get Started
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )
          ) : (
            <div
              style={{
                width: "120px",
                height: "30px",
                background: "rgba(245,240,232,0.05)",
              }}
            />
          )}
        </div>

        {/* ── Mobile: hamburger only — search is already in the bar ── */}
        <div
          className="md:hidden"
          style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(245,240,232,0.65)",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#f5f0e8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "rgba(245,240,232,0.65)")
            }
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 6h18M3 12h18M3 18h18"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {isOpen && (
        <div
          className="nb-mobile-drawer md:hidden"
          style={{
            position: "sticky",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 4999,
            background: "rgba(10,10,8,0.98)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(245,240,232,0.07)",
            padding: "20px 20px 28px",
          }}
        >
          {/* Nav links */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="nb-mobile-link"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="nb-mobile-link"
          >
            About
          </Link>

          {/* Auth section */}
          <div style={{ marginTop: "20px" }}>
            {mounted ? (
              username ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <Link
                    href={`/${username}`}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        background: "rgba(192,57,43,0.18)",
                        border: "1px solid rgba(192,57,43,0.35)",
                        color: "#c0392b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.65rem",
                        fontWeight: 500,
                      }}
                    >
                      {username[0].toUpperCase()}
                    </div>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.65rem",
                        letterSpacing: "0.12em",
                        color: "rgba(245,240,232,0.65)",
                        textTransform: "uppercase",
                      }}
                    >
                      @{username}
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="nb-btn-ghost"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="nb-btn-ghost"
                    style={{ justifyContent: "center" }}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="nb-btn-primary"
                    style={{ justifyContent: "center" }}
                  >
                    Get Started
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )
            ) : (
              <div
                style={{
                  height: "40px",
                  background: "rgba(245,240,232,0.05)",
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
