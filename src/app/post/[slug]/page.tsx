import Link from "next/link";
import { notFound } from "next/navigation";
import ClientEditButton from "@/components/ClientEditButton";
import ClientDeleteButton from "@/components/ClientDeleteButton";
import ShareButtons from "@/components/ShareButtons";
import { PostResponseDTO, UserResponseDTO } from "@/app/types";

async function getPost(slug: string): Promise<PostResponseDTO | null> {
  try {
    const res = await fetch(`https://api.webnote.uz/api/posts/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Error fetching post: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to load post:", error);
    return null;
  }
}

async function getAuthor(username: string): Promise<UserResponseDTO | null> {
  try {
    const res = await fetch(`https://api.webnote.uz/api/users/${username}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to load author:", error);
    return null;
  }
}

const POST_STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes revealWidth {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes grain {
    0%, 100% { transform: translate(0,0); }
    10%       { transform: translate(-1%,-2%); }
    30%       { transform: translate(2%,1%); }
    50%       { transform: translate(-2%,2%); }
    70%       { transform: translate(1%,-1%); }
    90%       { transform: translate(-1%,1%); }
  }

  * { box-sizing: border-box; }
  ::selection { background: #c0392b; color: #f5f0e8; }

  body {
    background: #0a0a08;
    color: #f5f0e8;
    font-family: 'DM Mono', monospace;
    -webkit-font-smoothing: antialiased;
  }

  .nav-link {
    position: relative;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #f5f0e8;
    text-decoration: none;
    padding-bottom: 2px;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    height: 1px;
    background: #c0392b;
    width: 0;
    transition: width 0.3s ease;
  }
  .nav-link:hover::after { width: 100%; }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #c0392b;
  }

  /* Prose content styling */
  .post-content {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1rem, 2vw, 1.15rem);
    line-height: 1.9;
    color: rgba(245,240,232,0.82);
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  .post-content p + p {
    margin-top: 1.5em;
  }

  .img-hover {
    transition: transform 0.6s cubic-bezier(.22,1,.36,1), filter 0.4s;
    filter: grayscale(10%) contrast(1.05);
  }
  .img-hover:hover {
    transform: scale(1.03);
    filter: grayscale(0%) contrast(1.08);
  }

  .tag-pill {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(245,240,232,0.45);
    border: 1px solid rgba(245,240,232,0.1);
    padding: 4px 12px;
    transition: color 0.2s, border-color 0.2s;
  }
  .tag-pill:hover {
    color: #f5f0e8;
    border-color: rgba(245,240,232,0.3);
  }

  .cat-pill {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #c0392b;
    border: 1px solid rgba(192,57,43,0.35);
    padding: 4px 12px;
    background: rgba(192,57,43,0.06);
  }

  .noise::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    animation: grain 0.5s steps(1) infinite;
    z-index: 1;
    opacity: 0.2;
  }

  .author-card {
    border: 1px solid rgba(245,240,232,0.08);
    padding: 32px;
    transition: border-color 0.3s;
    position: relative;
  }
  .author-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px;
    height: 0;
    background: #c0392b;
    transition: height 0.4s cubic-bezier(.22,1,.36,1);
  }
  .author-card:hover { border-color: rgba(245,240,232,0.18); }
  .author-card:hover::before { height: 100%; }

  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .post-meta-row { flex-direction: column !important; gap: 20px !important; }
    .gallery-grid { grid-template-columns: 1fr !important; }
  }
