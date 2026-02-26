"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

function Switch({ checked }: { checked: boolean }) {
  return (
    <div
      style={{
        width: "24px",
        height: "14px",
        background: checked ? "var(--ink)" : "var(--rule-dark)",
        borderRadius: "10px",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
          background: "var(--canvas)",
          borderRadius: "50%",
          position: "absolute",
          top: "2px",
          left: checked ? "12px" : "2px",
          transition: "left 0.2s",
        }}
      />
    </div>
  );
}

function SettingsMenu({
  dark,
  toggleDark,
  isWide,
  toggleWide,
  showWideToggle,
}: {
  dark: boolean;
  toggleDark: () => void;
  isWide: boolean;
  toggleWide: () => void;
  showWideToggle: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buttonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    padding: "0.5rem",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    fontFamily: "var(--f-mono)",
    fontSize: "0.65rem",
    color: "var(--ink)",
    transition: "background 0.2s",
    borderRadius: "4px",
  };

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Settings"
        style={{
          background: isOpen ? "var(--canvas-hover)" : "var(--canvas-card)",
          border: "1px solid var(--rule)",
          borderRadius: "6px",
          padding: "0.3rem 0.4rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            right: 0,
            background: "var(--canvas-card)",
            border: "1px solid var(--rule)",
            borderRadius: "8px",
            padding: "0.4rem",
            minWidth: "140px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
          }}
        >
          <button
            onClick={toggleDark}
            style={buttonStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "var(--canvas-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.85rem" }}>{dark ? "☀️" : "🌙"}</span>
              dark mode
            </div>
            <Switch checked={dark} />
          </button>

          {showWideToggle && (
            <button
              onClick={toggleWide}
              style={buttonStyle}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "var(--canvas-hover)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem" }}>
                  {isWide ? "⇥⇤" : "⇤⇥"}
                </span>
                wide view
              </div>
              <Switch checked={isWide} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Nav({
  dark,
  toggleDark,
  isWide,
  toggleWide,
}: {
  dark: boolean;
  toggleDark: () => void;
  isWide: boolean;
  toggleWide: () => void;
}) {
  const pathname = usePathname() || "/";
  const items: { href: string; label: string }[] = [
    { href: "/", label: "~/" },
    { href: "/articles", label: "writing/" },
    { href: "/projects", label: "work/" },
    { href: "/about", label: "readme" },
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
        {items.map((item, i) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              href={item.href}
              key={item.href}
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.72rem",
                color: isActive ? "var(--ink)" : "var(--ink-faint)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.3rem 0.5rem",
                fontWeight: isActive ? 700 : 400,
                transition: "color 0.2s",
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
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
                  borderBottom: isActive
                    ? "1.5px solid var(--ink)"
                    : "none",
                  paddingBottom: "1px",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
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
        <SettingsMenu
          dark={dark}
          toggleDark={toggleDark}
          isWide={isWide}
          toggleWide={toggleWide}
          showWideToggle={pathname.startsWith("/articles/")}
        />
      </div>
    </nav>
  );
}
