"use client";

import { useState, useEffect } from "react";
import { ARTICLES, PROJECTS, TAG_COLORS } from "../lib/data";
import { CodeBlock, WashBlob, Annotation, Rule } from "../components/ui/Shared";
import MiniRepoCard from "../components/projects/MiniRepoCard";
import { Section } from "../types";
import { GitHubCalendar } from "react-github-calendar";

const GREETING = `// Hey there, I'm Novita 👋
// I write code and occasionally ship things
// that (I hope) make people's lives a bit better.

const me = {
\u00A0\u00A0role: "Android Engineer",
\u00A0\u00A0years: 4,
\u00A0\u00A0location: "Jakarta, Indonesia",
};`;

const GREETING_LINES = GREETING.split("\n");

const ACTIVITY_FEED = [
  {
    icon: "📝",
    action: "published",
    target:
      "Bonferroni Mean Fuzzy K-Nearest Neighbors Based Handwritten Chinese Character Recognition",
    time: "5y ago",
    link: "https://ieeexplore.ieee.org/document/9617488",
  },
  {
    icon: "🌀",
    action: "wip",
    target: "Cinlok",
    time: "3mo ago",
    link: "https://cinlok.id/",
  },
  {
    icon: "🌀",
    action: "wip",
    target: "Shelter-It",
    time: "3mo ago",
    link: "",
  },
];

const pageWrapper: React.CSSProperties = {
  paddingTop: "52px",
  minHeight: "100vh",
};

const container: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "3.5rem 2.5rem",
};

const heroGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "3.5rem",
  alignItems: "start",
  marginBottom: "4rem",
};

const heroLeft: React.CSSProperties = {
  position: "relative",
};

const buttonGroup: React.CSSProperties = {
  display: "flex",
  gap: "0.75rem",
  flexWrap: "wrap",
  marginBottom: "1.5rem",
};

const activityDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#3fb950",
};

const activityHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: ".5rem",
};

const activityTitle: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.65rem",
  color: "var(--ink-soft)",
  fontWeight: 600,
};

const feedRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.55rem 0",
  borderBottom: "1px solid var(--rule)",
};

const feedAction: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.67rem",
  color: "var(--ink-faint)",
};

const feedTarget: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.67rem",
  color: "var(--accent-link)",
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "underline",
};

const feedTime: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.58rem",
  color: "var(--ink-faint)",
  flexShrink: 0,
};

const heatmapGrid: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  display: "flex",
  gap: "2px",
  flexWrap: "wrap",
};

const sectionHeading: React.CSSProperties = {
  fontFamily: "var(--f-display)",
  fontSize: "1.4rem",
  fontWeight: 700,
  color: "var(--ink)",
  letterSpacing: "-0.02em",
};

const sectionAnnotation: React.CSSProperties = {
  fontFamily: "var(--f-hand)",
  fontSize: "0.8rem",
  color: "var(--annotation)",
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  marginBottom: "0.25rem",
};

const sectionHeaderLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: "0.75rem",
};

const viewAllLink: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.62rem",
  color: "var(--accent-link)",
  background: "none",
  border: "none",
  cursor: "pointer",
};

const pinnedGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem",
};

const articleList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

const articleCardBase: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  gap: "1rem",
  padding: "0.85rem 1rem",
  background: "var(--canvas-card)",
  border: "1px solid var(--rule)",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const articleCardLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
};

const articleCardRight: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  flexShrink: 0,
};

const articleTitle: React.CSSProperties = {
  fontFamily: "var(--f-display)",
  fontSize: "0.92rem",
  fontWeight: 600,
  color: "var(--ink)",
  letterSpacing: "-0.01em",
};

const monoSmall: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.58rem",
  color: "var(--ink-faint)",
};

function heroButtonStyle(
  variant: "primary" | "secondary" | "ghost",
): React.CSSProperties {
  const base: React.CSSProperties = {
    fontFamily: "var(--f-mono)",
    fontSize: "0.7rem",
    fontWeight: 600,
    padding: "0.55rem 1.15rem",
    borderRadius: "6px",
    cursor: "pointer",
  };

  switch (variant) {
    case "primary":
      return {
        ...base,
        background: "var(--ink)",
        color: "var(--canvas)",
        border: "none",
      };
    case "secondary":
      return {
        ...base,
        background: "transparent",
        color: "var(--ink)",
        border: "1px solid var(--rule-dark)",
      };
    case "ghost":
      return {
        ...base,
        fontWeight: 500,
        background: "transparent",
        color: "var(--ink-faint)",
        border: "1px solid var(--rule)",
      };
  }
}

function tagBadge(bg: string, text: string): React.CSSProperties {
  return {
    fontFamily: "var(--f-mono)",
    fontSize: "0.6rem",
    fontWeight: 600,
    padding: "0.15rem 0.4rem",
    borderRadius: "4px",
    background: bg,
    color: text,
    flexShrink: 0,
  };
}

