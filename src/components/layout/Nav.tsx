"use client";
import { Section } from "../../types";

function DarkToggle({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      title={dark ? "Switch to light" : "Switch to dark"}
      style={{
        background: "var(--canvas-card)",
        border: "1px solid var(--rule)",
        borderRadius: "6px",
        padding: "0.3rem 0.5rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: "0.85rem" }}>{dark ? "☀️" : "🌙"}</span>
      <span
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: "0.6rem",
          color: "var(--ink-faint)",
        }}
      >
        {dark ? "light" : "dark"}
      </span>
    </button>
  );
}

export default function Nav({
  active,
  setActive,
  dark,
  toggleDark,
}: {
  active: Section;
  setActive: (s: Section) => void;
  dark: boolean;
  toggleDark: () => void;
}) {
  const items: { id: Section; label: string }[] = [
    { id: "home", label: "~/" },
    { id: "articles", label: "writing/" },
    { id: "projects", label: "work/" },
    { id: "about", label: "readme" },
  ];
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "var(--nav-bg)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--rule)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.65rem 2.5rem",
        height: "52px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            background: "var(--ink)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--f-mono)",
            fontSize: "0.68rem",
            color: "var(--canvas)",
            fontWeight: 700,
          }}
        >
          n
        </div>
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: "0.75rem",
            color: "var(--ink-soft)",
          }}
        >
          novita.dev
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.72rem",
              color: active === item.id ? "var(--ink)" : "var(--ink-faint)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.3rem 0.5rem",
              fontWeight: active === item.id ? 700 : 400,
              transition: "color 0.2s",
              display: "flex",
              alignItems: "center",
            }}
          >
            {i > 0 && (
              <span
                style={{ color: "var(--rule-dark)", marginRight: "0.4rem" }}
              >
                /
              </span>
            )}
            <span
              style={{
                borderBottom:
                  active === item.id ? "1.5px solid var(--ink)" : "none",
                paddingBottom: "1px",
              }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#3fb950",
              boxShadow: "0 0 5px #3fb950",
            }}
          />
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.58rem",
              color: "var(--ink-faint)",
            }}
          >
            open to work
          </span>
        </div>
        <DarkToggle dark={dark} toggle={toggleDark} />
      </div>
    </nav>
  );
}
