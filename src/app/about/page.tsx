"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BASE_STYLES } from "@/lib/theme";

const SKILLS = [
  {
    category: "Backend Engineering",
    num: "01",
    items: [
      { name: "Java 17/21", level: 95 },
      { name: "Spring Boot 3", level: 93 },
      { name: "Spring Security + JWT", level: 88 },
      { name: "PostgreSQL & Hibernate", level: 85 },
      { name: "RESTful APIs", level: 95 },
    ],
  },
  {
    category: "Frontend & Tools",
    num: "02",
    items: [
      { name: "Next.js & React", level: 82 },
      { name: "TypeScript", level: 80 },
      { name: "Tailwind CSS", level: 85 },
      { name: "Docker & Compose", level: 78 },
      { name: "Cloudflare R2 / S3", level: 75 },
    ],
  },
];

const TIMELINE = [
  {
    year: "2024",
    title: "WebNotes — Full-Stack CMS",
    desc: "Designed and built a production-grade CMS from scratch. Spring Boot 3 backend with JWT auth, PostgreSQL persistence, Cloudflare R2 asset storage, and a Next.js 16 frontend with SSR.",
  },
  {
    year: "2023",
    title: "Work & Travel — Audi AG, Germany",
    desc: "Participated in an international Work & Travel program within the logistics division at Audi AG, Ingolstadt. Gained deep appreciation for discipline, process engineering, and cross-cultural teamwork.",
  },
  {
    year: "2022",
    title: "Began Full-Stack Journey",
    desc: "Committed fully to backend engineering. Mastered Java fundamentals, Spring ecosystem internals, and database design patterns. Built first production REST APIs.",
  },
  {
    year: "2021",
    title: "First Lines of Code",
    desc: "Started with the fundamentals — algorithms, data structures, object-oriented design. Discovered a love for systems thinking and clean architecture.",
  },
];

