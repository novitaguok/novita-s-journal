"use client";

import { useEffect, useState, useCallback } from "react";
import { Rule, Annotation } from "../../components/Shared";
import {
  StoryboardPost,
  StoryboardCategory,
} from "@/src/domain/storyboard/types";

const pageWrapper: React.CSSProperties = {
  paddingTop: "52px",
  minHeight: "100vh",
};

const container: React.CSSProperties = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "3.5rem 2.5rem 5rem",
};

const headerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: "1rem",
  marginBottom: "0.25rem",
};

const heading: React.CSSProperties = {
  fontFamily: "var(--f-display)",
  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
  fontWeight: 700,
  color: "var(--ink)",
  letterSpacing: "-0.025em",
};

const headingAnnotation: React.CSSProperties = {
  fontFamily: "var(--f-hand)",
  fontSize: "0.85rem",
  color: "var(--annotation)",
};

const headerBottom: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  marginTop: "1.25rem",
  marginBottom: "1.5rem",
};

// Masonry grid via CSS columns — cards flow into the shortest column and
// the column width auto-fits the container (1 col mobile, 3+ on desktop).
const board: React.CSSProperties = {
  columnWidth: "280px",
  columnGap: "1rem",
};

const card: React.CSSProperties = {
  breakInside: "avoid",
  marginBottom: "1rem",
  padding: "1.15rem 1.2rem",
  background: "var(--canvas-card)",
  border: "1px solid var(--rule)",
  borderRadius: "10px",
  transition: "all 0.2s ease",
};

const cardMeta: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  marginBottom: "0.5rem",
  flexWrap: "wrap",
};

const monoSmall: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.6rem",
  color: "var(--ink-faint)",
};

const cardMessage: React.CSSProperties = {
  fontFamily: "var(--f-body)",
  fontSize: "0.92rem",
  lineHeight: 1.65,
  color: "var(--ink-soft)",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const CLAMP_LINES = 4;

const messageClamped: React.CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: CLAMP_LINES,
  overflow: "hidden",
};
const expandToggle: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.6rem",
  color: "var(--accent-link)",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "0.35rem 0 0",
  textDecoration: "underline",
  textUnderlineOffset: "2px",
};

const primaryButton: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.7rem",
  fontWeight: 600,
  padding: "0.5rem 1.15rem",
  borderRadius: "6px",
  background: "var(--ink)",
  color: "var(--canvas)",
  border: "none",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  transition: "opacity 0.15s",
};

// Modal
const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  backdropFilter: "blur(3px)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1.5rem",
};

const modal: React.CSSProperties = {
  background: "var(--canvas)",
  border: "1px solid var(--rule-dark)",
  borderRadius: "12px",
  boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
  width: "100%",
  maxWidth: "480px",
  padding: "1.5rem",
};

const formLabel: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.62rem",
  color: "var(--ink-faint)",
  fontWeight: 600,
  marginBottom: "0.4rem",
  display: "block",
};

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.72rem",
  border: "1px solid var(--rule)",
  borderRadius: "6px",
  background: "var(--canvas-code)",
  color: "var(--ink)",
  padding: "0.5rem 0.75rem",
  outline: "none",
  width: "100%",
  caretColor: "var(--accent-link)",
};

const categoryGroup: React.CSSProperties = {
  display: "flex",
  gap: "0.35rem",
  flexWrap: "wrap",
};

const CATEGORY_META: Record<
  StoryboardCategory,
  { label: string; icon: string; color: string; bg: string }
> = {
  thought: {
    label: "thought",
    icon: "💭",
    color: "#9333ea",
    bg: "rgba(147,51,234,0.12)",
  },
  suggestion: {
    label: "suggestion",
    icon: "💡",
    color: "#0969da",
    bg: "rgba(9,105,218,0.12)",
  },
  idea: {
    label: "idea",
    icon: "🚀",
    color: "#ea580c",
    bg: "rgba(234,88,12,0.12)",
  },
  random: {
    label: "random",
    icon: "🎲",
    color: "#5a9a52",
    bg: "rgba(94,158,85,0.12)",
  },
};

const CATEGORIES = Object.keys(CATEGORY_META) as StoryboardCategory[];

function categoryBadgeStyle(category: StoryboardCategory): React.CSSProperties {
  const meta = CATEGORY_META[category];
  return {
    fontFamily: "var(--f-mono)",
    fontSize: "0.58rem",
    fontWeight: 600,
    padding: "0.15rem 0.4rem",
    borderRadius: 4,
    background: meta.bg,
    color: meta.color,
  };
}

