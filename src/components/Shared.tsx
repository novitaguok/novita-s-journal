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

export function CodeBlock({
  code,
  lang = "ts",
  style = {},
  compact = false,
}: {
  code: string;
  lang?: string;
  style?: React.CSSProperties;
  compact?: boolean;
}) {
  const tokenize = (src: string) =>
    src.split("\n").map((line, li) => {
      const tokens: { text: string; type: string }[] = [];
      let rest = line;
      const push = (text: string, type: string) => tokens.push({ text, type });
      const patterns: [RegExp, string][] = [
        [/^(\/\/[^\n]*)/, "comment"],
        [/^(\/\*[\s\S]*?\*\/)/, "comment"],
        [/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/, "string"],
        [
          /^(const|let|var|fn|function|return|pub|Vec|for|if|else|where|import|from|export|default|type|interface|async|await|=>|new|null|undefined|true|false|void|use|mod|impl|struct|enum|match|Some|None|Ok|Err|it|expect|describe|render)\b/,
          "kw",
        ],
        [/^(\b\d+(\.\d+)?\b)/, "num"],
        [/^([A-Z][a-zA-Z0-9_$]*)/, "type"],
        [/^([a-zA-Z_$][\w$]*)/, "ident"],
        [/^([^\w\s"'`\/]+|[\/])/, "punc"],
        [/^(\s+)/, "space"],
      ];
      while (rest.length > 0) {
        let matched = false;
        for (const [re, type] of patterns) {
          const m = rest.match(re);
          if (m) {
            push(m[1], type);
            rest = rest.slice(m[1].length);
            matched = true;
            break;
          }
        }
        if (!matched) {
          push(rest[0], "plain");
          rest = rest.slice(1);
        }
      }
      return { tokens, li };
    });

  const colors: Record<string, string> = {
    kw: "var(--tok-kw)",
    string: "var(--tok-str)",
    comment: "var(--tok-comment)",
    num: "var(--tok-num)",
    type: "var(--tok-type)",
    ident: "var(--tok-ident)",
    punc: "var(--ink-soft)",
    space: "transparent",
    plain: "var(--ink-soft)",
  };

  const lines = tokenize(code);
  return (
    <div
      style={{
        background: "var(--canvas-code)",
        border: "1px solid var(--rule)",
        borderRadius: "6px",
        overflow: "hidden",
        fontFamily: "var(--f-mono)",
        fontSize: compact ? "0.65rem" : "0.72rem",
        lineHeight: 1.65,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.35rem 0.75rem",
          borderBottom: "1px solid var(--rule)",
          background: "rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ display: "flex", gap: "5px" }}>
          {["#fc5753", "#fdbc40", "#33c748"].map((c) => (
            <div
              key={c}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: c,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: "0.58rem",
            color: "var(--ink-faint)",
            letterSpacing: "0.06em",
          }}
        >
          {lang}
        </span>
      </div>
      <div
        style={{
          padding: compact ? "0.5rem 0.75rem" : "0.75rem 1rem",
          overflowX: "auto",
        }}
      >
        {lines.map(({ tokens, li }) => (
          <div key={li} style={{ display: "flex" }}>
            <span
              style={{
                color: "var(--ink-faint)",
                minWidth: "1.5rem",
                marginRight: "0.75rem",
                opacity: 0.35,
                userSelect: "none",
                fontSize: "0.58rem",
                paddingTop: "1px",
              }}
            >
              {li + 1}
            </span>
            <span>
              {tokens.map((tok, ti) => (
                <span
                  key={ti}
                  style={{ color: colors[tok.type] || "var(--ink-soft)" }}
                >
                  {tok.text}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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

export function TagBadge({ tag }: { tag: string }) {
  const c = TAG_COLORS[tag] ?? {
    bg: "var(--canvas-tag)",
    text: "var(--ink-faint)",
  };
  return (
    <span
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
      {tag}
    </span>
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
        background: "var(--canvas-card)",
        borderRadius: 4,
        animation: "pulse 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
}
