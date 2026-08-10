"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Article } from "@/src/domain/articles/types";
import { CodeBlock, Rule, TagBadge } from "./Shared";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProgressBar } from "./ProgressBar";
import { AuthorCard } from "./AuthorCard";
import { ReadNext } from "./ReadNext";
import { ImageZoom } from "./ImageZoom";
import ArticleLayoutWrapper from "./ArticleLayoutWrapper";
import GiscusClient from "./GiscusClient";
import { ArticleListItem } from "@/src/domain/articles/types";
import { useTheme } from "./ThemeProvider";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractHeadings(markdown: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const cleanText = rawText.replace(/[*_~`]/g, "");
    const id = slugify(cleanText);
    if (id && cleanText) {
      items.push({ id, text: cleanText, level });
    }
  }
  return items;
}

export function BlogPost({
  article,
  commentsComponent,
  readNextArticles = [],
}: {
  article: Article;
  commentsComponent?: React.ReactNode;
  readNextArticles?: ArticleListItem[];
}) {
  const { isWide } = useTheme();
  const [activeId, setActiveId] = useState<string>("");

  const tocItems = useMemo(
    () => extractHeadings(article.body),
    [article.body]
  );

  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const mdComponents: Components = {
    h2: ({ children }) => {
      const text = React.Children.toArray(children).join("");
      const id = slugify(text);
      return (
        <h2
          id={id}
          className="scroll-mt-24 mt-8 mb-4 border-b border-rule pb-2 font-display text-2xl font-bold tracking-tight text-ink"
          style={{
            fontFamily: "var(--f-display)",
            color: "var(--ink)",
            borderBottom: "1px solid var(--rule)",
          }}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = React.Children.toArray(children).join("");
      const id = slugify(text);
      return (
        <h3
          id={id}
          className="scroll-mt-24 mt-6 mb-5 font-display text-xl font-bold text-ink"
          style={{
            fontFamily: "var(--f-display)",
            color: "var(--ink)",
          }}
        >
          {children}
        </h3>
      );
    },
    h4: ({ children }) => (
      <h4
        className="mt-5 mb-2 font-display text-lg font-semibold text-ink"
        style={{
          fontFamily: "var(--f-display)",
          color: "var(--ink)",
        }}
      >
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p
        className="mb-5 leading-relaxed text-ink-soft"
        style={{
          fontFamily: "var(--f-body)",
          fontSize: "1.05rem",
          lineHeight: "1.85",
          color: "var(--ink-soft)",
          whiteSpace: "pre-wrap",
        }}
      >
        {children}
      </p>
    ),
    code: ({ node, className, children, ...props }) => {
      const isBlock = !!className;
      const lang = className?.replace("language-", "") ?? "ts";
      const code = String(children).replace(/\n$/, "");

      if (isBlock) {
        return (
          <CodeBlock code={code} lang={lang} style={{ margin: "1.5rem 0" }} />
        );
      }

      return (
        <code
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: "0.82em",
            background: "var(--canvas-code)",
            border: "1px solid var(--rule)",
            borderRadius: "4px",
            padding: "0.1em 0.35em",
            color: "var(--tok-kw)",
          }}
        >
          {children}
        </code>
      );
    },
    pre: ({ children }) => <>{children}</>,
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--accent-link)",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        }}
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong style={{ fontWeight: 700, color: "var(--ink)" }}>
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em style={{ fontStyle: "italic", color: "var(--ink-soft)" }}>
        {children}
      </em>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          borderLeft: "3px solid var(--rule-dark)",
          paddingLeft: "1.25rem",
          fontStyle: "italic",
          color: "var(--ink-soft)",
          margin: "1.5rem 0",
        }}
      >
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul
        style={{
          paddingLeft: "1.5rem",
          marginBottom: "1.25rem",
          listStyleType: "disc",
          color: "var(--ink-soft)",
        }}
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        style={{
          paddingLeft: "1.5rem",
          marginBottom: "1.25rem",
          listStyleType: "decimal",
          color: "var(--ink-soft)",
        }}
      >
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li style={{ marginBottom: "0.35rem" }}>{children}</li>
    ),
    hr: () => (
      <div style={{ height: 1, background: "var(--rule)", margin: "2rem 0" }} />
    ),
    table: ({ children }) => (
      <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "var(--f-mono)",
            fontSize: "0.8rem",
          }}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead style={{ borderBottom: "2px solid var(--rule-dark)" }}>
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th
        style={{
          padding: "0.5rem 0.75rem",
          textAlign: "left",
          color: "var(--ink)",
          fontWeight: 600,
        }}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td
        style={{
          padding: "0.5rem 0.75rem",
          color: "var(--ink-soft)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        {children}
      </td>
    ),
    img: ({ src, alt }) => (
      <ImageZoom src={typeof src === "string" ? src : undefined} alt={alt} />
    ),
  };

  const isUpdated =
    article.updatedAt &&
    article.updatedAt !== article.publishedAt &&
    new Date(article.updatedAt).toLocaleDateString() !==
      new Date(article.publishedAt).toLocaleDateString();

  return (
    <article style={{ paddingTop: "52px", minHeight: "100vh" }}>
      <ProgressBar />
      <ArticleLayoutWrapper>
        <Link
          href="/articles"
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: "0.68rem",
            color: "var(--ink-faint)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "2rem",
            transition: "color 0.2s",
          }}
        >
          ← writing/
        </Link>

        {/* Article Header */}
        <header style={{ marginBottom: "2.5rem" }}>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/articles" },
              { label: article.title },
            ]}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <TagBadge tag={article.tag} tags={article.tags} />
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.62rem",
                color: "var(--ink-faint)",
                background: "var(--canvas-card)",
                border: "1px solid var(--rule)",
                padding: "0.15rem 0.5rem",
                borderRadius: "4px",
              }}
            >
              ⏱️ {article.readTime} min read
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--f-display)",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            {article.title}
          </h1>

          <div
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.68rem",
              color: "var(--ink-faint)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "1.25rem",
            }}
          >
            <span>
              Published{" "}
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {isUpdated && (
              <>
                <span>•</span>
                <span>
                  Updated{" "}
                  {new Date(article.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </>
            )}
          </div>

          {article.excerpt && (
            <p
              style={{
                fontFamily: "var(--f-body)",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "var(--ink-faint)",
                fontStyle: "italic",
              }}
            >
              {article.excerpt}
            </p>
          )}
        </header>

        <Rule style={{ marginBottom: "2.5rem" }} />

        {/* Main Article Body (max-w-2xl / max-w-prose ~ 65ch) */}
        <div
          className="prose prose-slate dark:prose-invert max-w-2xl max-w-prose leading-relaxed"
          style={{
            minWidth: 0,
            maxWidth: "68ch",
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {article.body.replace(/!\[(.*?)\]\((.*?)\s+align=".*?"\)/g, '![$1]($2)')}
          </ReactMarkdown>
        </div>

        {/* Floating Table of Contents Sidebar (Outside article content area) */}
        {tocItems.length > 0 && (
          <aside
            style={{
              position: "fixed",
              top: "140px",
              left: isWide ? "calc(50% + 620px)" : "calc(50% + 430px)",
              width: "220px",
              maxHeight: "calc(100vh - 180px)",
              overflowY: "auto",
              background: "var(--canvas-card)",
              border: "1px solid var(--rule)",
              borderRadius: "8px",
              padding: "0.85rem 1rem",
              zIndex: 10,
              transition: "left 0.3s ease",
            }}
            className="hidden xl:block"
          >
            <div
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.62rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--ink-faint)",
                marginBottom: "0.75rem",
              }}
            >
              Table of Contents
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {tocItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(item.id);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                        setActiveId(item.id);
                      }
                    }}
                    style={{
                      fontFamily: "var(--f-mono)",
                      fontSize: "0.65rem",
                      lineHeight: "1.4",
                      textDecoration: "none",
                      color: isActive ? "var(--accent-link)" : "var(--ink-soft)",
                      fontWeight: isActive ? 600 : 400,
                      borderLeft: isActive ? "2px solid var(--accent-link)" : "2px solid transparent",
                      marginLeft: isActive ? "-0.5rem" : "0",
                      paddingLeft: isActive
                        ? item.level === 3 ? "0.75rem" : "0.35rem"
                        : item.level === 3 ? "0.75rem" : "0",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {item.text}
                  </a>
                );
              })}
            </nav>
          </aside>
        )}

        <Rule style={{ margin: "3rem 0 2rem" }} />

        {/* Author Card */}
        <AuthorCard />

        {/* Read Next Recommendations */}
        <ReadNext articles={readNextArticles} />

        {/* Comments Section */}
        <div style={{ marginTop: "3rem", marginBottom: "3rem" }}>
          {commentsComponent || (
            <GiscusClient
              id="comments"
              repo="novitaguok/novita-s-journal"
              repoId="R_kgDOMP_xxx"
              category="Announcements"
              categoryId="DIC_kwDOMP_xxx"
              mapping="pathname"
              term="Welcome to @giscus/react component!"
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="top"
              theme="light"
              lang="en"
              loading="lazy"
            />
          )}
        </div>

        {/* Footer meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <Link
            href="/articles"
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.68rem",
              color: "var(--ink-faint)",
              textDecoration: "none",
            }}
          >
            ← back to all articles
          </Link>
        </div>
      </ArticleLayoutWrapper>
    </article>
  );
}

export default BlogPost;
