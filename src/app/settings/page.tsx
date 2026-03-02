"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { BASE_STYLES } from "@/lib/theme";

interface SocialLinks {
  [key: string]: string;
}

export default function SettingsPage() {
  const { token, username } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    username: "",
  });

  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  /* ── auth + fetch ── */
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    async function fetchUserData() {
      try {
        const res = await fetch(
          `https://api.webnote.uz/api/users/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            bio: data.bio || "",
            username: data.username || "",
          });
          setSocialLinks(data.socialMediaLinks || {});
          setPreviewUrl(data.profileImageUrl || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [token, username, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addSocialLink = () => {
    if (newLinkName && newLinkUrl) {
      setSocialLinks((prev) => ({
        ...prev,
        [newLinkName.toLowerCase()]: newLinkUrl,
      }));
      setNewLinkName("");
      setNewLinkUrl("");
      setShowAddSocial(false);
    }
  };

  const removeSocialLink = (key: string) => {
    const updated = { ...socialLinks };
    delete updated[key];
    setSocialLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = { ...formData, socialMediaLinks: socialLinks };
      const fd = new FormData();
      fd.append(
        "data",
        new Blob([JSON.stringify(payload)], { type: "application/json" }),
      );
      if (selectedFile) fd.append("image", selectedFile);
      const res = await fetch(`https://api.webnote.uz/api/users/${username}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully." });
        setTimeout(() => router.push(`/${username}`), 1500);
      } else {
        setMessage({
          type: "error",
          text: "Failed to update profile. Please try again.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Connection error. Please check your network.",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "14px 16px",
    background:
      focusedField === field
        ? "rgba(245,240,232,0.06)"
        : "rgba(245,240,232,0.03)",
    border: `1px solid ${focusedField === field ? "#c0392b" : "rgba(245,240,232,0.1)"}`,
    color: "#f5f0e8",
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.8rem",
    letterSpacing: "0.03em",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  });

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: BASE_STYLES }} />
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
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BASE_STYLES }} />
      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
      <div className="scanline" />
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      <div
        style={{ minHeight: "100vh", background: "#0a0a08", color: "#f5f0e8" }}
      >
        {/* ── Sticky header ── */}
        <nav className="inner-nav">
          <Link
            href={`/${username}`}
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
            }}
          >
            <span
              style={{
                width: "26px",
                height: "26px",
                background: "#c0392b",
                color: "#f5f0e8",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
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

          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <Link href={`/${username}`} className="nav-link">
              Back to Profile
            </Link>
            <Link href="/" className="nav-link">
              Home
            </Link>
          </div>
        </nav>

        <div
          style={{
            maxWidth: "860px",
            margin: "0 auto",
            padding: "60px 40px 100px",
          }}
        >
          {/* ── Page title ── */}
          <div
            style={{
              marginBottom: "56px",
              animation: "fadeUp 0.7s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            <p className="section-label" style={{ marginBottom: "12px" }}>
              Account
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: "#f5f0e8",
              }}
            >
              Profile{" "}
              <em style={{ color: "#c0392b", fontStyle: "italic" }}>
                Settings
              </em>
            </h1>
          </div>

          {/* ── Message banner ── */}
          {message && (
            <div
              style={{
                marginBottom: "40px",
                padding: "16px 20px",
                border: `1px solid ${message.type === "success" ? "rgba(192,57,43,0.4)" : "rgba(192,57,43,0.5)"}`,
                background: `rgba(192,57,43,${message.type === "success" ? "0.08" : "0.12"})`,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                animation: "fadeUp 0.4s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              {message.type === "success" ? (
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
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c0392b"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4m0 4h.01" />
                </svg>
              )}
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  color: "#c0392b",
                  letterSpacing: "0.05em",
                }}
              >
                {message.text}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ══ SECTION 1: Profile Photo ══ */}
            <section
              style={{
                border: "1px solid rgba(245,240,232,0.08)",
                marginBottom: "2px",
                animation: "fadeUp 0.7s 0.1s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              <div
                style={{
                  padding: "32px 40px",
                  borderBottom: "1px solid rgba(245,240,232,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p className="section-label" style={{ marginBottom: "4px" }}>
                    01
                  </p>
                  <h2
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: "#f5f0e8",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Profile Photo
                  </h2>
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.2)",
                  }}
                >
                  Optional
                </div>
              </div>

              <div
                style={{
                  padding: "40px",
                  display: "flex",
                  alignItems: "center",
                  gap: "40px",
                  flexWrap: "wrap",
                }}
              >
                {/* Avatar */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: "120px",
                    height: "120px",
                    flexShrink: 0,
                    position: "relative",
                    border: "1px solid rgba(245,240,232,0.12)",
                    cursor: "none",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget.querySelector(
                      ".avatar-overlay",
                    ) as HTMLElement)!.style.opacity = "1")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget.querySelector(
                      ".avatar-overlay",
                    ) as HTMLElement)!.style.opacity = "0")
                  }
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        filter: "grayscale(15%)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "rgba(245,240,232,0.04)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 900,
                        fontSize: "2.5rem",
                        color: "rgba(245,240,232,0.15)",
                      }}
                    >
                      {formData.firstName?.charAt(0) || "?"}
                    </div>
                  )}
                  <div
                    className="avatar-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(10,10,8,0.7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f5f0e8"
                      strokeWidth="1.5"
                    >
                      <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />

                <div>
                  <p
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "#f5f0e8",
                      marginBottom: "8px",
                    }}
                  >
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      color: "rgba(245,240,232,0.35)",
                      lineHeight: 1.7,
                      marginBottom: "20px",
                    }}
                  >
                    PNG or JPG preferred.
                    <br />
                    Will be publicly visible on your profile.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: "10px 24px",
                      background: "transparent",
                      border: "1px solid rgba(245,240,232,0.2)",
                      color: "#f5f0e8",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "none",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(245,240,232,0.5)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(245,240,232,0.2)")
                    }
                  >
                    Choose File
                  </button>
                </div>
              </div>
            </section>

            {/* ══ SECTION 2: Personal Info ══ */}
            <section
              style={{
                border: "1px solid rgba(245,240,232,0.08)",
                marginBottom: "2px",
                animation: "fadeUp 0.7s 0.2s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              <div
                style={{
                  padding: "32px 40px",
                  borderBottom: "1px solid rgba(245,240,232,0.08)",
                }}
              >
                <p className="section-label" style={{ marginBottom: "4px" }}>
                  02
                </p>
                <h2
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: "#f5f0e8",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Personal Information
                </h2>
              </div>

              <div
                style={{
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "28px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <label className="field-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("firstName")}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle("firstName")}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="field-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("lastName")}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle("lastName")}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle("email")}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="field-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("username_field")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...inputStyle("username_field"),
                      color: "rgba(245,240,232,0.4)",
                      cursor: "not-allowed",
                    }}
                    placeholder="username"
                    disabled
                  />
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.6rem",
                      color: "rgba(245,240,232,0.25)",
                      marginTop: "8px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Username cannot be changed after registration.
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <label className="field-label" style={{ margin: 0 }}>
                      Bio
                    </label>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.6rem",
                        color: "rgba(245,240,232,0.25)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {formData.bio.length} chars
                    </span>
                  </div>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("bio")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...inputStyle("bio"),
                      resize: "none",
                      lineHeight: 1.8,
                    }}
                    placeholder="Write a short bio about yourself..."
                  />
                </div>
              </div>
            </section>

            {/* ══ SECTION 3: Social Links ══ */}
            <section
              style={{
                border: "1px solid rgba(245,240,232,0.08)",
                marginBottom: "2px",
                animation: "fadeUp 0.7s 0.3s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              <div
                style={{
                  padding: "32px 40px",
                  borderBottom: "1px solid rgba(245,240,232,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p className="section-label" style={{ marginBottom: "4px" }}>
                    03
                  </p>
                  <h2
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: "#f5f0e8",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Social Connections
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddSocial(!showAddSocial)}
                  style={{
                    width: "36px",
                    height: "36px",
                    background: showAddSocial
                      ? "#c0392b"
                      : "rgba(245,240,232,0.06)",
                    border: "1px solid rgba(245,240,232,0.12)",
                    color: "#f5f0e8",
                    cursor: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                    fontSize: "1.2rem",
                    lineHeight: 1,
                  }}
                >
                  {showAddSocial ? "×" : "+"}
                </button>
              </div>

              <div style={{ padding: "40px" }}>
                {/* Add link form */}
                {showAddSocial && (
                  <div
                    style={{
                      marginBottom: "32px",
                      padding: "28px",
                      border: "1px solid rgba(192,57,43,0.2)",
                      background: "rgba(192,57,43,0.04)",
                      animation: "fadeUp 0.4s cubic-bezier(.22,1,.36,1) both",
                    }}
                  >
                    <p
                      className="section-label"
                      style={{ marginBottom: "20px" }}
                    >
                      Add New Link
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <label className="field-label">Platform Name</label>
                        <input
                          type="text"
                          value={newLinkName}
                          onChange={(e) => setNewLinkName(e.target.value)}
                          onFocus={() => setFocusedField("newName")}
                          onBlur={() => setFocusedField(null)}
                          style={inputStyle("newName")}
                          placeholder="GitHub"
                        />
                      </div>
                      <div>
                        <label className="field-label">URL</label>
                        <input
                          type="text"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          onFocus={() => setFocusedField("newUrl")}
                          onBlur={() => setFocusedField(null)}
                          style={inputStyle("newUrl")}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setShowAddSocial(false)}
                        style={{
                          padding: "10px 20px",
                          background: "transparent",
                          border: "none",
                          color: "rgba(245,240,232,0.35)",
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          cursor: "none",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={addSocialLink}
                        className="btn-primary"
                        style={{ padding: "10px 24px" }}
                      >
                        <span>Add Link</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Links list */}
                {Object.entries(socialLinks).length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    {Object.entries(socialLinks).map(([platform, url]) => (
                      <div
                        key={platform}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "16px 20px",
                          border: "1px solid rgba(245,240,232,0.07)",
                          background: "rgba(245,240,232,0.02)",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(245,240,232,0.04)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(245,240,232,0.02)")
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              flexShrink: 0,
                              border: "1px solid rgba(245,240,232,0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.6rem",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "#c0392b",
                            }}
                          >
                            {platform.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p
                              style={{
                                fontFamily: "'Syne', sans-serif",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                color: "#f5f0e8",
                                textTransform: "capitalize",
                                marginBottom: "2px",
                              }}
                            >
                              {platform}
                            </p>
                            <p
                              style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.65rem",
                                color: "rgba(245,240,232,0.3)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "300px",
                              }}
                            >
                              {url}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSocialLink(platform)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "none",
                            color: "rgba(245,240,232,0.2)",
                            padding: "8px",
                            transition: "color 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#c0392b")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                              "rgba(245,240,232,0.2)")
                          }
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      border: "1px dashed rgba(245,240,232,0.08)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.7rem",
                        color: "rgba(245,240,232,0.2)",
                        letterSpacing: "0.08em",
                        fontStyle: "italic",
                      }}
                    >
                      No social links added yet. Click + to add one.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ══ SAVE BUTTON ══ */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "40px",
                flexWrap: "wrap",
                gap: "20px",
                animation: "fadeUp 0.7s 0.4s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              <Link
                href={`/${username}`}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,0.35)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(245,240,232,0.7)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(245,240,232,0.35)")
                }
              >
                ← Discard Changes
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{
                  padding: "16px 48px",
                  opacity: saving ? 0.7 : 1,
                  cursor: saving ? "not-allowed" : "none",
                }}
              >
                {saving ? (
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
                    <span>Saving Changes</span>
                  </>
                ) : (
                  <>
                    <span>Save Profile</span>
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
            </div>
          </form>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .settings-grid { grid-template-columns: 1fr !important; }
        }
      `,
        }}
      />
    </>
  );
}
