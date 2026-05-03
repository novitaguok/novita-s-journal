"use client";

import { useState, useMemo, useEffect } from "react";
import { TAG_COLORS } from "../../lib/data";
import {
  Rule,
  Annotation,
  CodeBlock,
  Skeleton,
  TagBadge,
} from "../../components/Shared";
import { ArticleListItem } from "@/src/types";
import Link from "next/link";

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

function useDebounce(value: string, delay = 300) {
  const [debounce, setDebounce] = useState(value);

  useEffect(() => {
    const timeOut = setTimeout(() => setDebounce(value), delay);
    return () => clearTimeout(timeOut);
  }, [value, delay]);

  return debounce;
}

async function fetchArticles(
  tag: string,
  searchQ: string,
): Promise<ArticleListItem[]> {
  const param = new URLSearchParams();

  if (tag !== "all") param.set("tag", tag);
  if (searchQ) param.set("search", searchQ);

  const res = await fetch(`/api/articles?${param}`); // TODO: put in a constant class
  const json = await res.json();

  return json.data ?? [];
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

export default function ArticleListPage() {
  const [searchQ, setSearchQ] = useState("");
  const [activeTag, setActiveTag] = useState<string>("all");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [articleList, setArticleList] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const debounceSearchQ = useDebounce(searchQ);

  useEffect(() => {
    setLoading(true);
    fetchArticles(activeTag, debounceSearchQ).then((data) => {
      setArticleList(data);
      setLoading(false);
    });
  }, [activeTag, debounceSearchQ]);

  return (
    <div style={pageWrapper}>
      <div style={container}>
        {/* Header */}
        <div style={headerRow}>
          <h2 style={heading}>writing/</h2>
          <span style={headingAnnotation}>
            things I figured out ({articleList.length} posts)
          </span>
        </div>
        <Rule style={{ marginBottom: "1.5rem" }} />

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
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="search articles..."
              style={searchInput}
            />
            {searchQ && (
              <button onClick={() => setSearchQ("")} style={clearButton}>
                ✕
              </button>
            )}
          </div>

          {/* Tag filters */}
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

        {/* Count */}
        {!loading && (searchQ || activeTag !== "all") && (
          <p style={resultCount}>
            {articleList.length} result{articleList.length !== 1 ? "s" : ""}
            {searchQ ? ` for "${searchQ}"` : ""}
          </p>
        )}

        {/* List */}
        <div style={listWrapper}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  padding: "1.5rem",
                  border: "1px solid var(--rule)",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.6rem",
                  }}
                >
                  <Skeleton height={18} width={70} />
                  <Skeleton height={18} width={90} />
                </div>
                <Skeleton
                  height={22}
                  width="70%"
                  style={{ marginBottom: "0.4rem" }}
                />
                <Skeleton height={16} width="90%" />
              </div>
            ))
          ) : articleList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <p
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: "0.8rem",
                  color: "var(--ink-faint)",
                  marginBottom: "0.5rem",
                }}
              >
                no results found
              </p>
              <Annotation
                text="try a different search?"
                style={{ justifyContent: "center" }}
              />
            </div>
          ) : (
            articleList.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  onMouseEnter={() => setHoveredId(article.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={articleCardStyle(
                    hoveredId === article.id,
                    TAG_COLORS[article.tag].text,
                  )}
                  // style={{
                  //   borderLeft: `3px solid ${hoveredId === article.id ? "var(--accent)" : "var(--rule)"}`,
                  //   padding: "1.25rem",
                  //   background:
                  //     hoveredId === article.id
                  //       ? "var(--canvas-hover)"
                  //       : "transparent",
                  //   borderRadius: "0 8px 8px 0",
                  //   transition: "all 0.2s ease",
                  //   cursor: "pointer",
                  // }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <TagBadge tag={article.tag} />
                    <span
                      style={{
                        fontFamily: "var(--f-mono)",
                        fontSize: "0.58rem",
                        color: "var(--ink-faint)",
                      }}
                    >
                      {new Date(article.publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--f-mono)",
                        fontSize: "0.58rem",
                        color: "var(--ink-faint)",
                        marginLeft: "auto",
                      }}
                    >
                      {article.readTime}m · {article.views.toLocaleString()}{" "}
                      views
                    </span>
                  </div>
                  <h3 style={articleTitle}>{article.title}</h3>
                  <p
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: "0.84rem",
                      lineHeight: 1.65,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
