"use client";

import { useState } from "react";
import { Rule, Annotation, CodeBlock } from "../ui/Shared";
import { Section } from "../../types";

const SOCIAL_LINKS = [
  {
    icon: "🐙",
    label: "GitHub",
    handle: "@novitaguok",
    link: "https://github.com/novitaguok",
  },
  {
    icon: "✉️",
    label: "Email",
    handle: "novitaguok@gmail.com",
    link: "mailto:novitaguok@gmail.com",
  },
  {
    icon: "💼",
    label: "LinkedIn",
    handle: "in/novitaguok",
    link: "https://www.linkedin.com/in/novitaguok/",
  },
];

const section: React.CSSProperties = {
  borderTop: "1px solid var(--rule)",
  background: "var(--canvas-card)",
};

const container: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "4rem 2.5rem",
};

const headerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: "1rem",
  marginBottom: "0.25rem",
};

const heading: React.CSSProperties = {
  fontFamily: "var(--f-display)",
  fontSize: "1.8rem",
  fontWeight: 700,
  color: "var(--ink)",
  letterSpacing: "-0.02em",
};

const headingAnnotation: React.CSSProperties = {
  fontFamily: "var(--f-hand)",
  fontSize: "0.85rem",
  color: "var(--annotation)",
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "3rem",
  alignItems: "start",
};

const formColumn: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

const inputRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0.75rem",
};

const label: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.6rem",
  color: "var(--ink-faint)",
  display: "block",
  marginBottom: "0.3rem",
};

const inputBase: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.75rem",
  background: "var(--canvas-code)",
  border: "1px solid var(--rule)",
  borderRadius: "6px",
  padding: "0.6rem 0.85rem",
  color: "var(--ink)",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s",
  caretColor: "var(--accent-link)",
};

const successWrapper: React.CSSProperties = {
  padding: "2rem",
  background: "var(--canvas-code)",
  border: "1px solid var(--rule)",
  borderRadius: "8px",
};

const sidebarText: React.CSSProperties = {
  fontFamily: "var(--f-body)",
  fontSize: "0.9rem",
  lineHeight: 1.75,
  color: "var(--ink-faint)",
  marginBottom: "1.5rem",
};

const linkList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  marginBottom: "1.5rem",
};

const linkCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.5rem 0.75rem",
  background: "var(--canvas-code)",
  border: "1px solid var(--rule)",
  borderRadius: "6px",
};

const linkLabel: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.65rem",
  color: "var(--ink-faint)",
  minWidth: "50px",
};

const linkHandle: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.65rem",
  color: "var(--accent-link)",
  fontWeight: 600,
  cursor: "pointer",
};

function submitButtonStyle(isDisabled: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--f-mono)",
    fontSize: "0.72rem",
    fontWeight: 600,
    padding: "0.65rem 1.25rem",
    borderRadius: "6px",
    background: isDisabled ? "var(--rule)" : "var(--ink)",
    color: isDisabled ? "var(--ink-faint)" : "var(--canvas)",
    border: "none",
    cursor: isDisabled ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    alignSelf: "flex-start",
  };
}

function handleFocus(
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) {
  (e.target as HTMLElement).style.borderColor = "var(--accent-link)";
}

function handleBlur(
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) {
  (e.target as HTMLElement).style.borderColor = "var(--rule)";
}

export default function Contact({
  setActive,
}: {
  setActive: (s: Section) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const isFormValid = name && email && message;

  const handleSend = () => {
    if (!isFormValid) return;
    setSent(true);
  };

  return (
    <section style={section}>
      <div style={container}>
        {/* Header */}
        <div style={headerRow}>
          <h2 style={heading}>Get in Touch</h2>
          <span style={headingAnnotation}>I read every message</span>
        </div>
        <Rule style={{ marginBottom: "2rem" }} />

        <div style={formGrid}>
          {/* Left — form or success message */}
          {!sent ? (
            <div style={formColumn}>
              <div style={inputRow}>
                <div>
                  <label style={label}>name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="your name"
                    style={inputBase}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label style={label}>email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    style={inputBase}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              <div>
                <label style={label}>message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="what's on your mind?"
                  rows={5}
                  style={{ ...inputBase, resize: "vertical", lineHeight: 1.65 }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!isFormValid}
                style={submitButtonStyle(!isFormValid)}
              >
                $ send message
              </button>
            </div>
          ) : (
            <div style={successWrapper}>
              <CodeBlock
                lang="ts"
                code={`// message delivered ✓\nconst response = {\n  status: 200,\n  message: "got it, thanks!",\n  from: "${name}",\n  eta: "i'll reply within 48h",\n};`}
                compact
              />
              <Annotation
                text="i'll get back to you soon 👋"
                style={{ marginTop: "0.75rem" }}
              />
            </div>
          )}

          {/* Right — links + note */}
          <div>
            <p style={sidebarText}>
              Happy to chat about collaboration, consulting, or just interesting
              ideas. I especially love hearing from people building weird
              things.
            </p>

            <div style={linkList}>
              {SOCIAL_LINKS.map((link) => (
                <div key={link.label} style={linkCard}>
                  <span style={{ fontSize: "0.85rem" }}>{link.icon}</span>
                  <span style={linkLabel}>{link.label}</span>
                  <span
                    onClick={() => window.open(link.link, "_blank")}
                    style={linkHandle}
                  >
                    {link.handle}
                  </span>
                </div>
              ))}
            </div>

            <Annotation text="best way to reach me is email — I check it twice a day" />
          </div>
        </div>
      </div>
    </section>
  );
}
