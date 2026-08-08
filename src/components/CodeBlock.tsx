"use client";

import React, { useState } from "react";

export interface CodeBlockProps {
  code: string;
  lang?: string;
  blockType?: "json" | "code" | "terminal" | "commands" | "object";
  filename?: string;
  style?: React.CSSProperties;
  compact?: boolean;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  lang = "ts",
  blockType = "code",
  filename,
  style = {},
  compact = false,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang = (lang || blockType || "code").toUpperCase();

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
        position: "relative",
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
      {/* Window header bar */}
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
          {/* Window control dots */}
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

          {/* Language badge in top window bar */}
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.55rem",
              fontWeight: 700,
              padding: "0.1rem 0.4rem",
              borderRadius: "4px",
              background: "rgba(59, 130, 246, 0.12)",
              color: "var(--accent-link)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              letterSpacing: "0.05em",
              marginLeft: "4px",
            }}
          >
            {displayLang}
          </span>

          {filename && (
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.62rem",
                color: "var(--ink-soft)",
                fontWeight: 600,
                marginLeft: "4px",
              }}
            >
              {filename}
            </span>
          )}
        </div>
      </div>

      {/* Absolute top-right Copy to Clipboard button */}
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: "0.35rem",
          right: "0.5rem",
          zIndex: 10,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          fontFamily: "var(--f-mono)",
          fontSize: "0.58rem",
          color: copied ? "#34d399" : "var(--ink-faint)",
          background: "var(--canvas-card)",
          border: copied
            ? "1px solid rgba(52, 211, 153, 0.4)"
            : "1px solid var(--rule)",
          borderRadius: "4px",
          padding: "0.2rem 0.5rem",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
        title={copied ? "Copied!" : "Copy to clipboard"}
      >
        {copied ? (
          <>
            <svg
              viewBox="0 0 16 16"
              width="11"
              height="11"
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 8 7 12 13 4" />
            </svg>
            <span>Copied!</span>
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 16 16"
              width="11"
              height="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="5" width="8" height="8" rx="1.5" />
              <path d="M3 11V4a1.5 1.5 0 0 1 1.5-1.5H10" />
            </svg>
            <span>Copy</span>
          </>
        )}
      </button>

      {/* Code container with horizontal scroll and gradient mask */}
      <div
        style={{
          padding: compact ? "0.5rem 0.75rem" : "0.75rem 1rem",
          overflowX: "auto",
          WebkitMaskImage:
            "linear-gradient(to right, black 85%, transparent 100%)",
          maskImage: "linear-gradient(to right, black 85%, transparent 100%)",
        }}
      >
        {lines.map(({ tokens, li, raw }) => {
          const isPrompt = isTerminalMode && raw.trim().startsWith("$");
          return (
            <div key={li} style={{ display: "flex", whiteSpace: "pre" }}>
              {showLineNumbers && (
                <span
                  style={{
                    color: isPrompt ? "#34d399" : "var(--ink-faint)",
                    minWidth: "1.5rem",
                    marginRight: "0.75rem",
                    opacity: isPrompt ? 0.9 : 0.35,
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    fontSize: "0.6rem",
                    paddingTop: "1px",
                    fontWeight: isPrompt ? 700 : 400,
                  }}
                >
                  {isTerminalMode ? (isPrompt ? "$" : ">") : li + 1}
                </span>
              )}
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

export default CodeBlock;
