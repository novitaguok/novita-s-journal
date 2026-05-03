"use client";
import { useState } from "react";
import { Project } from "../../types";
import { STATUS_META } from "../../lib/data";
import { CodeBlock } from "@/src/components/Shared";

export default function MiniRepoCard({ project: p }: { project: Project }) {
  const [hov, setHov] = useState(false);
  const sm = STATUS_META[p.status];

  return (
    <div
      onClick={() => window.open(`https://github.com/${p.repo}`, "_blank")}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "var(--canvas-hover)" : "var(--canvas-card)",
        border: "1px solid var(--rule)",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "all 0.2s ease",
        boxShadow: hov ? "0 6px 24px rgba(0,0,0,0.06)" : "none",
        transform: hov ? "translateY(-2px)" : "none",
        cursor: "pointer",
      }}
    >
      <CodeBlock
        code={p.snippet}
        lang={p.lang.toLowerCase()}
        compact
        style={{
          borderRadius: 0,
          border: "none",
          borderBottom: "1px solid var(--rule)",
        }}
      />
      <div style={{ padding: "0.85rem 1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginBottom: "0.3rem",
          }}
        >
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="var(--ink-faint)"
          >
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
          </svg>
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.72rem",
              color: "var(--accent-link)",
              fontWeight: 600,
            }}
          >
            {p.repo}
          </span>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: sm.color,
              }}
            />
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.55rem",
                color: "var(--ink-faint)",
              }}
            >
              {sm.label}
            </span>
          </div>
        </div>
        <p
          style={{
            fontFamily: "var(--f-body)",
            fontSize: "0.78rem",
            color: "var(--ink-soft)",
            lineHeight: 1.45,
            marginBottom: "0.6rem",
          }}
        >
          {p.desc}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: p.langColor,
              }}
            />
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.58rem",
                color: "var(--ink-faint)",
              }}
            >
              {p.lang}
            </span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            <span style={{ fontSize: "0.65rem" }}>⭐</span>
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.58rem",
                color: "var(--ink-faint)",
              }}
            >
              {p.stars.toLocaleString()}
            </span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            <span style={{ fontSize: "0.65rem" }}>🍴</span>
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.58rem",
                color: "var(--ink-faint)",
              }}
            >
              {p.forks}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