function categoryButtonStyle(
  category: StoryboardCategory,
  isActive: boolean,
): React.CSSProperties {
  const meta = CATEGORY_META[category];
  return {
    fontFamily: "var(--f-mono)",
    fontSize: "0.65rem",
    fontWeight: 600,
    padding: "0.35rem 0.75rem",
    borderRadius: "5px",
    border: "1px solid var(--rule)",
    background: isActive ? meta.bg : "transparent",
    color: isActive ? meta.color : "var(--ink-faint)",
    cursor: "pointer",
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
  };
}

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function fetchPosts(): Promise<StoryboardPost[]> {
  const res = await fetch("/api/storyboard");
  const json = await res.json();
  return json.data ?? [];
}

function StoryCard({ post }: { post: StoryboardPost }) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[post.category];
  const isLong = post.message.length > 220;

  return (
    <div
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--canvas-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--canvas-card)";
      }}
      style={card}
    >
      <div style={cardMeta}>
        <span style={categoryBadgeStyle(post.category)}>
          {meta.icon} {meta.label}
        </span>
        <span style={monoSmall}>{post.name || "anonymous"}</span>
        <span style={{ ...monoSmall, marginLeft: "auto" }}>
          {formatRelative(post.createdAt)}
        </span>
      </div>
      <p
        style={{
          ...cardMessage,
          ...(isLong && !expanded ? messageClamped : null),
        }}
      >
        {post.message}
      </p>
      {isLong && (
        <button onClick={() => setExpanded((v) => !v)} style={expandToggle}>
          {expanded ? "show less ↑" : "read more ↓"}
        </button>
      )}
    </div>
  );
}

export default function StoryboardPage() {
  const [posts, setPosts] = useState<StoryboardPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<StoryboardCategory>("thought");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justPosted, setJustPosted] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  // Close on Escape, lock body scroll while the modal is open.
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const openModal = useCallback(() => {
    setError(null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (submitting) return;
    setModalOpen(false);
    setError(null);
    setMessage("");
  }, [submitting]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, message }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Something went wrong");
        return;
      }

      setPosts((prev) => [json.data, ...prev]);
      setMessage("");
      setName("");
      setCategory("thought");
      setModalOpen(false);
      setJustPosted(true);
      setTimeout(() => setJustPosted(false), 3000);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={pageWrapper}>
      <div style={container}>
        {/* Header */}
        <div style={headerRow}>
          <h2 style={heading}>story/</h2>
          <span style={headingAnnotation}>
            a board for the community — sharing is caring
          </span>
        </div>
        <Rule style={{ marginBottom: "0" }} />

        <div style={headerBottom}>
          <span style={monoSmall}>
            {loading ? "loading…" : `${posts.length} pinned`}
          </span>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            {justPosted && (
              <Annotation
                text="posted! thanks for sharing 💛"
                style={{ margin: 0 }}
              />
            )}
            <button onClick={openModal} style={primaryButton}>
              📌 pin something
            </button>
          </div>
        </div>

        {/* Board — masonry grid */}
        {loading ? (
          <p style={{ ...monoSmall, textAlign: "center", padding: "3rem 0" }}>
            loading the board…
          </p>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <p
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.8rem",
                color: "var(--ink-faint)",
                marginBottom: "0.5rem",
              }}
            >
              the board is empty
            </p>
            <Annotation
              text="be the first to pin something up!"
              style={{ justifyContent: "center", marginBottom: "1rem" }}
            />
            <button onClick={openModal} style={primaryButton}>
              📌 pin something
            </button>
          </div>
        ) : (
          <div style={board}>
            {posts.map((post) => (
              <StoryCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Composer modal */}
      {modalOpen && (
        <div style={overlay} onClick={closeModal}>
          <div
            style={modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Pin something to the storyboard"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                  letterSpacing: "-0.015em",
                }}
              >
                pin something up 📌
              </h3>
              <button
                onClick={closeModal}
                aria-label="Close"
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: "0.8rem",
                  color: "var(--ink-faint)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.2rem",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={formLabel}>name (optional)</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  placeholder="anonymous"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={formLabel}>category</label>
                <div style={categoryGroup}>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      style={categoryButtonStyle(c, category === c)}
                    >
                      <span style={{ fontSize: "0.7rem" }}>
                        {CATEGORY_META[c].icon}
                      </span>
                      {CATEGORY_META[c].label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={formLabel}>message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  rows={4}
                  autoFocus
                  placeholder="a thought, suggestion, idea, or something random…"
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              {error && (
                <p
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: "0.68rem",
                    color: "#d73a49",
                    marginBottom: "0.75rem",
                  }}
                >
                  {error}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <button
                  type="submit"
                  disabled={submitting || !message.trim()}
                  style={{
                    ...primaryButton,
                    cursor:
                      submitting || !message.trim() ? "default" : "pointer",
                    opacity: submitting || !message.trim() ? 0.5 : 1,
                  }}
                >
                  {submitting ? "posting…" : "pin it"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: "0.7rem",
                    color: "var(--ink-faint)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  cancel
                </button>
                <span style={{ ...monoSmall, marginLeft: "auto" }}>
                  {message.length}/500
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
