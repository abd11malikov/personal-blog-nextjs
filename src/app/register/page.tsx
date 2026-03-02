"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BASE_STYLES } from "@/lib/theme";

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    bio: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  /* ── Custom cursor ── */
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let value = e.target.value;
    if (e.target.name === "username") {
      value = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = new FormData();
      data.append(
        "data",
        new Blob([JSON.stringify(formData)], { type: "application/json" }),
      );
      if (image) data.append("image", image);

      const response = await fetch("https://api.webnote.uz/api/users", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.message || "Registration failed");
      }
      router.push("/login?registered=true");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = (name: string): React.CSSProperties => ({
    width: "100%",
    padding: "13px 16px",
    background:
      focusedField === name
        ? "rgba(245,240,232,0.06)"
        : "rgba(245,240,232,0.04)",
    border: `1px solid ${focusedField === name ? "#c0392b" : "rgba(245,240,232,0.12)"}`,
    color: "#f5f0e8",
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.8rem",
    letterSpacing: "0.03em",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  });

  const step1Complete =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.username.length >= 4 &&
    formData.email.includes("@");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BASE_STYLES }} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (min-width: 769px) { .hide-desktop { display: none !important; } }
        .step-enter { animation: slideLeft 0.5s cubic-bezier(.22,1,.36,1) both; }
        ::placeholder { color: rgba(245,240,232,0.25) !important; }
      `,
        }}
      />

      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />

      <div
        style={{ minHeight: "100vh", background: "#0a0a08", display: "flex" }}
      >
        {/* ── Left panel ── */}
        <div
          className="hide-mobile"
          style={{
            width: "40%",
            background: "#f5f0e8",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px",
            flexShrink: 0,
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

          {/* Ghost text */}
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
            UP
          </div>

          {/* Wordmark */}
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

          {/* Editorial copy */}
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
              New Account
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
              Join the
              <br />
              <em style={{ fontStyle: "italic", color: "#c0392b" }}>
                platform.
              </em>
            </h2>

            <div
              style={{ borderLeft: "3px solid #c0392b", paddingLeft: "20px" }}
            >
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  lineHeight: 1.8,
                  color: "rgba(10,10,8,0.55)",
                }}
              >
                Create your profile.
                <br />
                Publish your first story.
              </p>
            </div>

            {/* Step indicator */}
            <div
              style={{
                marginTop: "40px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {[1, 2].map((s) => (
                <div
                  key={s}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      background: step >= s ? "#c0392b" : "transparent",
                      border: `1px solid ${step >= s ? "#c0392b" : "rgba(10,10,8,0.2)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.6rem",
                      color: step >= s ? "#f5f0e8" : "rgba(10,10,8,0.4)",
                      transition: "all 0.3s",
                    }}
                  >
                    {s}
                  </div>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color:
                        step >= s ? "rgba(10,10,8,0.7)" : "rgba(10,10,8,0.3)",
                      transition: "color 0.3s",
                    }}
                  >
                    {s === 1 ? "Identity" : "Security"}
                  </span>
                  {s < 2 && (
                    <div
                      style={{
                        width: "24px",
                        height: "1px",
                        background: step > s ? "#c0392b" : "rgba(10,10,8,0.15)",
                        marginLeft: "4px",
                        transition: "background 0.3s",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom label */}
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
            overflowY: "auto",
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
              maxWidth: "460px",
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
              {step === 1 ? "Step 1 of 2 — Identity" : "Step 2 of 2 — Security"}
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
              {step === 1 ? (
                <>
                  Create your
                  <br />
                  <em style={{ color: "#c0392b", fontStyle: "italic" }}>
                    identity.
                  </em>
                </>
              ) : (
                <>
                  Secure your
                  <br />
                  <em style={{ color: "#c0392b", fontStyle: "italic" }}>
                    account.
                  </em>
                </>
              )}
            </h1>

            <hr
              style={{
                border: "none",
                borderTop: "1px solid rgba(245,240,232,0.08)",
                marginBottom: "40px",
              }}
            />

            {/* Error */}
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

            <form onSubmit={handleRegister}>
              {/* ── STEP 1 ── */}
              {step === 1 && (
                <div
                  className="step-enter"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {/* Avatar upload */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: "88px",
                        height: "88px",
                        border: `1px solid ${previewUrl ? "#c0392b" : "rgba(245,240,232,0.15)"}`,
                        cursor: "none",
                        position: "relative",
                        overflow: "hidden",
                        transition: "border-color 0.3s",
                        background: "rgba(245,240,232,0.03)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="rgba(245,240,232,0.3)"
                            strokeWidth="1.5"
                          >
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                          <span
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.55rem",
                              color: "rgba(245,240,232,0.3)",
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                            }}
                          >
                            Photo
                          </span>
                        </div>
                      )}
                    </div>
                    <p
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.62rem",
                        color: "rgba(245,240,232,0.3)",
                        letterSpacing: "0.08em",
                        textAlign: "center",
                      }}
                    >
                      {previewUrl
                        ? "Click to change photo"
                        : "Optional profile photo"}
                    </p>
                  </div>

                  {/* Name row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <label className="field-label">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("firstName")}
                        onBlur={() => setFocusedField(null)}
                        style={fieldStyle("firstName")}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("lastName")}
                        onBlur={() => setFocusedField(null)}
                        style={fieldStyle("lastName")}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="field-label">
                      Username
                      {formData.username && (
                        <span
                          style={{
                            marginLeft: "12px",
                            color:
                              formData.username.length >= 4
                                ? "#c0392b"
                                : "rgba(245,240,232,0.2)",
                          }}
                        >
                          {formData.username.length >= 4
                            ? "✓"
                            : `${formData.username.length}/4 min`}
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("username")}
                      onBlur={() => setFocusedField(null)}
                      style={fieldStyle("username")}
                      placeholder="johndoe"
                      required
                      minLength={4}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="field-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      style={fieldStyle("email")}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="field-label">
                      Bio{" "}
                      <span
                        style={{
                          color: "rgba(245,240,232,0.2)",
                          marginLeft: "8px",
                        }}
                      >
                        optional
                      </span>
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("bio")}
                      onBlur={() => setFocusedField(null)}
                      rows={3}
                      style={{
                        ...fieldStyle("bio"),
                        resize: "none",
                        lineHeight: 1.7,
                      }}
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>

                  {/* Next step */}
                  <button
                    type="button"
                    onClick={() => step1Complete && setStep(2)}
                    disabled={!step1Complete}
                    className="btn-primary"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      padding: "16px 32px",
                      marginTop: "8px",
                      opacity: step1Complete ? 1 : 0.4,
                      cursor: step1Complete ? "none" : "not-allowed",
                    }}
                  >
                    <span>Continue</span>
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
                  </button>
                </div>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <div
                  className="step-enter"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {/* Summary row */}
                  <div
                    style={{
                      padding: "16px 20px",
                      border: "1px solid rgba(245,240,232,0.08)",
                      background: "rgba(245,240,232,0.03)",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    {previewUrl ? (
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          position: "relative",
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={previewUrl}
                          alt="avatar"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          background: "rgba(192,57,43,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#c0392b",
                          flexShrink: 0,
                        }}
                      >
                        {formData.firstName[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div>
                      <p
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: "#f5f0e8",
                        }}
                      >
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.65rem",
                          color: "rgba(245,240,232,0.4)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        @{formData.username}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        marginLeft: "auto",
                        background: "none",
                        border: "none",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(245,240,232,0.35)",
                        cursor: "none",
                        borderBottom: "1px solid rgba(245,240,232,0.15)",
                        paddingBottom: "1px",
                      }}
                    >
                      Edit
                    </button>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="field-label">
                      Password
                      {formData.password && (
                        <span
                          style={{
                            marginLeft: "12px",
                            color:
                              formData.password.length >= 6
                                ? "#c0392b"
                                : "rgba(245,240,232,0.2)",
                          }}
                        >
                          {formData.password.length >= 6
                            ? "✓ Strong enough"
                            : `${formData.password.length}/6 min`}
                        </span>
                      )}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      style={fieldStyle("password")}
                      placeholder="Min. 6 characters"
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />

                    {/* Password strength bar */}
                    {formData.password && (
                      <div
                        style={{
                          marginTop: "8px",
                          height: "2px",
                          background: "rgba(245,240,232,0.07)",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(100, (formData.password.length / 12) * 100)}%`,
                            background:
                              formData.password.length < 6
                                ? "rgba(192,57,43,0.4)"
                                : "#c0392b",
                            transition:
                              "width 0.3s cubic-bezier(.22,1,.36,1), background 0.3s",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || formData.password.length < 6}
                    className="btn-primary"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      padding: "16px 32px",
                      marginTop: "8px",
                      opacity:
                        loading || formData.password.length < 6 ? 0.5 : 1,
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
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
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

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      background: "none",
                      border: "none",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(245,240,232,0.3)",
                      cursor: "none",
                      textAlign: "center",
                      padding: "4px",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "rgba(245,240,232,0.6)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(245,240,232,0.3)")
                    }
                  >
                    ← Back
                  </button>
                </div>
              )}
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
              Already have an account?{" "}
              <Link
                href="/login"
                style={{
                  color: "#f5f0e8",
                  textDecoration: "none",
                  borderBottom: "1px solid #c0392b",
                  paddingBottom: "1px",
                }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