function heatmapColor(value: number): string {
  if (value > 0.88) return "#1a7f37";
  if (value > 0.68) return "#2ea043";
  if (value > 0.45) return "#56d364";
  if (value > 0.25) return "#aff5b4";
  return "var(--rule)";
}

export default function Home({
  setActive,
}: {
  setActive: (s: Section) => void;
}) {
  const [lineIdx, setLineIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLineIdx((idx) => {
        if (idx >= GREETING_LINES.length - 1) {
          clearInterval(timer);
          return idx;
        }
        return idx + 1;
      });
    }, 75);
    return () => clearInterval(timer);
  }, []);

  const pinnedProjects = PROJECTS.filter((project) => project.pinned);
  const recentArticles = ARTICLES.slice(0, 3);

  return (
    <div style={pageWrapper}>
      <div style={container}>
        {/* Hero row */}
        <div style={heroGrid}>
          <div style={heroLeft}>
            <WashBlob
              color="#3178c6"
              style={{
                top: "-80px",
                left: "-100px",
                width: "280px",
                height: "280px",
              }}
            />
            <WashBlob
              color="#c96f72"
              style={{
                bottom: "-60px",
                right: "-60px",
                width: "200px",
                height: "200px",
              }}
            />

            <CodeBlock
              code={GREETING_LINES.slice(0, lineIdx + 1).join("\n")}
              lang="ts"
              style={{
                position: "relative",
                zIndex: 1,
                marginBottom: "1.5rem",
              }}
            />

            <div style={buttonGroup}>
              <button
                onClick={() => setActive("projects")}
                style={heroButtonStyle("primary")}
              >
                $ cd work/
              </button>
              <button
                onClick={() => setActive("articles")}
                style={heroButtonStyle("secondary")}
              >
                $ cat writing/
              </button>
              <button
                onClick={() => setActive("about")}
                style={heroButtonStyle("ghost")}
              >
                about.md
              </button>
            </div>

            <Annotation text="built 4 things this year, learned way more than I shipped" />
          </div>

          {/* Activity feed */}
          <div>
            <div style={activityHeader}>
              <div style={activityDot} />
              <span style={activityTitle}>Recent Activity</span>
            </div>

            {ACTIVITY_FEED.map((event, index) => (
              <div key={index} style={feedRow}>
                <span style={{ fontSize: "0.78rem", flexShrink: 0 }}>
                  {event.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={feedAction}>{event.action} </span>
                  <span
                    onClick={
                      event.link
                        ? () => window.open(event.link, "_blank")
                        : undefined
                    }
                    style={feedTarget}
                  >
                    {event.target}
                  </span>
                </div>
                <span style={feedTime}>{event.time}</span>
              </div>
            ))}

            {/* Heatmap */}
            {mounted && (
              <div style={{ marginTop: "1.25rem" }}>
                <div style={heatmapGrid}>
                  <GitHubCalendar
                    username="novitaguok"
                    fontSize={12}
                    blockSize={8}
                    blockMargin={3}
                    colorScheme="light"
                    theme={{
                      light: [
                        "var(--rule)",
                        "#aff5b4",
                        "#56d364",
                        "#2ea043",
                        "#1a7f37",
                      ],
                      dark: [
                        "var(--rule)",
                        "#0e4429",
                        "#006d32",
                        "#26a641",
                        "#39d353",
                      ],
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pinned projects */}
        <div style={{ marginBottom: "4rem" }}>
          <div style={sectionHeader}>
            <div style={sectionHeaderLeft}>
              <h2 style={sectionHeading}>📌 Pinned</h2>
              <span style={sectionAnnotation}>things I'm proud of</span>
            </div>
            <button onClick={() => setActive("projects")} style={viewAllLink}>
              view all repos →
            </button>
          </div>
          <Rule style={{ marginBottom: "1.5rem" }} />
          <div style={pinnedGrid}>
            {pinnedProjects.map((project) => (
              <MiniRepoCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Recent writing */}
        <div>
          <div style={sectionHeader}>
            <div style={sectionHeaderLeft}>
              <h2 style={sectionHeading}>✍️ Recent Writing</h2>
              <span style={sectionAnnotation}>thinking out loud</span>
            </div>
            <button onClick={() => setActive("articles")} style={viewAllLink}>
              all articles →
            </button>
          </div>
          <Rule style={{ marginBottom: "1.5rem" }} />

          <div style={articleList}>
            {recentArticles.map((article) => {
              const tagColor = TAG_COLORS[article.tag];
              return (
                <div
                  key={article.id}
                  onClick={() => setActive("articles")}
                  style={articleCardBase}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--rule-dark)";
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--canvas-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--rule)";
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--canvas-card)";
                  }}
                >
                  <div style={articleCardLeft}>
                    <span style={tagBadge(tagColor.bg, tagColor.text)}>
                      {article.tag}
                    </span>
                    <span style={articleTitle}>{article.title}</span>
                  </div>
                  <div style={articleCardRight}>
                    <span style={monoSmall}>{article.date}</span>
                    <span style={monoSmall}>{article.readTime}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
