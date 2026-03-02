// ─────────────────────────────────────────────────────────────
// WebNotes Design System — Ink & Paper Editorial Theme
// Single source of truth for all design tokens + shared styles
// ─────────────────────────────────────────────────────────────

export const colors = {
  ink:    "#0a0a08",
  paper:  "#f5f0e8",
  cream:  "#ede8d8",
  rust:   "#c0392b",
  gold:   "#b8860b",
  muted:  "#6b6555",
  border: "#2a2820",
} as const;

export const fonts = {
  display: "'Playfair Display', serif",
  syne:    "'Syne', sans-serif",
  mono:    "'DM Mono', monospace",
} as const;

// ─── Shared page wrapper (dark ink background) ───────────────
export const pageWrapper: React.CSSProperties = {
  minHeight: "100vh",
  background: colors.ink,
  color: colors.paper,
  fontFamily: fonts.mono,
  overflowX: "hidden",
};

// ─── Inner content container ──────────────────────────────────
export const container: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "0 40px",
  width: "100%",
};

// ─── Section label (e.g. "Vol. I — 001") ─────────────────────
export const sectionLabel: React.CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: "0.65rem",
  letterSpacing: "0.25em",
  textTransform: "uppercase" as const,
  color: colors.rust,
};

// ─── Horizontal rule ──────────────────────────────────────────
export const rule: React.CSSProperties = {
  border: "none",
  borderTop: `1px solid rgba(245,240,232,0.12)`,
  margin: "0",
};

// ─── Thin muted divider ───────────────────────────────────────
export const divider: React.CSSProperties = {
  border: "none",
  borderTop: `1px solid rgba(245,240,232,0.08)`,
};

// ─── Input field (ink theme) ──────────────────────────────────
export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  background: "rgba(245,240,232,0.04)",
  border: `1px solid rgba(245,240,232,0.12)`,
  color: colors.paper,
  fontFamily: fonts.mono,
  fontSize: "0.8rem",
  letterSpacing: "0.03em",
  outline: "none",
  transition: "border-color 0.2s",
};

export const inputFocusStyle: React.CSSProperties = {
  borderColor: colors.rust,
  background: "rgba(245,240,232,0.06)",
};

// ─── Textarea (ink theme) ─────────────────────────────────────
export const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "none" as const,
  lineHeight: 1.8,
};

// ─── Label ────────────────────────────────────────────────────
export const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: fonts.mono,
  fontSize: "0.6rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: `rgba(245,240,232,0.4)`,
  marginBottom: "8px",
};

// ─── Primary button (rust fill with ink wipe) ─────────────────
// Use the `.btn-primary` CSS class from GLOBAL_STYLES for full animation.
// This object is for inline-only fallback (no animation):
export const btnPrimaryStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "14px 32px",
  background: colors.rust,
  color: colors.paper,
  fontFamily: fonts.mono,
  fontSize: "0.75rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
  transition: "transform 0.2s",
};

// ─── Ghost button ─────────────────────────────────────────────
export const btnGhostStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "13px 32px",
  background: "transparent",
  color: colors.paper,
  fontFamily: fonts.mono,
  fontSize: "0.75rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  textDecoration: "none",
  border: `1px solid rgba(245,240,232,0.3)`,
  cursor: "pointer",
  transition: "border-color 0.3s, transform 0.2s",
};

// ─── Danger button (rust border, rust text) ───────────────────
export const btnDangerStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 20px",
  background: "transparent",
  color: colors.rust,
  fontFamily: fonts.mono,
  fontSize: "0.7rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  border: `1px solid rgba(192,57,43,0.4)`,
  cursor: "pointer",
  transition: "background 0.2s, border-color 0.2s",
};

// ─── Card (bordered panel) ────────────────────────────────────
export const cardStyle: React.CSSProperties = {
  border: `1px solid rgba(245,240,232,0.1)`,
  padding: "40px",
  background: "rgba(245,240,232,0.02)",
  position: "relative",
};

