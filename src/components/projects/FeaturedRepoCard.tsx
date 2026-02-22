"use client";
import { useState } from "react";
import { Project } from "../../types";
import { STATUS_META } from "../../lib/data";
import { CodeBlock } from "../ui/Shared";

export default function FeaturedRepoCard({
  project: p,
  expanded,
  onToggle,
}: {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [hov, setHov] = useState(false);
  const sm = STATUS_META[p.status];
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "var(--canvas-hover)" : "var(--canvas-card)",
        border: "1px solid var(--rule)",
        borderRadius: "10px",
        overflow: "hidden",
        transition: "all 0.25s ease",
        boxShadow: hov
          ? "0 8px 32px rgba(0,0,0,0.07)"
          : "0 1px 4px rgba(0,0,0,0.03)",
        transform: hov ? "translateY(-3px)" : "none",
      }}
    >
      <CodeBlock
        code={p.snippet}
        lang={p.lang.toLowerCase()}
        style={{
          borderRadius: 0,
          border: "none",
          borderBottom: "1px solid var(--rule)",
        }}
      />
      <div style={{ padding: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                marginBottom: "0.25rem",
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
                  fontSize: "0.75rem",
                  color: "var(--accent-link)",
                  fontWeight: 600,
                }}
              >
                {p.repo}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: sm.color,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: "0.58rem",
                  color: "var(--ink-faint)",
                }}
              >
                {sm.label}
              </span>
              {p.demoUrl && (
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: "0.58rem",
                    color: "var(--accent-link)",
                    marginLeft: "0.5rem",
                  }}
                >
                  ↗ demo
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onToggle}
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.6rem",
              color: "var(--ink-faint)",
              background: "var(--canvas-code)",
              border: "1px solid var(--rule)",
              borderRadius: "4px",
              padding: "0.2rem 0.5rem",
              cursor: "pointer",
            }}
          >
            {expanded ? "less ↑" : "more ↓"}
          </button>
        </div>

        <p
          style={{
            fontFamily: "var(--f-body)",
            fontSize: "0.85rem",
            color: "var(--ink-soft)",
            lineHeight: 1.55,
            marginBottom: expanded ? "0.75rem" : "0.85rem",
          }}
        >
          {expanded ? p.longDesc : p.desc}
        </p>

        {expanded && (
          <div style={{ marginBottom: "0.85rem" }}>
            <div
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.6rem",
                color: "var(--ink-faint)",
                marginBottom: "0.4rem",
              }}
            >
              stack
            </div>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {p.stack.map((s) => (
                <span
                  key={s}
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: "0.6rem",
                    background: "var(--canvas-tag)",
                    border: "1px solid var(--rule)",
                    borderRadius: "4px",
                    padding: "0.15rem 0.4rem",
                    color: "var(--ink-faint)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

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
                fontSize: "0.6rem",
                color: "var(--ink-faint)",
              }}
            >
              {p.lang}
            </span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            <span style={{ fontSize: "0.7rem" }}>⭐</span>
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.6rem",
                color: "var(--ink-faint)",
              }}
            >
              {p.stars.toLocaleString()}
            </span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            <span style={{ fontSize: "0.7rem" }}>🍴</span>
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.6rem",
                color: "var(--ink-faint)",
              }}
            >
              {p.forks}
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.58rem",
              color: "var(--ink-faint)",
              marginLeft: "auto",
            }}
          >
            {p.year}
          </span>
        </div>
      </div>
    </div>
  );
}
