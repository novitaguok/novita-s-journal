"use client";

import React from "react";

export function AuthorCard() {
  return (
    <div
      style={{
        background: "var(--canvas-card)",
        border: "1px solid var(--rule)",
        borderRadius: "12px",
        padding: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1.25rem",
        margin: "2.5rem 0",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "var(--ink)",
          color: "var(--canvas)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--f-mono)",
          fontSize: "1.25rem",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        N
      </div>

      <div style={{ flex: 1 }}>
        <h4
          style={{
            fontFamily: "var(--f-display)",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "0.25rem",
          }}
        >
          Novita
        </h4>
        <p
          style={{
            fontFamily: "var(--f-body)",
            fontSize: "0.85rem",
            color: "var(--ink-soft)",
            lineHeight: 1.5,
            marginBottom: "0.75rem",
          }}
        >
          Software Engineer & AI enthusiast turning complex systems into clean, joyful code. Writing about tech, design, and continuous learning.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontFamily: "var(--f-mono)",
            fontSize: "0.68rem",
          }}
        >
          <a
            href="https://github.com/novitaguok"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--ink-faint)", textDecoration: "none" }}
          >
            GitHub
          </a>
          <span style={{ color: "var(--rule-dark)" }}>•</span>
          <a
            href="https://linkedin.com/in/novitaguok"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--ink-faint)", textDecoration: "none" }}
          >
            LinkedIn
          </a>
          <span style={{ color: "var(--rule-dark)" }}>•</span>
          <a
            href="https://x.com/novitaguok"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--ink-faint)", textDecoration: "none" }}
          >
            X (Twitter)
          </a>
        </div>
      </div>
    </div>
  );
}
