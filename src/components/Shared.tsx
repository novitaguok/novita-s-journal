"use client";
import { TAG_COLORS } from "@/src/lib/data";
import React from "react";

export function Rule({
  label,
  style = {},
}: {
  label?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "1rem", ...style }}
    >
      <div style={{ flex: 1, height: "1px", background: "var(--rule)" }} />
      {label && (
        <span
          style={{
            fontFamily: "var(--f-hand)",
            fontSize: "0.75rem",
            color: "var(--ink-faint)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}
      {label && (
        <div style={{ flex: 1, height: "1px", background: "var(--rule)" }} />
      )}
    </div>
  );
}

export function Annotation({
  text,
  style = {},
}: {
  text: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontFamily: "var(--f-hand)",
        fontSize: "0.82rem",
        color: "var(--annotation)",
        lineHeight: 1.5,
        display: "flex",
        alignItems: "flex-start",
        gap: "4px",
        ...style,
      }}
    >
      <svg
        viewBox="0 0 12 20"
        style={{ width: 12, height: 20, flexShrink: 0, marginTop: 1 }}
      >
        <path
          d="M6,2 Q10,6 8,10 Q6,14 6,18"
          stroke="var(--annotation)"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M3,15 L6,18 L9,15"
          stroke="var(--annotation)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      {text}
    </div>
  );
}

export { CodeBlock } from "./CodeBlock";

export function WashBlob({
  color,
  style = {},
}: {
  color: string;
  style?: React.CSSProperties;
}) {
  const id = `blur${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg
      viewBox="0 0 200 200"
      style={{ position: "absolute", pointerEvents: "none", ...style }}
    >
      <defs>
        <filter id={id}>
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <ellipse
        cx="100"
        cy="100"
        rx="88"
        ry="72"
        fill={color}
        opacity="0.07"
        filter={`url(#${id})`}
      />
    </svg>
  );
}

export function TagBadge({ tag, tags }: { tag?: string; tags?: string[] }) {
  const list = tags && tags.length > 0 ? tags : tag ? [tag] : ["Software Engineering"];

  return (
    <div style={{ display: "inline-flex", gap: "0.3rem", flexWrap: "wrap" }}>
      {list.map((t) => {
        const c = TAG_COLORS[t] ?? {
          bg: "var(--canvas-tag)",
          text: "var(--ink-faint)",
        };
        return (
          <span
            key={t}
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.58rem",
              fontWeight: 600,
              padding: "0.15rem 0.4rem",
              borderRadius: 4,
              background: c.bg,
              color: c.text,
            }}
          >
            {t === "design" ? "Design" : t === "essay" ? "Essay" : t}
          </span>
        );
      })}
    </div>
  );
}

export function Skeleton({
  height = 20,
  width = "100%",
  style = {},
}: {
  height?: number;
  width?: number | string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        height,
        width,
        background:
          "linear-gradient(90deg, var(--canvas-card) 25%, var(--canvas-hover) 50%, var(--canvas-card) 75%)",
        backgroundSize: "200% 100%",
        borderRadius: 4,
        animation: "shimmer 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
}
