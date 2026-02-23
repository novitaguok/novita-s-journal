"use client";

import { useState, useMemo } from "react";
import { ARTICLES, TAG_COLORS } from "../../lib/data";
import { Rule, Annotation, CodeBlock } from "../../components/ui/Shared";

const pageWrapper: React.CSSProperties = {
  paddingTop: "52px",
  minHeight: "100vh",
};

const container: React.CSSProperties = {
  maxWidth: "860px",
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

const toolbar: React.CSSProperties = {
  display: "flex",
  gap: "0.75rem",
  alignItems: "center",
  marginBottom: "2rem",
  flexWrap: "wrap",
};

const searchBox: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  flex: 1,
  minWidth: "180px",
  background: "var(--canvas-card)",
  border: "1px solid var(--rule)",
  borderRadius: "6px",
  padding: "0.4rem 0.75rem",
};

const searchInput: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.7rem",
  border: "none",
  background: "transparent",
  color: "var(--ink)",
  outline: "none",
  width: "100%",
  caretColor: "var(--accent-link)",
};

const clearButton: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.65rem",
  color: "var(--ink-faint)",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "0",
};

const tagGroup: React.CSSProperties = {
  display: "flex",
  gap: "0.35rem",
};

const resultCount: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.62rem",
  color: "var(--ink-faint)",
  marginBottom: "1rem",
};

const listWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const emptyState: React.CSSProperties = {
  textAlign: "center",
  padding: "3rem 0",
};

const emptyLabel: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.8rem",
  color: "var(--ink-faint)",
  marginBottom: "0.5rem",
};

const SEARCH_ICON_PATH =
  "M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z";

const TAGS = ["all", "engineering", "design", "essay"] as const;

function tagButtonStyle(tag: string, isActive: boolean): React.CSSProperties {
  const tc = tag !== "all" ? TAG_COLORS[tag] : null;
  return {
    fontFamily: "var(--f-mono)",
    fontSize: "0.65rem",
    fontWeight: 600,
    padding: "0.35rem 0.75rem",
    borderRadius: "5px",
    border: "1px solid var(--rule)",
    background: isActive ? (tc ? tc.bg : "var(--ink)") : "transparent",
    color: isActive ? (tc ? tc.text : "var(--canvas)") : "var(--ink-faint)",
    cursor: "pointer",
    transition: "all 0.15s",
  };
}

function articleCardStyle(
  isHovered: boolean,
  borderColor: string,
): React.CSSProperties {
  return {
    borderLeft: `3px solid ${isHovered ? borderColor : "var(--rule)"}`,
    padding: "1.25rem",
    background: isHovered ? "var(--canvas-hover)" : "transparent",
    borderRadius: "0 8px 8px 0",
    transition: "all 0.2s ease",
    cursor: "pointer",
  };
}

const metaRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  marginBottom: "0.4rem",
};

const mono058: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.58rem",
  color: "var(--ink-faint)",
};

const articleTitle: React.CSSProperties = {
  fontFamily: "var(--f-display)",
  fontSize: "1.1rem",
  fontWeight: 700,
  color: "var(--ink)",
  letterSpacing: "-0.015em",
  lineHeight: 1.25,
  marginBottom: "0.4rem",
};

export default function Articles() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string>("all");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      ARTICLES.filter((article) => {
        const matchesTag = activeTag === "all" || article.tag === activeTag;
        const query = search.toLowerCase();
        const matchesSearch =
          !search ||
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query);
        return matchesTag && matchesSearch;
      }),
    [search, activeTag],
  );

  const showResultCount = search || activeTag !== "all";

  return (
    <div style={pageWrapper}>
      <div style={container}>
        {/* Header */}
        <div style={headerRow}>
          <h2 style={heading}>writing/</h2>
          <span style={headingAnnotation}>
            things I figured out ({ARTICLES.length} posts)
          </span>
        </div>
        <Rule style={{ marginBottom: "1.5rem" }} />

        {/* Search + filter toolbar */}
        <div style={toolbar}>
          <div style={searchBox}>
            <svg
              viewBox="0 0 16 16"
              width="12"
              height="12"
              fill="var(--ink-faint)"
            >
              <path d={SEARCH_ICON_PATH} />
            </svg>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search articles..."
              style={searchInput}
            />

            {search && (
              <button onClick={() => setSearch("")} style={clearButton}>
                ✕
              </button>
            )}
          </div>

          <div style={tagGroup}>
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                style={tagButtonStyle(tag, activeTag === tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {showResultCount && (
          <p style={resultCount}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {search ? ` for "${search}"` : ""}
          </p>
        )}

        {/* Article list */}
        <div style={listWrapper}>
          {filtered.length === 0 ? (
            <div style={emptyState}>
              <div style={emptyLabel}>no results found</div>
              <Annotation
                text="try a different search?"
                style={{ justifyContent: "center" }}
              />
            </div>
          ) : (
            filtered.map((article) => {
              const tagColor = TAG_COLORS[article.tag];
              const isHovered = hoveredId === article.id;

              return (
                <div
                  key={article.id}
                  onMouseEnter={() => setHoveredId(article.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={articleCardStyle(isHovered, tagColor.text)}
                >
                  {/* Meta row */}
                  <div style={metaRow}>
                    <span
                      style={{
                        ...mono058,
                        fontWeight: 600,
                        padding: "0.15rem 0.4rem",
                        borderRadius: "4px",
                        background: tagColor.bg,
                        color: tagColor.text,
                      }}
                    >
                      {article.tag}
                    </span>
                    <span style={mono058}>{article.date}</span>
                    <span style={{ ...mono058, marginLeft: "auto" }}>
                      {article.readTime}m · {article.lines} lines ·{" "}
                      {article.views.toLocaleString()} views
                    </span>
                  </div>

                  <h3 style={articleTitle}>{article.title}</h3>

                  <p
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: "0.84rem",
                      lineHeight: 1.65,
                      color: "var(--ink-soft)",
                      marginBottom: isHovered ? "0.85rem" : "0",
                    }}
                  >
                    {article.excerpt}
                  </p>

                  {isHovered && (
                    <CodeBlock
                      code={article.preview}
                      lang={article.tag === "engineering" ? "ts" : "css"}
                      compact
                      style={{ marginTop: "0.25rem" }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
