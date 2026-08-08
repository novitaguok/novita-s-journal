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
  blockType = "code",
  filename,
  style = {},
  compact = false,
}: {
  code: string;
  lang?: string;
  blockType?: "json" | "code" | "terminal" | "commands" | "object";
  filename?: string;
  style?: React.CSSProperties;
  compact?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  const blockTypeMeta: Record<
    string,
    { label: string; bg: string; color: string; border: string; defaultFilename: string }
  > = {
    json: {
      label: "JSON",
      bg: "rgba(16, 185, 129, 0.12)",
      color: "#34d399",
      border: "rgba(16, 185, 129, 0.25)",
      defaultFilename: "manifest.json",
    },
    code: {
      label: "CODE",
      bg: "rgba(59, 130, 246, 0.12)",
      color: "#60a5fa",
      border: "rgba(59, 130, 246, 0.25)",
      defaultFilename: "main.ts",
    },
    terminal: {
      label: "TERMINAL",
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#fbbf24",
      border: "rgba(245, 158, 11, 0.25)",
      defaultFilename: "zsh — 80x24",
    },
    commands: {
      label: "COMMANDS",
      bg: "rgba(168, 85, 247, 0.12)",
      color: "#c084fc",
      border: "rgba(168, 85, 247, 0.25)",
      defaultFilename: "quickstart.sh",
    },
    object: {
      label: "OBJECT",
      bg: "rgba(244, 63, 94, 0.12)",
      color: "#fb7185",
      border: "rgba(244, 63, 94, 0.25)",
      defaultFilename: "instance.py",
    },
  };

  const meta = blockTypeMeta[blockType] || blockTypeMeta.code;
  const displayFilename = filename || meta.defaultFilename;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tokenize = (src: string) =>
    src.split("\n").map((line, li) => {
      const tokens: { text: string; type: string }[] = [];
      let rest = line;
      const push = (text: string, type: string) => tokens.push({ text, type });
      const patterns: [RegExp, string][] = [
        [/^(\/\/[^\n]*|#[^\n]*)/, "comment"],
        [/^(\/\*[\s\S]*?\*\/)/, "comment"],
        [/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/, "string"],
        [
          /^(const|let|var|fn|function|return|pub|Vec|for|if|else|where|import|from|export|default|type|interface|async|await|=>|new|null|undefined|true|false|void|use|mod|impl|struct|enum|match|Some|None|Ok|Err|it|expect|describe|render|package|func|def|self)\b/,
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
      return { tokens, li, raw: line };
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

  const isTerminalMode = blockType === "terminal" || blockType === "commands";
  const lines = tokenize(code);

  return (
    <div
      style={{
        background: "var(--canvas-code)",
        border: "1px solid var(--rule)",
        borderRadius: "8px",
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
          padding: "0.4rem 0.75rem",
          borderBottom: "1px solid var(--rule)",
          background: "rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", gap: "5px" }}>
            {["#fc5753", "#fdbc40", "#33c748"].map((c) => (
              <div
                key={c}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: c,
                  opacity: 0.75,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.65rem",
              color: "var(--ink-soft)",
              fontWeight: 600,
              marginLeft: "4px",
            }}
          >
            {displayFilename}
          </span>
        </div>


      </div>

      <div
        style={{
          padding: compact ? "0.5rem 0.75rem" : "0.75rem 1rem",
          overflowX: "auto",
        }}
      >
        {lines.map(({ tokens, li, raw }) => {
          const isPrompt = isTerminalMode && raw.trim().startsWith("$");
          return (
            <div key={li} style={{ display: "flex" }}>
              <span
                style={{
                  color: isPrompt ? "#34d399" : "var(--ink-faint)",
                  minWidth: "1.5rem",
                  marginRight: "0.75rem",
                  opacity: isPrompt ? 0.9 : 0.35,
                  userSelect: "none",
                  fontSize: "0.6rem",
                  paddingTop: "1px",
                  fontWeight: isPrompt ? 700 : 400,
                }}
              >
                {isTerminalMode ? (isPrompt ? "$" : ">") : li + 1}
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
          );
        })}
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
      {tag === "design" ? "Design" : tag === "essay" ? "Essay" : tag}
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
