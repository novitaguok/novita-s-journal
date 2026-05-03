"use client";
import { Section } from "../types";

export default function Footer() {
  return (
    <footer
      style={{ borderTop: "1px solid var(--rule)", padding: "2rem 2.5rem" }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              background: "var(--ink)",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--f-mono)",
              fontSize: "0.6rem",
              color: "var(--canvas)",
              fontWeight: 700,
            }}
          >
            n
          </div>
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.65rem",
              color: "var(--ink-faint)",
            }}
          >
            novita.dev
          </span>
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.65rem",
              color: "var(--ink-faint)",
              opacity: 0.5,
            }}
          >
            ·
          </span>
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.65rem",
              color: "var(--ink-faint)",
            }}
          >
            built with React + Fira Code ♥
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--f-hand)",
            fontSize: "0.78rem",
            color: "var(--annotation)",
          }}
        >
          made with too much tea 🍵
        </span>
      </div>
    </footer>
  );
}
