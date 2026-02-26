"use client";
import { Project } from "@/src/types";
import { useState } from "react";
import FeaturedRepoCard from "./FeaturedRepoCard";
import MiniRepoCard from "./MiniRepoCard";
import { STATUS_META } from "@/src/lib/data";
import { Rule } from "@/src/components/Shared";

const FILTERS = ["all", "active", "stable", "archived"] as const;
type Filter = (typeof FILTERS)[number];

const LANGUAGE_BREAKDOWN = [
  { lang: "TypeScript", pct: 65, color: "#3178c6" },
  { lang: "Rust", pct: 20, color: "#dea584" },
  { lang: "CSS", pct: 10, color: "#563d7c" },
  { lang: "Other", pct: 5, color: "var(--rule-dark)" },
];

const pageWrapper: React.CSSProperties = {
  paddingTop: "52px",
  minHeight: "100vh",
};

const container: React.CSSProperties = {
  maxWidth: "1280px",
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

const filterGroup: React.CSSProperties = {
  display: "flex",
  gap: "0.35rem",
  marginBottom: "2rem",
};

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.6rem",
  color: "var(--ink-faint)",
  marginBottom: "0.75rem",
};

const twoColGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1.25rem",
  marginBottom: "2rem",
};

const miniGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "1rem",
};

const langLegend: React.CSSProperties = {
  display: "flex",
  gap: "0.75rem",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "0.5rem",
};

const langBar: React.CSSProperties = {
  display: "flex",
  height: "8px",
  borderRadius: "4px",
  overflow: "hidden",
  gap: "1px",
};

const monoSmall: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.62rem",
  color: "var(--ink-faint)",
};

function filterButtonStyle(isActive: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--f-mono)",
    fontSize: "0.65rem",
    fontWeight: 600,
    padding: "0.35rem 0.75rem",
    borderRadius: "5px",
    border: "1px solid var(--rule)",
    background: isActive ? "var(--ink)" : "transparent",
    color: isActive ? "var(--canvas)" : "var(--ink-faint)",
    cursor: "pointer",
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
  };
}

function langBarSegmentRadius(index: number, total: number): string {
  if (index === 0) return "4px 0 0 4px";
  if (index === total - 1) return "0 4px 4px 0";
  return "0";
}

export default function ProjectList({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const visible =
    filter === "all"
      ? projects
      : projects.filter((project) => project.status === filter);
  const pinned = visible.filter((project) => project.isPinned);
  const rest = visible.filter((project) => !project.isPinned);

  const totalStars = projects
    .reduce((sum, project) => sum + project.stars, 0)
    .toLocaleString();

  return (
    <div style={pageWrapper}>
      <div style={container}>
        {/* Header */}
        <div style={headerRow}>
          <h2 style={heading}>work/</h2>
          <span style={headingAnnotation}>
            {projects.length} repos, {totalStars} total stars
          </span>
        </div>
        <Rule style={{ marginBottom: "1.5rem" }} />

        {/* Status filters */}
        <div style={filterGroup}>
          {FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={filterButtonStyle(filter === status)}
            >
              {status !== "all" && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: STATUS_META[status]?.color || "#8b949e",
                  }}
                />
              )}
              {status}
            </button>
          ))}
        </div>

        {/* Pinned — featured cards */}
        {pinned.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                ...sectionLabel,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span>📌</span> Pinned Repositories
            </div>
            <div style={twoColGrid}>
              {pinned.map((project) => (
                <FeaturedRepoCard
                  key={project.id}
                  project={project}
                  expanded={expandedId === project.id}
                  onToggle={() =>
                    setExpandedId(expandedId === project.id ? null : project.id)
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Other repositories */}
        {rest.length > 0 && (
          <div>
            <div style={sectionLabel}>other repositories</div>
            <div style={miniGrid}>
              {rest.map((project) => (
                <MiniRepoCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Language breakdown chart */}
        <div style={{ marginTop: "3rem" }}>
          <Rule label="language breakdown" style={{ marginBottom: "1rem" }} />

          <div style={langLegend}>
            {LANGUAGE_BREAKDOWN.map((item) => (
              <div
                key={item.lang}
                style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: item.color,
                  }}
                />
                <span style={monoSmall}>
                  {item.lang} {item.pct}%
                </span>
              </div>
            ))}
          </div>

          <div style={langBar}>
            {LANGUAGE_BREAKDOWN.map((item, index) => (
              <div
                key={item.lang}
                style={{
                  width: `${item.pct}%`,
                  background: item.color,
                  borderRadius: langBarSegmentRadius(
                    index,
                    LANGUAGE_BREAKDOWN.length,
                  ),
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
