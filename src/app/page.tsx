"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProfileView from "@/components/ProfileView";
import { PostResponseDTO, UserResponseDTO } from "./types";

/* ─────────────────────────────────────────────
   Inline styles & keyframes injected once
───────────────────────────────────────────── */
const GLOBAL_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:     #0a0a08;
    --paper:   #f5f0e8;
    --cream:   #ede8d8;
    --rust:    #c0392b;
    --gold:    #b8860b;
    --muted:   #6b6555;
    --border:  #2a2820;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--ink);
    color: var(--paper);
    font-family: 'DM Mono', monospace;
    overflow-x: hidden;
    cursor: none;
  }

  ::selection { background: var(--rust); color: var(--paper); }

  /* ── Custom cursor ── */
  .cursor {
    position: fixed;
    top: 0; left: 0;
    width: 12px; height: 12px;
    background: var(--rust);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, background 0.2s;
    mix-blend-mode: difference;
  }
  .cursor-ring {
    position: fixed;
    top: 0; left: 0;
    width: 40px; height: 40px;
    border: 1px solid rgba(192,57,43,0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: transform 0.08s linear, width 0.2s, height 0.2s, border-color 0.2s;
  }

  /* ── Animations ── */
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-60px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes revealWidth {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%       { transform: translateY(-8px) rotate(1deg); }
    66%       { transform: translateY(4px) rotate(-1deg); }
  }
  @keyframes grain {
    0%, 100% { transform: translate(0,0); }
    10%       { transform: translate(-1%,-2%); }
    30%       { transform: translate(2%,1%); }
    50%       { transform: translate(-2%,2%); }
    70%       { transform: translate(1%,-1%); }
    90%       { transform: translate(-1%,1%); }
  }
  @keyframes stampIn {
    0%   { opacity: 0; transform: scale(1.4) rotate(-12deg); }
    60%  { opacity: 1; transform: scale(0.95) rotate(3deg); }
    100% { opacity: 1; transform: scale(1) rotate(6deg); }
  }
  @keyframes numberCount {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes drawLine {
    from { stroke-dashoffset: 1000; }
    to   { stroke-dashoffset: 0; }
  }

  .anim-fade-up   { animation: fadeUp  0.8s cubic-bezier(.22,1,.36,1) both; }
  .anim-slide-in  { animation: slideIn 0.9s cubic-bezier(.22,1,.36,1) both; }

  /* ── Noise overlay ── */
  .noise::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    animation: grain 0.5s steps(1) infinite;
    z-index: 1;
    opacity: 0.3;
  }

  /* ── Typography ── */
  .font-display { font-family: 'Playfair Display', serif; }
  .font-syne    { font-family: 'Syne', sans-serif; }
  .font-mono    { font-family: 'DM Mono', monospace; }

  /* ── Nav ── */
  .nav-link {
    position: relative;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--paper);
    text-decoration: none;
    padding-bottom: 2px;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    height: 1px;
    background: var(--rust);
    width: 0;
    transition: width 0.3s ease;
  }
  .nav-link:hover::after { width: 100%; }

  /* ── Buttons ── */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    background: var(--rust);
    color: var(--paper);
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    cursor: none;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s;
  }
  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--ink);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.4s cubic-bezier(.77,0,.18,1);
  }
  .btn-primary:hover::before  { transform: scaleX(1); transform-origin: left; }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-primary span { position: relative; z-index: 1; }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 32px;
    background: transparent;
    color: var(--paper);
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    text-decoration: none;
    border: 1px solid rgba(245,240,232,0.3);
    cursor: none;
    transition: border-color 0.3s, color 0.3s, transform 0.2s;
  }
  .btn-ghost:hover {
    border-color: var(--paper);
    transform: translateY(-2px);
  }

  /* ── Tech card ── */
  .tech-card {
    border: 1px solid rgba(245,240,232,0.1);
    padding: 40px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.3s;
    background: rgba(245,240,232,0.02);
  }
  .tech-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px;
    height: 0;
    background: var(--rust);
    transition: height 0.4s cubic-bezier(.22,1,.36,1);
  }
  .tech-card:hover { border-color: rgba(245,240,232,0.25); transform: translateY(-4px); }
  .tech-card:hover::before { height: 100%; }

  /* ── Stat block ── */
  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 900;
    line-height: 1;
    color: var(--paper);
  }

  /* ── Ticker ── */
  .ticker-track {
    animation: ticker 28s linear infinite;
    will-change: transform;
  }

  /* ── Divider ── */
  .rule { border: none; border-top: 1px solid rgba(245,240,232,0.12); }

  /* ── Scanline ── */
  .scanline {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 3px;
    background: linear-gradient(transparent, rgba(192,57,43,0.08), transparent);
    pointer-events: none;
    z-index: 9000;
    animation: scanline 8s linear infinite;
  }

  /* ── Scroll indicator ── */
  .scroll-progress {
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: var(--rust);
    z-index: 9001;
    transition: width 0.1s linear;
  }

  /* ── Section label ── */
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--rust);
  }

  /* ── Stamp ── */
  .stamp {
    display: inline-block;
    border: 3px solid var(--rust);
    color: var(--rust);
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 4px 10px;
    transform: rotate(6deg);
    animation: stampIn 0.6s 1.2s cubic-bezier(.22,1,.36,1) both;
  }

  /* ── Underline accent ── */
  .accent-underline {
    position: relative;
    display: inline-block;
  }
  .accent-underline::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    height: 3px;
    background: var(--rust);
    animation: revealWidth 0.8s 0.9s cubic-bezier(.22,1,.36,1) both;
  }

  /* Mobile nav drawer */
  .mobile-menu {
    position: fixed;
    inset: 0;
    background: var(--ink);
    z-index: 8000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px;
    transform: translateX(100%);
    transition: transform 0.5s cubic-bezier(.77,0,.18,1);
  }
  .mobile-menu.open { transform: translateX(0); }

  /* Responsive hero text */
  .hero-headline {
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    line-height: 0.92;
    font-size: clamp(3.5rem, 12vw, 10rem);
    letter-spacing: -0.03em;
  }

  /* ── Animated border on feature ── */
  .feature-border {
    position: relative;
  }
  .feature-border::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, var(--rust), transparent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s cubic-bezier(.22,1,.36,1);
  }
  .feature-border:hover::after { transform: scaleX(1); }

  /* Pullquote */
  .pullquote {
    border-left: 3px solid var(--rust);
    padding-left: 28px;
  }