export default function AboutPage() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* cursor */
  useEffect(() => {
    if (!mounted) return;
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
  }, [mounted]);

  /* scroll progress */
  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement;
      setScrollPct((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* intersection reveals */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id)
            setVisible((prev) => new Set([...prev, e.target.id]));
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [mounted]);

  const revealed = (id: string): React.CSSProperties => ({
    opacity: visible.has(id) ? 1 : 0,
    transform: visible.has(id) ? "translateY(0)" : "translateY(40px)",
    transition:
      "opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1)",
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BASE_STYLES }} />

      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
      <div className="scanline" />
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      <div
        style={{
          background: "#0a0a08",
          color: "#f5f0e8",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        {/* ── HERO ── */}
        <section
          style={{
            padding: "100px 40px 80px",
            maxWidth: "1280px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* ghost text */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "60px",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "clamp(10rem, 22vw, 22rem)",
              lineHeight: 1,
              color: "rgba(245,240,232,0.025)",
              userSelect: "none",
              letterSpacing: "-0.05em",
              pointerEvents: "none",
            }}
          >
            OA
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              gap: "48px",
            }}
          >
            {/* breadcrumb */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                animation: "fadeUp 0.6s 0.1s both",
              }}
            >
              <Link href="/" className="nav-link">
                Home
              </Link>
              <span
                style={{ color: "rgba(245,240,232,0.2)", fontSize: "0.6rem" }}
              >
                —
              </span>
              <span
                className="section-label"
                style={{ color: "rgba(245,240,232,0.5)" }}
              >
                About
              </span>
            </div>

            {/* name + photo row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "64px",
                alignItems: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  className="section-label"
                  style={{
                    marginBottom: "20px",
                    animation: "fadeUp 0.6s 0.2s both",
                  }}
                >
                  Vol. I — Engineering Story
                </p>
                <h1
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    fontSize: "clamp(3rem, 9vw, 8rem)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.03em",
                    color: "#f5f0e8",
                    animation: "fadeUp 0.7s 0.25s both",
                  }}
                >
                  Otabek
                  <br />
                  <span style={{ color: "#c0392b", fontStyle: "italic" }}>
                    Abdumalikov
                  </span>
                </h1>
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.8rem",
                    color: "rgba(245,240,232,0.45)",
                    marginTop: "24px",
                    letterSpacing: "0.08em",
                    animation: "fadeUp 0.7s 0.4s both",
                  }}
                >
                  Backend Engineer & System Architect — Tashkent, Uzbekistan 🇺🇿
                </p>
              </div>

              {/* photo */}
              <div
                style={{
                  width: "clamp(140px, 18vw, 220px)",
                  flexShrink: 0,
                  animation: "fadeUp 0.8s 0.35s both",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    border: "1px solid rgba(245,240,232,0.12)",
                    padding: "6px",
                  }}
                >
                  <img
                    src="https://pub-89e3ffab5507464293c0bfee94f64d24.r2.dev/photo_2026-03-01%2012.44.07%E2%80%AFAM.jpeg"
                    alt="Otabek Abdumalikov"
                    style={{
                      width: "100%",
                      display: "block",
                      filter: "grayscale(20%) contrast(1.05)",
                    }}
                  />
                  {/* corner accent */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-12px",
                      right: "-12px",
                      width: "40px",
                      height: "40px",
                      border: "2px solid #c0392b",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* bottom rule */}
            <div
              style={{
                borderTop: "1px solid rgba(245,240,232,0.12)",
                animation: "fadeUp 0.6s 0.55s both",
              }}
            />
          </div>
        </section>

        {/* ── PHILOSOPHY ── */}
        <section
          id="philosophy"
          data-reveal="philosophy"
          style={{
            padding: "80px 40px",
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "80px",
            alignItems: "start",
            ...revealed("philosophy"),
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "clamp(5rem, 12vw, 10rem)",
                color: "rgba(245,240,232,0.05)",
                lineHeight: 1,
                display: "block",
                userSelect: "none",
              }}
            >
              01
            </span>
            <p className="section-label" style={{ marginTop: "16px" }}>
              Philosophy
            </p>
          </div>

          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "#f5f0e8",
                marginBottom: "32px",
              }}
            >
              Architecture over features.
              <br />
              <em style={{ color: "#c0392b", fontStyle: "italic" }}>
                Stability over speed.
              </em>
            </h2>

            <div
              style={{
                borderLeft: "3px solid #c0392b",
                paddingLeft: "28px",
                marginBottom: "32px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                  color: "rgba(245,240,232,0.7)",
                }}
              >
                &ldquo;I approach engineering with a focus on long-term
                stability. The goal is not just to deliver features — it&apos;s
                to build a foundation that is secure, scalable, and easy for
                other developers to maintain.&rdquo;
              </p>
            </div>

            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.8rem",
                lineHeight: 1.9,
                color: "rgba(245,240,232,0.5)",
              }}
            >
              I prioritize clean code, robust database design, and automated
              testing to ensure the final product is not just functional — but
              engineered to last. Every architectural decision is intentional.
              No shortcuts. No magic wrappers.
            </p>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section
          id="skills"
          data-reveal="skills"
          style={{
            padding: "80px 40px",
            borderTop: "1px solid rgba(245,240,232,0.08)",
            borderBottom: "1px solid rgba(245,240,232,0.08)",
            ...revealed("skills"),
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
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
                  fontWeight: 900,
                  fontSize: "clamp(4rem, 10vw, 8rem)",
                  color: "rgba(245,240,232,0.05)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                02
              </span>
              <div>
                <p className="section-label" style={{ marginBottom: "8px" }}>
                  Core Competencies
                </p>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
                    color: "#f5f0e8",
                    lineHeight: 1.1,
                  }}
                >
                  The Technical{" "}
                  <em style={{ color: "#c0392b", fontStyle: "italic" }}>
                    Arsenal
                  </em>
                </h2>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: "1px",
                background: "rgba(245,240,232,0.08)",
              }}
            >
              {SKILLS.map((group) => (
                <div
                  key={group.num}
                  style={{ background: "#0a0a08", padding: "40px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "32px",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: "#f5f0e8",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {group.category}
                    </h3>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 900,
                        fontSize: "2.5rem",
                        color: "rgba(245,240,232,0.06)",
                        lineHeight: 1,
                      }}
                    >
                      {group.num}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    {group.items.map((skill) => (
                      <div key={skill.name}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.72rem",
                              color: "rgba(245,240,232,0.6)",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {skill.name}
                          </span>
                          <span
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.65rem",
                              color: "#c0392b",
                              letterSpacing: "0.1em",
                            }}
                          >
                            {skill.level}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: "2px",
                            background: "rgba(245,240,232,0.07)",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              height: "100%",
                              width: visible.has("skills")
                                ? `${skill.level}%`
                                : "0%",
                              background: "#c0392b",
                              transition: `width 1.2s ${0.3 + group.items.indexOf(skill) * 0.1}s cubic-bezier(.22,1,.36,1)`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section
          id="timeline"
          data-reveal="timeline"
          style={{
            padding: "80px 40px",
            maxWidth: "1280px",
            margin: "0 auto",
            ...revealed("timeline"),
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
                fontWeight: 900,
                fontSize: "clamp(4rem, 10vw, 8rem)",
                color: "rgba(245,240,232,0.05)",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              03
            </span>
            <div>
              <p className="section-label" style={{ marginBottom: "8px" }}>
                Timeline
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
                  color: "#f5f0e8",
                  lineHeight: 1.1,
                }}
              >
                The{" "}
                <em style={{ color: "#c0392b", fontStyle: "italic" }}>
                  Journey
                </em>
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* vertical line */}
            <div
              style={{
                position: "absolute",
                left: "100px",
                top: 0,
                bottom: 0,
                width: "1px",
                background: "rgba(245,240,232,0.08)",
              }}
            />

            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr",
                  gap: "40px",
                  paddingBottom: "56px",
                  opacity: visible.has("timeline") ? 1 : 0,
                  transform: visible.has("timeline")
                    ? "translateY(0)"
                    : "translateY(30px)",
                  transition: `opacity 0.7s ${i * 0.12}s cubic-bezier(.22,1,.36,1), transform 0.7s ${i * 0.12}s cubic-bezier(.22,1,.36,1)`,
                }}
              >
                {/* year */}
                <div style={{ paddingTop: "4px", position: "relative" }}>
                  {/* dot */}
                  <div
                    style={{
                      position: "absolute",
                      right: "-5px",
                      top: "8px",
                      width: "9px",
                      height: "9px",
                      background: "#c0392b",
                      borderRadius: "50%",
                      border: "2px solid #0a0a08",
                      zIndex: 1,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      color: "#c0392b",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {item.year}
                  </span>
                </div>

                {/* content */}
                <div style={{ paddingLeft: "24px" }}>
                  <h3
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: "#f5f0e8",
                      marginBottom: "10px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                      lineHeight: 1.85,
                      color: "rgba(245,240,232,0.45)",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BEYOND CODE ── */}
        <section
          id="beyond"
          data-reveal="beyond"
          style={{
            borderTop: "1px solid rgba(245,240,232,0.08)",
            padding: "80px 40px",
            maxWidth: "1280px",
            margin: "0 auto",
            ...revealed("beyond"),
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "80px",
              alignItems: "start",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: "clamp(4rem, 10vw, 8rem)",
                  color: "rgba(245,240,232,0.05)",
                  lineHeight: 1,
                  display: "block",
                  userSelect: "none",
                }}
              >
                04
              </span>
              <p className="section-label" style={{ marginTop: "16px" }}>
                Languages
              </p>
              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {["English", "Russian", "Uzbek"].map((lang) => (
                  <div
                    key={lang}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        background: "#c0392b",
                        borderRadius: "50%",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.75rem",
                        color: "rgba(245,240,232,0.6)",
                      }}
                    >
                      {lang}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "#f5f0e8",
                  marginBottom: "32px",
                }}
              >
                Beyond the Terminal
              </h2>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.8rem",
                  lineHeight: 1.9,
                  color: "rgba(245,240,232,0.5)",
                  marginBottom: "24px",
                }}
              >
                In 2023, I participated in a Work &amp; Travel program in
                Germany, embedded within the logistics division at{" "}
                <span
                  style={{
                    color: "#f5f0e8",
                    borderBottom: "1px solid #c0392b",
                  }}
                >
                  Audi AG
                </span>
                . Working in a high-standard international environment taught me
                the importance of discipline, teamwork, and process optimization
                — principles I carry into every line of code.
              </p>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.8rem",
                  lineHeight: 1.9,
                  color: "rgba(245,240,232,0.5)",
                }}
              >
                Fluent in English, Russian, and Uzbek, I thrive in global,
                cross-functional teams. I believe the best engineers are those
                who can communicate as precisely as they code.
              </p>
            </div>
          </div>
        </section>

        {/* ── CONNECT ── */}
        <section
          id="connect"
          data-reveal="connect"
          style={{
            background: "#f5f0e8",
            padding: "100px 40px",
            position: "relative",
            overflow: "hidden",
            ...revealed("connect"),
          }}
        >
          {/* dashed lines */}
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0.06,
              pointerEvents: "none",
            }}
          >
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="100%"
              stroke="#0a0a08"
              strokeWidth="1"
              strokeDasharray="8 14"
            />
            <line
              x1="100%"
              y1="0"
              x2="0"
              y2="100%"
              stroke="#0a0a08"
              strokeWidth="1"
              strokeDasharray="8 14"
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
              style={{ color: "#c0392b", marginBottom: "24px" }}
            >
              Let&apos;s Connect
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: "#0a0a08",
                marginBottom: "24px",
              }}
            >
              Always open
              <br />
              <em style={{ fontStyle: "italic" }}>to a conversation.</em>
            </h2>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.8rem",
                lineHeight: 1.8,
                color: "rgba(10,10,8,0.5)",
                maxWidth: "480px",
                margin: "0 auto 48px",
              }}
            >
              Whether it&apos;s a new project, an interesting idea, or just a
              developer-to-developer chat — I&apos;m here for it.
            </p>

            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="https://github.com/abd11malikov"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 32px",
                  background: "#0a0a08",
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
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/otabek-abdumalikov-26b825269"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "13px 32px",
                  background: "transparent",
                  color: "#0a0a08",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  border: "1px solid rgba(10,10,8,0.3)",
                  transition: "border-color 0.3s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#0a0a08";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(10,10,8,0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          style={{
            borderTop: "1px solid rgba(245,240,232,0.08)",
            padding: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                background: "#c0392b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                color: "#f5f0e8",
                letterSpacing: "0.05em",
              }}
            >
              WN
            </div>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#f5f0e8",
              }}
            >
              WebNotes
            </span>
          </Link>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              color: "rgba(245,240,232,0.25)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            © {new Date().getFullYear()} — Built with passion by Otabek
          </p>
        </footer>
      </div>
    </>
  );
}