`;

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const author = await getAuthor(post.authorUsername);

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const mainImage =
    post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls[0] : null;

  const readingMinutes = Math.max(
    1,
    Math.ceil(post.content?.replace(/<[^>]*>/g, "").split(/\s+/).length / 200),
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: POST_STYLES }} />

      <div style={{ background: "#0a0a08", minHeight: "100vh" }}>
        {/* ── Sticky nav ── */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 500,
            padding: "18px 40px",
            borderBottom: "1px solid rgba(245,240,232,0.08)",
            background: "rgba(10,10,8,0.92)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
            {author && (
              <Link href={`/${author.username}`} className="nav-link">
                Author
              </Link>
            )}
            <div
              style={{
                width: "1px",
                height: "16px",
                background: "rgba(245,240,232,0.12)",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {author && (
                <>
                  <ClientEditButton
                    authorUsername={author.username}
                    slug={slug}
                  />
                  <ClientDeleteButton
                    authorUsername={author.username}
                    postId={post.id}
                  />
                </>
              )}
            </div>
          </div>
        </nav>

        <article>
          {/* ── Hero Banner ── */}
          {mainImage ? (
            <div
              className="noise"
              style={{
                position: "relative",
                width: "100%",
                height: "clamp(320px, 55vh, 680px)",
                overflow: "hidden",
                background: "#111",
              }}
            >
              <img
                src={mainImage}
                alt={post.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  opacity: 0.55,
                  filter: "grayscale(20%) contrast(1.1)",
                }}
                className="img-hover"
              />

              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(10,10,8,1) 0%, rgba(10,10,8,0.6) 40%, rgba(10,10,8,0.2) 100%)",
                  zIndex: 2,
                }}
              />

              {/* Banner content */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "clamp(24px,5vw,64px)",
                  zIndex: 3,
                }}
              >
                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginBottom: "20px",
                      animation: "fadeUp 0.6s 0.1s both",
                    }}
                  >
                    {post.categories.map((cat) => (
                      <span key={cat.id} className="cat-pill">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    fontSize: "clamp(2rem, 5.5vw, 5rem)",
                    lineHeight: 1.0,
                    letterSpacing: "-0.02em",
                    color: "#f5f0e8",
                    maxWidth: "900px",
                    animation: "fadeUp 0.8s 0.2s both",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {post.title}
                </h1>

                {/* Meta row */}
                <div
                  className="post-meta-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "32px",
                    marginTop: "24px",
                    animation: "fadeUp 0.8s 0.35s both",
                    flexWrap: "wrap",
                  }}
                >
                  {author && (
                    <Link
                      href={`/${author.username}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        textDecoration: "none",
                      }}
                    >
                      {author.profileImageUrl ? (
                        <img
                          src={author.profileImageUrl}
                          alt={author.username}
                          style={{
                            width: "36px",
                            height: "36px",
                            objectFit: "cover",
                            filter: "grayscale(20%)",
                            border: "1px solid rgba(245,240,232,0.2)",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            background: "rgba(192,57,43,0.2)",
                            border: "1px solid rgba(192,57,43,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "#c0392b",
                          }}
                        >
                          {author.firstName?.[0] || author.username?.[0]}
                        </div>
                      )}
                      <div>
                        <p
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            color: "#f5f0e8",
                            lineHeight: 1,
                            marginBottom: "3px",
                          }}
                        >
                          {author.firstName} {author.lastName}
                        </p>
                        <p
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.6rem",
                            color: "rgba(245,240,232,0.45)",
                            letterSpacing: "0.08em",
                          }}
                        >
                          @{author.username}
                        </p>
                      </div>
                    </Link>
                  )}

                  <div
                    style={{
                      width: "1px",
                      height: "28px",
                      background: "rgba(245,240,232,0.15)",
                    }}
                    className="hide-mobile"
                  />

                  <time
                    dateTime={post.createdAt}
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      color: "rgba(245,240,232,0.5)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {formattedDate}
                  </time>

                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(245,240,232,0.35)",
                      letterSpacing: "0.08em",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    {readingMinutes} min read
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* No image — text-only header */
            <div
              style={{
                padding: "80px clamp(24px,5vw,80px) 60px",
                borderBottom: "1px solid rgba(245,240,232,0.08)",
                background: "#0a0a08",
              }}
            >
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "24px",
                    animation: "fadeUp 0.6s 0.1s both",
                  }}
                >
                  {post.categories.map((cat) => (
                    <span key={cat.id} className="cat-pill">
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}

              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: "clamp(2.2rem, 6vw, 5.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "#f5f0e8",
                  maxWidth: "900px",
                  animation: "fadeUp 0.8s 0.15s both",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {post.title}
              </h1>

              <div
                className="post-meta-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "32px",
                  marginTop: "40px",
                  paddingTop: "32px",
                  borderTop: "1px solid rgba(245,240,232,0.08)",
                  animation: "fadeUp 0.8s 0.3s both",
                  flexWrap: "wrap",
                }}
              >
                {author && (
                  <Link
                    href={`/${author.username}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      textDecoration: "none",
                    }}
                  >
                    {author.profileImageUrl ? (
                      <img
                        src={author.profileImageUrl}
                        alt={author.username}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          filter: "grayscale(10%)",
                          border: "1px solid rgba(245,240,232,0.12)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          background: "rgba(192,57,43,0.12)",
                          border: "1px solid rgba(192,57,43,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: "#c0392b",
                        }}
                      >
                        {author.firstName?.[0] || author.username?.[0]}
                      </div>
                    )}
                    <div>
                      <p
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: "#f5f0e8",
                          lineHeight: 1,
                          marginBottom: "4px",
                        }}
                      >
                        {author.firstName} {author.lastName}
                      </p>
                      <p
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.62rem",
                          color: "rgba(245,240,232,0.4)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        @{author.username}
                      </p>
                    </div>
                  </Link>
                )}

                <time
                  dateTime={post.createdAt}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.68rem",
                    color: "rgba(245,240,232,0.4)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {formattedDate}
                </time>

                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    color: "rgba(245,240,232,0.3)",
                    letterSpacing: "0.08em",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {readingMinutes} min read
                </div>

                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {author && (
                    <>
                      <ClientEditButton
                        authorUsername={author.username}
                        slug={slug}
                      />
                      <ClientDeleteButton
                        authorUsername={author.username}
                        postId={post.id}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Main Body ── */}
          <div
            style={{
              maxWidth: "780px",
              margin: "0 auto",
              padding: "clamp(40px,6vw,80px) clamp(24px,5vw,40px)",
            }}
          >
            {/* Edit/Delete buttons below banner (only shown when banner image present) */}
            {mainImage && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "56px",
                  paddingBottom: "32px",
                  borderBottom: "1px solid rgba(245,240,232,0.08)",
                  flexWrap: "wrap",
                  gap: "16px",
                  animation: "fadeUp 0.6s 0.4s both",
                }}
              >
                <ShareButtons title={post.title} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginLeft: "auto",
                  }}
                >
                  {author && (
                    <>
                      <ClientEditButton
                        authorUsername={author.username}
                        slug={slug}
                      />
                      <ClientDeleteButton
                        authorUsername={author.username}
                        postId={post.id}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Share (no-image variant, shown inline after meta) */}
            {!mainImage && (
              <div
                style={{
                  marginBottom: "48px",
                  animation: "fadeUp 0.6s 0.45s both",
                }}
              >
                <ShareButtons title={post.title} />
              </div>
            )}

            {/* ── Content ── */}
            <div
              className="post-content"
              style={{ animation: "fadeUp 0.8s 0.3s both" }}
            >
              {post.content}
            </div>

            {/* ── Gallery ── */}
            {post.imageUrls && post.imageUrls.length > 1 && (
              <div
                style={{
                  marginTop: "72px",
                  paddingTop: "56px",
                  borderTop: "1px solid rgba(245,240,232,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "40px",
                  }}
                >
                  <p className="section-label">Gallery</p>
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "rgba(245,240,232,0.08)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.6rem",
                      color: "rgba(245,240,232,0.25)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {post.imageUrls.length - 1} image
                    {post.imageUrls.length - 1 !== 1 ? "s" : ""}
                  </span>
                </div>

                <div
                  className="gallery-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                  }}
                >
                  {post.imageUrls.slice(1).map((url, index) => (
                    <div
                      key={index}
                      style={{
                        overflow: "hidden",
                        border: "1px solid rgba(245,240,232,0.08)",
                        background: "rgba(245,240,232,0.02)",
                        position: "relative",
                      }}
                    >
                      <img
                        src={url}
                        alt={`Gallery image ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                        }}
                        className="img-hover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tags ── */}
            {post.tags && post.tags.length > 0 && (
              <div
                style={{
                  marginTop: "64px",
                  paddingTop: "48px",
                  borderTop: "1px solid rgba(245,240,232,0.08)",
                }}
              >
                <p className="section-label" style={{ marginBottom: "20px" }}>
                  Tags
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Author card ── */}
            {author && (
              <div
                style={{
                  marginTop: "72px",
                  paddingTop: "56px",
                  borderTop: "1px solid rgba(245,240,232,0.08)",
                }}
              >
                <p className="section-label" style={{ marginBottom: "24px" }}>
                  About the Author
                </p>

                <Link
                  href={`/${author.username}`}
                  style={{ textDecoration: "none" }}
                  className="author-card"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "24px",
                      flexWrap: "wrap",
                    }}
                  >
                    {author.profileImageUrl ? (
                      <img
                        src={author.profileImageUrl}
                        alt={author.username}
                        style={{
                          width: "72px",
                          height: "72px",
                          objectFit: "cover",
                          flexShrink: 0,
                          filter: "grayscale(15%)",
                          border: "1px solid rgba(245,240,232,0.1)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "72px",
                          height: "72px",
                          flexShrink: 0,
                          background: "rgba(192,57,43,0.1)",
                          border: "1px solid rgba(192,57,43,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 900,
                          fontSize: "1.8rem",
                          color: "#c0392b",
                        }}
                      >
                        {author.firstName?.[0] || author.username?.[0]}
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 800,
                          fontSize: "1.1rem",
                          color: "#f5f0e8",
                          marginBottom: "4px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {author.firstName} {author.lastName}
                      </p>
                      <p
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.65rem",
                          color: "#c0392b",
                          letterSpacing: "0.1em",
                          marginBottom: "14px",
                        }}
                      >
                        @{author.username}
                      </p>
                      {author.bio && (
                        <p
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.75rem",
                            lineHeight: 1.8,
                            color: "rgba(245,240,232,0.45)",
                          }}
                        >
                          {author.bio.length > 180
                            ? author.bio.slice(0, 180) + "…"
                            : author.bio}
                        </p>
                      )}
                    </div>

                    <div
                      className="hide-mobile"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.65rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(245,240,232,0.25)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexShrink: 0,
                        alignSelf: "center",
                        transition: "color 0.2s",
                      }}
                    >
                      View Profile
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
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* ── Footer nav ── */}
            <div
              style={{
                marginTop: "72px",
                paddingTop: "40px",
                borderTop: "1px solid rgba(245,240,232,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,0.4)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  borderBottom: "1px solid transparent",
                  paddingBottom: "2px",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#f5f0e8";
                  (e.currentTarget as HTMLElement).style.borderBottomColor =
                    "#c0392b";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(245,240,232,0.4)";
                  (e.currentTarget as HTMLElement).style.borderBottomColor =
                    "transparent";
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>

              {author && (
                <Link
                  href={`/${author.username}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.4)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    borderBottom: "1px solid transparent",
                    paddingBottom: "2px",
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#f5f0e8";
                    (e.currentTarget as HTMLElement).style.borderBottomColor =
                      "#c0392b";
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(245,240,232,0.4)";
                    (e.currentTarget as HTMLElement).style.borderBottomColor =
                      "transparent";
                  }}
                >
                  More by {author.firstName}
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
          </div>
        </article>

        {/* ── Footer ── */}
        <footer
          style={{
            borderTop: "1px solid rgba(245,240,232,0.06)",
            padding: "40px clamp(24px,5vw,80px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
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
            <span
              style={{
                width: "28px",
                height: "28px",
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
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "0.95rem",
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
              color: "rgba(245,240,232,0.2)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            © {new Date().getFullYear()} WebNotes
          </p>
        </footer>
      </div>
    </>
  );
}
