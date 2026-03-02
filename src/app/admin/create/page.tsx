"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BASE_STYLES } from "@/lib/theme";

const MAX_FILE_SIZE_MB = 5;
const MAX_TOTAL_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

interface Category {
  id: number;
  name: string;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

const EXTRA_STYLES = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .upload-zone {
    border: 1px dashed rgba(245,240,232,0.15);
    padding: 48px 32px;
    text-align: center;
    cursor: none;
    transition: border-color 0.3s, background 0.3s;
    position: relative;
    overflow: hidden;
  }
  .upload-zone:hover {
    border-color: rgba(192,57,43,0.5);
    background: rgba(192,57,43,0.03);
  }
  .upload-zone.has-error {
    border-color: rgba(192,57,43,0.6);
    background: rgba(192,57,43,0.05);
  }

  .cat-toggle {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 8px 16px;
    border: 1px solid rgba(245,240,232,0.12);
    background: transparent;
    color: rgba(245,240,232,0.45);
    cursor: none;
    transition: all 0.2s;
  }
  .cat-toggle:hover {
    border-color: rgba(245,240,232,0.3);
    color: #f5f0e8;
  }
  .cat-toggle.selected {
    border-color: #c0392b;
    background: rgba(192,57,43,0.12);
    color: #c0392b;
  }