`;

const TICKER_ITEMS = [
  "Spring Boot 3",
  "★",
  "Next.js 16",
  "★",
  "PostgreSQL",
  "★",
  "JWT Auth",
  "★",
  "Cloudflare R2",
  "★",
  "Java 21",
  "★",
  "REST API",
  "★",
  "TypeScript",
  "★",
  "Tailwind CSS",
  "★",
  "Docker",
  "★",
];

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function Home() {
  const { username, token } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Custom cursor
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Scroll progress
  const [scrollPct, setScrollPct] = useState(0);

  // Intersection observer for staggered reveals
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );

  /* ── Mount ── */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Cursor tracking ── */
  useEffect(() => {
    if (!mounted) return;
    let rafId: number;
    let rx = 0,
      ry = 0;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX,
        y = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = x + "px";
        cursorRef.current.style.top = y + "px";
      }
      rx += (x - rx) * 0.12;
      ry += (y - ry) * 0.12;
    };

    const loop = () => {
      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top = ry + "px";
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  /* ── Scroll progress ── */
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
      setScrollPct(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Intersection observer ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id) {
            setVisibleSections((prev) => new Set([...prev, e.target.id]));
          }
        });
      },
      { threshold: 0.15 },
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [mounted]);

  /* ── Dashboard data ── */
  useEffect(() => {
    async function fetchData() {
      if (!username) return;
      try {
        setLoadingDashboard(true);
        const res = await fetch(
          `https://api.webnote.uz/api/users/${username}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );
        if (res.ok) {
          const data: UserResponseDTO = await res.json();
          setUser(data);
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDashboard(false);
      }
    }
    if (mounted && username) fetchData();
  }, [username, mounted, token]);

  if (!mounted) return null;

  /* ── Authenticated dashboard ── */
  if (username) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        <div
          style={{
            minHeight: "100vh",
            background: "var(--ink)",
            paddingTop: "48px",
            paddingBottom: "48px",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          {loadingDashboard ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
                gap: "8px",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "var(--rust)",
                    borderRadius: "50%",
                    animation: `blink 1.2s ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          ) : (
            user && <ProfileView user={user} posts={posts} isDashboard={true} />
          )}
        </div>
      </>
    );
  }

  /* ── Landing page ── */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      {/* Custom cursor */}
      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />

      {/* Scanline effect */}
      <div className="scanline" />

      {/* Scroll progress */}
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      <div
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          overflowX: "hidden",
        }}
      >
        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section
          className="noise"
          style={{
            minHeight: "100vh",
            paddingTop: "80px",
            paddingBottom: "80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Grid lines background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(245,240,232,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,0.03) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              pointerEvents: "none",
            }}
          />

          {/* Large BG number */}
          <div
            style={{
              position: "absolute",
              right: "-2%",
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "clamp(20rem, 40vw, 50rem)",
              lineHeight: 1,
              color: "rgba(245,240,232,0.02)",
              pointerEvents: "none",
              userSelect: "none",
              letterSpacing: "-0.05em",
            }}
          >
            01
          </div>

          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 40px",
              width: "100%",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Issue label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "48px",
                animation: "fadeUp 0.6s 0.1s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              <span className="section-label">Vol. I — Issue 001</span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(245,240,232,0.12)",
                  maxWidth: "80px",
                }}
              />
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--rust)",
                    display: "inline-block",
                    animation: "blink 2s infinite",
                  }}
                />
                <span
                  className="section-label"
                  style={{ color: "var(--paper)", opacity: 0.5 }}
                >
                  LIVE
                </span>
              </div>
            </div>

            {/* Main headline */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "0",
                position: "relative",
              }}
            >
              <h1
                className="hero-headline anim-fade-up"
                style={{
                  color: "var(--paper)",
                  animationDelay: "0.2s",
                }}
              >
                Engineer
              </h1>
              <h1
                className="hero-headline"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px var(--paper)",
                  opacity: 0.35,
                  animation: "fadeUp 0.8s 0.35s cubic-bezier(.22,1,.36,1) both",
                }}
              >
                the Future
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "24px",
                  flexWrap: "wrap",
                }}
              >
                <h1
                  className="hero-headline"
                  style={{
                    color: "var(--rust)",
                    animation:
                      "fadeUp 0.8s 0.5s cubic-bezier(.22,1,.36,1) both",
                  }}
                >
                  of Web.
                </h1>
                <div
                  className="stamp"
                  style={{ marginBottom: "12px", flexShrink: 0 }}
                >
                  Open Source
                </div>
              </div>
            </div>

            {/* Horizontal rule */}
            <hr
              className="rule"
              style={{
                marginTop: "48px",
                marginBottom: "48px",
                animation: "revealWidth 1s 0.7s both",
                transformOrigin: "left",
              }}
            />

            {/* Sub-row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "48px",
                flexWrap: "wrap",
                animation: "fadeUp 0.8s 0.8s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              <div style={{ maxWidth: "500px" }}>
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.85rem",
                    lineHeight: 1.8,
                    color: "rgba(245,240,232,0.55)",
                    letterSpacing: "0.02em",
                  }}
                >
                  A bespoke full-stack CMS engineered for performance, scale,
                  and mastery. Built on{" "}
                  <em
                    style={{
                      color: "var(--paper)",
                      fontStyle: "normal",
                      borderBottom: "1px solid var(--rust)",
                    }}
                  >
                    Spring Boot 3
                  </em>{" "}
                  and{" "}
                  <em
                    style={{
                      color: "var(--paper)",
                      fontStyle: "normal",
                      borderBottom: "1px solid var(--rust)",
                    }}
                  >
                    Next.js 16
                  </em>
                  — a technical playground, not a template.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginTop: "40px",
                    flexWrap: "wrap",
                  }}
                >
                  <Link href="/register" className="btn-primary">
                    <span>Start Writing</span>
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
                  <a
                    href="https://github.com/abd11malikov"
                    target="_blank"
                    className="btn-ghost"
                    rel="noopener noreferrer"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    <span>GitHub</span>
                  </a>
                </div>
              </div>

              {/* Floating stats card */}
              <div
                style={{
                  border: "1px solid rgba(245,240,232,0.1)",
                  padding: "32px",
                  minWidth: "240px",
                  position: "relative",
                  animation: "float 6s ease-in-out infinite",
                  background: "rgba(245,240,232,0.02)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    width: "8px",
                    height: "8px",
                    background: "var(--rust)",
                    borderRadius: "50%",
                    animation: "blink 1.5s infinite",
                  }}
                />
                <p className="section-label" style={{ marginBottom: "24px" }}>
                  Stack Overview
                </p>
                {[
                  { key: "Backend", val: "Spring Boot 3" },
                  { key: "Frontend", val: "Next.js 16" },
                  { key: "Database", val: "PostgreSQL" },
                  { key: "Auth", val: "JWT / Stateless" },
                  { key: "Storage", val: "Cloudflare R2" },
                ].map((item) => (
                  <div
                    key={item.key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(245,240,232,0.07)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.65rem",
                        color: "rgba(245,240,232,0.4)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.key}
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.7rem",
                        color: "var(--paper)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              animation: "fadeUp 1s 1.4s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            <span
              className="section-label"
              style={{ color: "rgba(245,240,232,0.3)" }}
            >
              Scroll
            </span>
            <div
              style={{
                width: "1px",
                height: "40px",
                background: "linear-gradient(var(--rust), transparent)",
                animation: "fadeUp 0.8s 1.6s ease both",
              }}
            />
          </div>
        </section>

        {/* ══════════════════════════════════════
            TICKER
        ══════════════════════════════════════ */}
        <div
          style={{
            borderTop: "1px solid rgba(245,240,232,0.1)",
            borderBottom: "1px solid rgba(245,240,232,0.1)",
            padding: "14px 0",
            overflow: "hidden",
            background: "rgba(245,240,232,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "max-content",
            }}
            className="ticker-track"
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color:
                    item === "★" ? "var(--rust)" : "rgba(245,240,232,0.45)",
                  paddingRight: "32px",
                  whiteSpace: "nowrap",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            ARCHITECTURE SECTION
        ══════════════════════════════════════ */}
        <section
          id="arch"
          data-reveal="arch"
          style={{
            padding: "120px 40px",
            maxWidth: "1280px",
            margin: "0 auto",
            opacity: visibleSections.has("arch") ? 1 : 0,
            transform: visibleSections.has("arch")
              ? "translateY(0)"
              : "translateY(40px)",
            transition:
              "opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1)",
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "72px",
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(5rem, 12vw, 10rem)",
                fontWeight: 900,
                color: "rgba(245,240,232,0.06)",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              02
            </span>
            <div>
              <p className="section-label" style={{ marginBottom: "8px" }}>
                Architecture
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  color: "var(--paper)",
                  lineHeight: 1.1,
                }}
              >
                How the platform
                <br />
                <em style={{ color: "var(--rust)", fontStyle: "italic" }}>
                  is built
                </em>
              </h2>
            </div>
          </div>

          {/* 3-col cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1px",
              background: "rgba(245,240,232,0.08)",
            }}
          >
            {[
              {
                num: "01",
                icon: "☕",
                title: "Java Spring Boot 3",
                sub: "Robust REST API",
                desc: "Engineered with Java 21. Complex JPA entity mapping, custom exception handling, strict input validation, and layered security via Spring Security.",
                tags: ["Java 21", "JPA", "REST", "Security"],
              },
              {
                num: "02",
                icon: "⚛",
                title: "Next.js 16 & SSR",
                sub: "Rendering Layer",
                desc: "Server-side rendering for flawless SEO and metadata control. Typed with TypeScript, styled with Tailwind CSS for a fully responsive design system.",
                tags: ["TypeScript", "SSR", "Tailwind", "SEO"],
              },
              {
                num: "03",
                icon: "☁",
                title: "Cloud Infrastructure",
                sub: "Data & Storage",
                desc: "Stateless JWT authentication. Persistent data in PostgreSQL with full relational mapping. Assets served globally via Cloudflare R2 (S3 compatible).",
                tags: ["JWT", "PostgreSQL", "R2", "Docker"],
              },
            ].map((card, i) => (
              <div
                key={i}
                className="tech-card"
                style={{
                  background: "var(--ink)",
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "32px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "3rem",
                      fontWeight: 900,
                      color: "rgba(245,240,232,0.06)",
                      lineHeight: 1,
                    }}
                  >
                    {card.num}
                  </span>
                  <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>
                    {card.icon}
                  </span>
                </div>

                <p className="section-label" style={{ marginBottom: "8px" }}>
                  {card.sub}
                </p>
                <h3
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    color: "var(--paper)",
                    marginBottom: "16px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    lineHeight: 1.8,
                    color: "rgba(245,240,232,0.45)",
                    marginBottom: "28px",
                  }}
                >
                  {card.desc}
                </p>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--rust)",
                        border: "1px solid rgba(192,57,43,0.3)",
                        padding: "3px 8px",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════ */}
        <div
          style={{
            borderTop: "1px solid rgba(245,240,232,0.08)",
            borderBottom: "1px solid rgba(245,240,232,0.08)",
            background: "rgba(245,240,232,0.02)",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "60px 40px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "40px",
            }}
          >
            {[
              { num: "100%", label: "Type-safe codebase" },
              { num: "< 100ms", label: "API response time" },
              { num: "∞", label: "Scalability ceiling" },
              { num: "0", label: "Vendor lock-in" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div className="stat-num">{stat.num}</div>
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.4)",
                    marginTop: "8px",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            PHILOSOPHY
        ══════════════════════════════════════ */}
        <section
          id="philosophy"
          data-reveal="philosophy"
          style={{
            padding: "140px 40px",
            maxWidth: "1280px",
            margin: "0 auto",
            opacity: visibleSections.has("philosophy") ? 1 : 0,
            transform: visibleSections.has("philosophy")
              ? "translateY(0)"
              : "translateY(40px)",
            transition:
              "opacity 0.9s 0.1s cubic-bezier(.22,1,.36,1), transform 0.9s 0.1s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "80px",
              alignItems: "center",
            }}
            className="grid-cols-1 md:grid-cols-2"
          >
            {/* Left: Big number + label */}
            <div>
              <span
                style={{
                  display: "block",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(6rem, 18vw, 16rem)",
                  fontWeight: 900,
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(245,240,232,0.1)",
                  lineHeight: 0.85,
                  letterSpacing: "-0.04em",
                  userSelect: "none",
                }}
              >
                03
              </span>
              <p className="section-label" style={{ marginTop: "24px" }}>
                Engineering Philosophy
              </p>
            </div>

            {/* Right: Content */}
            <div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 700,
                  color: "var(--paper)",
                  lineHeight: 1.15,
                  marginBottom: "40px",
                  letterSpacing: "-0.02em",
                }}
              >
                Why reinvent
                <br />
                <em style={{ color: "var(--rust)", fontStyle: "italic" }}>
                  the wheel?
                </em>
              </h2>

              <div className="pullquote" style={{ marginBottom: "32px" }}>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontSize: "1.15rem",
                    lineHeight: 1.7,
                    color: "rgba(245,240,232,0.75)",
                  }}
                >
                  &ldquo;Building a CMS from scratch isn&apos;t just about the
                  tool &mdash; it&apos;s about mastering mechanics.&rdquo;
                </p>
              </div>

              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.8rem",
                  lineHeight: 1.9,
                  color: "rgba(245,240,232,0.5)",
                  marginBottom: "40px",
                }}
              >
                I built WebNotes to dive deep into full-stack architecture,
                secure authentication flows, and production-grade deployments.
                Every line of code is intentional — no shortcuts, no magic
                wrappers, no excuses.
              </p>

              <Link
                href="/about"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--paper)",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--rust)",
                  paddingBottom: "4px",
                  transition: "color 0.2s",
                }}
              >
                Read the full story
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
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FEATURES GRID
        ══════════════════════════════════════ */}
        <section
          id="features"
          data-reveal="features"
          style={{
            padding: "0 40px 140px",
            maxWidth: "1280px",
            margin: "0 auto",
            opacity: visibleSections.has("features") ? 1 : 0,
            transform: visibleSections.has("features")
              ? "translateY(0)"
              : "translateY(40px)",
            transition:
              "opacity 0.9s 0.15s cubic-bezier(.22,1,.36,1), transform 0.9s 0.15s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "64px",
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(4rem, 10vw, 8rem)",
                fontWeight: 900,
                color: "rgba(245,240,232,0.05)",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              04
            </span>
            <div>
              <p className="section-label" style={{ marginBottom: "8px" }}>
                Platform
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  color: "var(--paper)",
                  lineHeight: 1.1,
                }}
              >
                Core{" "}
                <em style={{ color: "var(--rust)", fontStyle: "italic" }}>
                  Features
                </em>
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "0",
              border: "1px solid rgba(245,240,232,0.08)",
            }}
          >
            {[
              {
                icon: "✍",
                title: "Rich Content Editor",
                desc: "Write and publish posts with full Markdown support, image uploads, categories, and tags.",
              },
              {
                icon: "🔐",
                title: "Secure Auth",
                desc: "Stateless JWT-based authentication with refresh token rotation and Spring Security.",
              },
              {
                icon: "👤",
                title: "User Profiles",
                desc: "Custom profiles with bio, social links, avatar, and a personal blog feed.",
              },
              {
                icon: "⚡",
                title: "SSR Performance",
                desc: "Server-rendered pages for instant load, perfect Core Web Vitals, and dynamic metadata.",
              },
              {
                icon: "🖼",
                title: "Asset Management",
                desc: "Cloudflare R2-backed image storage. Upload once, serve globally at edge speed.",
              },
              {
                icon: "🐳",
                title: "Containerized Deploy",
                desc: "Dockerized Spring Boot backend with docker-compose, ready for any cloud provider.",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="feature-border"
                style={{
                  padding: "40px 32px",
                  borderRight:
                    (i + 1) % 3 === 0
                      ? "none"
                      : "1px solid rgba(245,240,232,0.08)",
                  borderBottom:
                    i < 3 ? "1px solid rgba(245,240,232,0.08)" : "none",
                  transition: "background 0.3s",
                  cursor: "default",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(245,240,232,0.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    fontSize: "1.8rem",
                    marginBottom: "20px",
                    display: "block",
                  }}
                >
                  {feat.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--paper)",
                    marginBottom: "12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    lineHeight: 1.8,
                    color: "rgba(245,240,232,0.4)",
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA SECTION
        ══════════════════════════════════════ */}
        <section
          id="cta"
          data-reveal="cta"
          className="noise"
          style={{
            position: "relative",
            overflow: "hidden",
            background: "var(--paper)",
            padding: "120px 40px",
            opacity: visibleSections.has("cta") ? 1 : 0,
            transform: visibleSections.has("cta")
              ? "translateY(0)"
              : "translateY(40px)",
            transition:
              "opacity 0.9s 0.1s cubic-bezier(.22,1,.36,1), transform 0.9s 0.1s cubic-bezier(.22,1,.36,1)",
          }}
        >
          {/* Decorative lines */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              opacity: 0.08,
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="100%"
              stroke="#0a0a08"
              strokeWidth="1"
              strokeDasharray="8 12"
            />
            <line
              x1="100%"
              y1="0"
              x2="0"
              y2="100%"
              stroke="#0a0a08"
              strokeWidth="1"
              strokeDasharray="8 12"
            />
          </svg>

          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            <p
              className="section-label"
              style={{ color: "var(--rust)", marginBottom: "24px" }}
            >
              Get Started Today
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "clamp(2.5rem, 7vw, 6rem)",
                color: "var(--ink)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                marginBottom: "48px",
              }}
            >
              Your words,
              <br />
              <em style={{ fontStyle: "italic" }}>engineered.</em>
            </h2>

            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px 40px",
                  background: "var(--ink)",
                  color: "var(--paper)",
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
                Create Account
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
              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "15px 40px",
                  background: "transparent",
                  color: "var(--ink)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  border: "1px solid rgba(10,10,8,0.3)",
                  transition: "border-color 0.3s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--ink)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(10,10,8,0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FOOTER
        ══════════════════════════════════════ */}
        <footer
          style={{
            borderTop: "1px solid rgba(245,240,232,0.08)",
            padding: "60px 40px",
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "32px",
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "var(--rust)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                color: "var(--paper)",
                letterSpacing: "0.05em",
              }}
            >
              WN
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--paper)",
                  lineHeight: 1,
                }}
              >
                WebNotes
              </p>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  color: "rgba(245,240,232,0.3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginTop: "4px",
                }}
              >
                © {new Date().getFullYear()} — Built with passion by Otabek
              </p>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/login", label: "Sign in" },
              { href: "/register", label: "Register" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/abd11malikov"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "rgba(245,240,232,0.4)",
                transition: "color 0.2s",
                display: "flex",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--paper)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(245,240,232,0.4)")
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
