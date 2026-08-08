"use client";

import React from "react";
import Link from "next/link";
import { ArticleListItem } from "@/src/domain/articles/types";
import { TagBadge } from "./Shared";

interface ReadNextProps {
  articles: ArticleListItem[];
}

export function ReadNext({ articles }: ReadNextProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div style={{ marginTop: "3rem", marginBottom: "2rem" }}>
      <h3
        style={{
          fontFamily: "var(--f-display)",
          fontSize: "1.2rem",
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: "1.25rem",
          letterSpacing: "-0.015em",
        }}
      >
        Read Next
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {articles.slice(0, 2).map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "var(--canvas-card)",
                border: "1px solid var(--rule)",
                borderRadius: "10px",
                padding: "1.25rem",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.15s ease, border-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--ink-soft)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--rule)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <TagBadge tag={article.tag} />
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: "0.58rem",
                    color: "var(--ink-faint)",
                    marginLeft: "auto",
                  }}
                >
                  {article.readTime} min read
                </span>
              </div>

              <h4
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "0.5rem",
                  lineHeight: 1.3,
                }}
              >
                {article.title}
              </h4>

              <p
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: "0.82rem",
                  color: "var(--ink-soft)",
                  lineHeight: 1.5,
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {article.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