  .tag-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(245,240,232,0.7);
    border: 1px solid rgba(245,240,232,0.15);
    padding: 5px 12px;
    background: rgba(245,240,232,0.03);
    animation: slideUp 0.3s cubic-bezier(.22,1,.36,1) both;
  }
  .tag-chip button {
    background: none;
    border: none;
    cursor: none;
    color: rgba(245,240,232,0.35);
    font-size: 1rem;
    line-height: 1;
    padding: 0;
    transition: color 0.2s;
  }
  .tag-chip button:hover { color: #c0392b; }

  .file-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    border: 1px solid rgba(245,240,232,0.08);
    background: rgba(245,240,232,0.02);
    animation: slideUp 0.3s cubic-bezier(.22,1,.36,1) both;
    transition: background 0.2s;
  }
  .file-row:hover { background: rgba(245,240,232,0.04); }

  .form-section {
    border: 1px solid rgba(245,240,232,0.08);
    margin-bottom: 2px;
    animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) both;
  }
  .section-header {
    padding: 28px 40px;
    border-bottom: 1px solid rgba(245,240,232,0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .section-body { padding: 40px; }

  @media (max-width: 640px) {
    .section-header { padding: 20px 24px; }
    .section-body { padding: 24px; }
  }
`;

export default function CreatePostPage() {
  const { token, username } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [scrollPct, setScrollPct] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  /* ── auth guard ── */
  useEffect(() => {
    if (!localStorage.getItem("jwt_token")) router.push("/login");
  }, [router]);

  /* ── fetch categories ── */
  useEffect(() => {
    fetch("https://api.webnote.uz/api/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then(setCategories)
      .catch(() => {});
  }, []);

  const processFiles = (newFiles: File[]) => {
    setFileError(null);
    const oversized: string[] = [];
    const valid: File[] = [];
    let total = images.reduce((s, f) => s + f.size, 0);

    for (const file of newFiles) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        oversized.push(file.name);
        continue;
      }
      if (total + file.size > MAX_TOTAL_SIZE_BYTES) {
        setFileError(`Total upload size would exceed ${MAX_TOTAL_SIZE_MB}MB.`);
        break;
      }
      valid.push(file);
      total += file.size;
    }
    if (oversized.length > 0)
      setFileError(
        `File(s) exceed the ${MAX_FILE_SIZE_MB}MB limit: ${oversized.join(", ")}`,
      );
    setImages((prev) => [...prev, ...valid]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    processFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(
      Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      ),
    );
  };

  const removeFile = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    if (fileError) setFileError(null);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const val = tagInput
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");
      if (val && !tags.includes(val)) setTags([...tags, val]);
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setIsLoading(true);

    const fd = new FormData();
    images.forEach((img) => fd.append("images", img));
    fd.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            title,
            content: description,
            authorUsername: username,
            categoryIds: selectedCategoryIds,
            tags,
          }),
        ],
        { type: "application/json" },
      ),
    );

    try {
      const res = await fetch("https://api.webnote.uz/api/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok)
        throw new Error((await res.text()) || "Failed to create post.");
      router.push("/");
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
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

  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BASE_STYLES }} />
      <style dangerouslySetInnerHTML={{ __html: EXTRA_STYLES }} />

      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
      <div className="scanline" />
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      <div
        style={{ minHeight: "100vh", background: "#0a0a08", color: "#f5f0e8" }}
      >
        {/* ── Navbar ── */}
        <nav className="inner-nav">
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
            <Link href="/" className="nav-link">
              Home
            </Link>
            {username && (
              <Link href={`/${username}`} className="nav-link">
                My Profile
              </Link>
            )}
          </div>
        </nav>

        {/* ── Content ── */}
        <div
          style={{
            maxWidth: "860px",
            margin: "0 auto",
            padding: "60px 40px 120px",
          }}
        >
          {/* Page header */}
          <div
            style={{
              marginBottom: "56px",
              animation: "fadeUp 0.7s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            <p className="section-label" style={{ marginBottom: "12px" }}>
              New Entry
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
              Write a{" "}
              <em style={{ color: "#c0392b", fontStyle: "italic" }}>Story</em>
            </h1>
            {(title || wordCount > 0) && (
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  marginTop: "20px",
                  animation: "fadeUp 0.4s cubic-bezier(.22,1,.36,1) both",
                }}
              >
                {title && (
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(245,240,232,0.3)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    &ldquo;{title.slice(0, 48)}
                    {title.length > 48 ? "…" : ""}&rdquo;
                  </span>
                )}
                {wordCount > 0 && (
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(245,240,232,0.25)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {wordCount} words · {readTime} min read
                  </span>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* ══ SECTION 1: Title ══ */}
            <div className="form-section" style={{ animationDelay: "0.05s" }}>
              <div className="section-header">
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
                    Title
                  </h2>
                </div>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.2)",
                  }}
                >
                  Required
                </span>
              </div>
              <div className="section-body">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputStyle("title"),
                    fontSize: "1rem",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    padding: "18px 20px",
                  }}
                  placeholder="An engaging headline…"
                  required
                />
              </div>
            </div>

            {/* ══ SECTION 2: Categories ══ */}
            <div className="form-section" style={{ animationDelay: "0.1s" }}>
              <div className="section-header">
                <div>
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
                    Categories
                  </h2>
                </div>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color:
                      selectedCategoryIds.length > 0
                        ? "#c0392b"
                        : "rgba(245,240,232,0.2)",
                  }}
                >
                  {selectedCategoryIds.length > 0
                    ? `${selectedCategoryIds.length} selected`
                    : "Pick at least one"}
                </span>
              </div>
              <div className="section-body">
                {categories.length > 0 ? (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`cat-toggle${selectedCategoryIds.includes(cat.id) ? " selected" : ""}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      color: "rgba(245,240,232,0.25)",
                      letterSpacing: "0.05em",
                      fontStyle: "italic",
                    }}
                  >
                    Loading categories…
                  </p>
                )}
              </div>
            </div>

            {/* ══ SECTION 3: Tags ══ */}
            <div className="form-section" style={{ animationDelay: "0.15s" }}>
              <div className="section-header">
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
                    Tags
                  </h2>
                </div>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.2)",
                  }}
                >
                  Optional
                </span>
              </div>
              <div className="section-body">
                {/* Existing tags */}
                {tags.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    {tags.map((tag) => (
                      <span key={tag} className="tag-chip">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => setTags(tags.filter((t) => t !== tag))}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tag input */}
                <div style={{ position: "relative" }}>
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onFocus={() => setFocusedField("tags")}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle("tags")}
                    placeholder={
                      tags.length === 0
                        ? "Type a tag and press Enter or comma…"
                        : "Add another tag…"
                    }
                  />
                  {tagInput && (
                    <div
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.6rem",
                        color: "rgba(245,240,232,0.25)",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        pointerEvents: "none",
                      }}
                    >
                      Enter ↵
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ══ SECTION 4: Content ══ */}
            <div className="form-section" style={{ animationDelay: "0.2s" }}>
              <div className="section-header">
                <div>
                  <p className="section-label" style={{ marginBottom: "4px" }}>
                    04
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
                    Content
                  </h2>
                </div>
                {wordCount > 0 && (
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(245,240,232,0.3)",
                    }}
                  >
                    {wordCount} words
                  </span>
                )}
              </div>
              <div className="section-body">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={() => setFocusedField("content")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputStyle("content"),
                    minHeight: "320px",
                    resize: "vertical",
                    lineHeight: 1.9,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "0.95rem",
                    letterSpacing: "0",
                  }}
                  placeholder="Write something worth reading…"
                  required
                />
              </div>
            </div>

            {/* ══ SECTION 5: Images ══ */}
            <div className="form-section" style={{ animationDelay: "0.25s" }}>
              <div className="section-header">
                <div>
                  <p className="section-label" style={{ marginBottom: "4px" }}>
                    05
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
                    Images
                  </h2>
                </div>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color:
                      images.length > 0 ? "#c0392b" : "rgba(245,240,232,0.2)",
                  }}
                >
                  {images.length > 0
                    ? `${images.length} file${images.length !== 1 ? "s" : ""} selected`
                    : "Optional"}
                </span>
              </div>
              <div className="section-body">
                {/* Drop zone */}
                <div
                  className={`upload-zone${fileError ? " has-error" : ""}`}
                  style={
                    isDragging
                      ? {
                          borderColor: "#c0392b",
                          background: "rgba(192,57,43,0.06)",
                        }
                      : {}
                  }
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />

                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isDragging ? "#c0392b" : "rgba(245,240,232,0.2)"}
                    strokeWidth="1.5"
                    style={{
                      margin: "0 auto 16px",
                      display: "block",
                      transition: "stroke 0.2s",
                    }}
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>

                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                      color: isDragging ? "#c0392b" : "rgba(245,240,232,0.35)",
                      letterSpacing: "0.08em",
                      marginBottom: "8px",
                      transition: "color 0.2s",
                    }}
                  >
                    {isDragging
                      ? "Drop to upload"
                      : "Click or drag images here"}
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.6rem",
                      color: "rgba(245,240,232,0.2)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Max {MAX_FILE_SIZE_MB}MB per file · {MAX_TOTAL_SIZE_MB}MB
                    total
                  </p>
                </div>

                {/* Error */}
                {fileError && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px 16px",
                      border: "1px solid rgba(192,57,43,0.4)",
                      background: "rgba(192,57,43,0.06)",
                      animation: "fadeUp 0.3s cubic-bezier(.22,1,.36,1) both",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.7rem",
                        color: "#c0392b",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {fileError}
                    </p>
                  </div>
                )}

                {/* File list */}
                {images.length > 0 && (
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    {images.map((file, index) => {
                      const objectUrl = URL.createObjectURL(file);
                      return (
                        <div key={index} className="file-row">
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              flexShrink: 0,
                              overflow: "hidden",
                              border: "1px solid rgba(245,240,232,0.08)",
                              position: "relative",
                            }}
                          >
                            <Image
                              src={objectUrl}
                              alt="preview"
                              fill
                              style={{
                                objectFit: "cover",
                                filter: "grayscale(20%)",
                              }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.72rem",
                                color: "#f5f0e8",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                marginBottom: "4px",
                              }}
                            >
                              {file.name}
                            </p>
                            <p
                              style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.6rem",
                                color: "rgba(245,240,232,0.3)",
                                letterSpacing: "0.08em",
                              }}
                            >
                              {formatBytes(file.size)}
                            </p>
                          </div>
                          {index === 0 && (
                            <span
                              style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.55rem",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                color: "#c0392b",
                                border: "1px solid rgba(192,57,43,0.35)",
                                padding: "3px 8px",
                                flexShrink: 0,
                              }}
                            >
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "none",
                              padding: "8px",
                              color: "rgba(245,240,232,0.2)",
                              transition: "color 0.2s",
                              flexShrink: 0,
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
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ══ SUBMIT ══ */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "40px",
                flexWrap: "wrap",
                gap: "20px",
                animation: "fadeUp 0.7s 0.3s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              <Link
                href="/"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,0.3)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(245,240,232,0.7)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(245,240,232,0.3)")
                }
              >
                ← Discard
              </Link>

              <button
                type="submit"
                disabled={isLoading || !!fileError}
                className="btn-primary"
                style={{
                  padding: "16px 56px",
                  opacity: isLoading || !!fileError ? 0.5 : 1,
                  cursor: isLoading ? "not-allowed" : "none",
                }}
              >
                {isLoading ? (
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
                    <span>Publishing…</span>
                  </>
                ) : (
                  <>
                    <span>Publish Story</span>
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
    </>
  );
}
