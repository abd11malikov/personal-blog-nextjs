"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { BASE_STYLES } from "@/lib/theme";

function LoginContent() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "true") setShowSuccess(true);
  }, [searchParams]);

  useEffect(() => {
    let rafId: number;
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
      rafId = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("https://api.webnote.uz/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      login(data.token, username);
      router.push("/");
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BASE_STYLES }} />
      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />

      <div
        style={{ minHeight: "100vh", background: "#0a0a08", display: "flex" }}
      >
        {/* ── Left panel — decorative ── */}
        <div
          className="hide-mobile"
          style={{
            width: "42%",
            background: "#f5f0e8",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px",
          }}
        >
          {/* Grid lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(10,10,8,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,8,0.06) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          />

          {/* Ghost headline */}
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              left: "-20px",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "clamp(10rem, 22vw, 18rem)",
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: "1px rgba(10,10,8,0.07)",
              userSelect: "none",
              letterSpacing: "-0.04em",
              pointerEvents: "none",
            }}
          >
            IN
          </div>

          {/* Top: wordmark */}
          <Link
            href="/"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "1.3rem",
              color: "#0a0a08",
              textDecoration: "none",
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              position: "relative",
              zIndex: 2,
            }}
          >
            <span
              style={{
                width: "28px",
                height: "28px",
                background: "#c0392b",
                color: "#f5f0e8",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: "0.05em",
              }}
            >
              WN
            </span>
            WebNotes
          </Link>

          {/* Middle: editorial copy */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#c0392b",
                marginBottom: "20px",
              }}
            >
              Access Portal
            </p>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                color: "#0a0a08",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                marginBottom: "24px",
              }}
            >
              Welcome
              <br />
              <em style={{ fontStyle: "italic", color: "#c0392b" }}>back.</em>
            </h2>

            <div
              style={{
                borderLeft: "3px solid #c0392b",
                paddingLeft: "20px",
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  lineHeight: 1.8,
                  color: "rgba(10,10,8,0.55)",
                }}
              >
                Your stories are waiting.
                <br />
                Sign in to continue building.
              </p>
            </div>
          </div>

          {/* Bottom: issue label */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(10,10,8,0.35)",
              }}
            >
              WebNotes &mdash; {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* ── Right panel — form ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 40px",
            position: "relative",
          }}
        >
          {/* Subtle grid */}
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

          <div
            style={{
              width: "100%",
              maxWidth: "440px",
              position: "relative",
              zIndex: 2,
              animation: "fadeUp 0.7s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            {/* Mobile wordmark */}
            <div className="hide-desktop" style={{ marginBottom: "40px" }}>
              <Link
                href="/"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  color: "#f5f0e8",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "#c0392b",
                    color: "#f5f0e8",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  WN
                </span>
                WebNotes
              </Link>
            </div>

            {/* Heading */}
            <p className="section-label" style={{ marginBottom: "16px" }}>
              Sign In
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "#f5f0e8",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: "40px",
              }}
            >
              Continue your
              <br />
              <em style={{ color: "#c0392b", fontStyle: "italic" }}>
                journey.
              </em>
            </h1>

            <hr
              style={{
                border: "none",
                borderTop: "1px solid rgba(245,240,232,0.08)",
                marginBottom: "40px",
              }}
            />

            {/* Success banner */}
            {showSuccess && (
              <div
                style={{
                  marginBottom: "28px",
                  padding: "14px 20px",
                  border: "1px solid rgba(192,57,43,0.3)",
                  background: "rgba(192,57,43,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  animation: "fadeUp 0.5s cubic-bezier(.22,1,.36,1) both",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c0392b"
                  strokeWidth="2"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.05em",
                    color: "#c0392b",
                  }}
                >
                  Account created. You may now sign in.
                </span>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div
                style={{
                  marginBottom: "28px",
                  padding: "14px 20px",
                  border: "1px solid rgba(192,57,43,0.4)",
                  background: "rgba(192,57,43,0.06)",
                  animation: "fadeUp 0.4s cubic-bezier(.22,1,.36,1) both",
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    color: "#c0392b",
                    letterSpacing: "0.03em",
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleLogin}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <div>
                <label className="field-label">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="field-input"
                  style={
                    focusedField === "username"
                      ? {
                          borderColor: "#c0392b",
                          background: "rgba(245,240,232,0.06)",
                        }
                      : {}
                  }
                  placeholder="your_username"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="field-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="field-input"
                  style={
                    focusedField === "password"
                      ? {
                          borderColor: "#c0392b",
                          background: "rgba(245,240,232,0.06)",
                        }
                      : {}
                  }
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "16px 32px",
                  marginTop: "8px",
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "none",
                }}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid rgba(245,240,232,0.3)",
                        borderTopColor: "#f5f0e8",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        display: "inline-block",
                      }}
                    />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
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
                  </>
                )}
              </button>
            </form>

            <hr
              style={{
                border: "none",
                borderTop: "1px solid rgba(245,240,232,0.08)",
                margin: "40px 0 32px",
              }}
            />

            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                color: "rgba(245,240,232,0.4)",
                letterSpacing: "0.05em",
                textAlign: "center",
              }}
            >
              No account yet?{" "}
              <Link
                href="/register"
                style={{
                  color: "#f5f0e8",
                  textDecoration: "none",
                  borderBottom: "1px solid #c0392b",
                  paddingBottom: "1px",
                  transition: "color 0.2s",
                }}
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 769px) { .hide-desktop { display: none !important; } }
      `,
        }}
      />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#0a0a08",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
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
          <style
            dangerouslySetInnerHTML={{
              __html: `@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`,
            }}
          />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