// ─── Section number (ghosted bg digit) ───────────────────────
export const ghostNumber: React.CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  color: "rgba(245,240,232,0.05)",
  lineHeight: 1,
  userSelect: "none" as const,
  letterSpacing: "-0.04em",
};

// ─── Nav link (underline-reveal on hover) ─────────────────────
// Uses `.nav-link` CSS class — defined in GLOBAL_STYLES on the landing page.
// For inline-only contexts:
export const navLinkStyle: React.CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: "0.7rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: colors.paper,
  textDecoration: "none",
};

// ─── Blink keyframe name (reference for style strings) ────────
export const BLINK_STYLE = "blink 2s infinite";
export const FLOAT_STYLE = "float 6s ease-in-out infinite";
export const FADE_UP_STYLE = (delay = 0) =>
  `fadeUp 0.8s ${delay}s cubic-bezier(.22,1,.36,1) both`;

// ─── Global keyframe + utility CSS (injected once per page) ───
// Pages that don't use the landing page component should inject this.
export const BASE_STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-60px); }
    to   { opacity: 1; transform: translateX(0); }
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
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
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
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes stampIn {
    0%   { opacity: 0; transform: scale(1.4) rotate(-12deg); }
    60%  { opacity: 1; transform: scale(0.95) rotate(3deg); }
    100% { opacity: 1; transform: scale(1) rotate(6deg); }
  }

  * { box-sizing: border-box; }
  ::selection { background: #c0392b; color: #f5f0e8; }

  body {
    background: #0a0a08;
    color: #f5f0e8;
    font-family: 'DM Mono', monospace;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    cursor: none;
  }

  .cursor {
    position: fixed;
    top: 0; left: 0;
    width: 12px; height: 12px;
    background: #c0392b;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s;
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
  }
  .scroll-progress {
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: #c0392b;
    z-index: 9001;
    transition: width 0.1s linear;
  }
  .scanline {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 3px;
    background: linear-gradient(transparent, rgba(192,57,43,0.06), transparent);
    pointer-events: none;
    z-index: 9000;
    animation: scanline 10s linear infinite;
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

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    background: #c0392b;
    color: #f5f0e8;
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
    background: #0a0a08;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.4s cubic-bezier(.77,0,.18,1);
  }
  .btn-primary:hover::before { transform: scaleX(1); transform-origin: left; }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-primary span { position: relative; z-index: 1; }
  .btn-primary svg  { position: relative; z-index: 1; }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 32px;
    background: transparent;
    color: #f5f0e8;
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    text-decoration: none;
    border: 1px solid rgba(245,240,232,0.3);
    cursor: none;
    transition: border-color 0.3s, transform 0.2s;
  }
  .btn-ghost:hover { border-color: #f5f0e8; transform: translateY(-2px); }

  .field-input {
    width: 100%;
    padding: 14px 16px;
    background: rgba(245,240,232,0.04);
    border: 1px solid rgba(245,240,232,0.12);
    color: #f5f0e8;
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.03em;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .field-input:focus {
    border-color: #c0392b;
    background: rgba(245,240,232,0.06);
  }
  .field-input::placeholder { color: rgba(245,240,232,0.25); }

  .field-label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(245,240,232,0.4);
    margin-bottom: 8px;
  }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #c0392b;
  }

  .noise::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    animation: grain 0.5s steps(1) infinite;
    z-index: 1;
    opacity: 0.25;
  }

  .font-display { font-family: 'Playfair Display', serif; }
  .font-syne    { font-family: 'Syne', sans-serif; }
  .font-mono    { font-family: 'DM Mono', monospace; }

  .page-enter { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) both; }

  /* Shared nav for inner pages */
  .inner-nav {
    position: sticky;
    top: 0;
    z-index: 7000;
    padding: 18px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(245,240,232,0.08);
    background: rgba(10,10,8,0.9);
    backdrop-filter: blur(16px);
  }

  @media (max-width: 768px) {
    .inner-nav { padding: 16px 20px; }
    .hide-mobile { display: none !important; }
    .stack-mobile { flex-direction: column !important; }
    .full-mobile  { width: 100% !important; }
  }
`;
