"use client";

import { useTheme } from "./ThemeProvider";
import { TableOfContentsEntry } from "./useTableOfContents";

export function TableOfContents({
  entries,
  activeId,
  onNavigate,
}: {
  entries: TableOfContentsEntry[];
  activeId: string;
  onNavigate: (targetId: string) => void;
}) {
  const { isWide } = useTheme();

  return (
    <aside
      className="hidden xl:block"
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
        {entries.map((entry) => {
          const isActive = activeId === entry.targetId;
          const indented = entry.level === 3;
          return (
            <a
              key={entry.id}
              href={`#${entry.targetId}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(entry.targetId);
              }}
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.65rem",
                lineHeight: "1.4",
                textDecoration: "none",
                color: isActive ? "var(--accent-link)" : "var(--ink-soft)",
                fontWeight: isActive ? 600 : 400,
                borderLeft: isActive
                  ? "2px solid var(--accent-link)"
                  : "2px solid transparent",
                marginLeft: isActive ? "-0.5rem" : "0",
                paddingLeft: indented ? "0.75rem" : isActive ? "0.35rem" : "0",
                transition: "all 0.15s ease",
              }}
            >
              {entry.text}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
