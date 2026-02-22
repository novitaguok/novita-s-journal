import { Rule, CodeBlock, Annotation } from "../../components/ui/Shared";
import Contact from "../../components/about/Contact";
import { Section } from "../../types";

const PROFILE_META = [
  { icon: "📍", text: "Jakarta" },
  { icon: "🔗", text: "novita.dev" },
  { icon: "🏢", text: "Banking Company" },
  { icon: "🎓", text: "Telkom University" },
];

const SKILLS = [
  "🛠️ TypeScript · Rust · Go",
  "🎨 Figma · CSS · Motion",
  "🏗️ React · Next.js · Tauri",
  "🗃️ PostgreSQL · Supabase",
  "✍️ Writing weekly",
  "🤝 Open to collabs",
];

const BIO_PARAGRAPHS = [
  "I'm a A generalist tech enthusiast that love exploring new tech (such as mobile, FE, BE, blockchain, etc). An exponential curve learner (instead of linear).",
  "I write to think. The articles here are my attempt to articulate things I've half-understood.",
];

const PRINCIPLES_CODE = `// What I care about
const principles = [
\u00A0\u00A0"never too old to learn",
\u00A0\u00A0"ship small, learn fast, be honest",
\u00A0\u00A0"writing is thinking",
];

// What I'm working on right now
const current = {
\u00A0\u00A0building: ["Cinlok", "Shelter-It"],
\u00A0\u00A0learning: "Cybersecurity",
};`;

const pageWrapper: React.CSSProperties = {
  paddingTop: "52px",
  minHeight: "100vh",
};

const container: React.CSSProperties = {
  maxWidth: "820px",
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

const profileRow: React.CSSProperties = {
  display: "flex",
  gap: "1.75rem",
  alignItems: "flex-start",
  marginBottom: "2.5rem",
};

const avatar: React.CSSProperties = {
  width: "86px",
  height: "86px",
  borderRadius: "50%",
  flexShrink: 0,
  background: "linear-gradient(135deg, #e8f4fd, #fce8e8)",
  border: "2px solid var(--rule)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "var(--f-mono)",
  fontSize: "1.5rem",
  color: "var(--ink-soft)",
  position: "relative",
};

const onlineDot: React.CSSProperties = {
  position: "absolute",
  bottom: 2,
  right: 2,
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: "#3fb950",
  border: "2.5px solid var(--canvas)",
};

const profileName: React.CSSProperties = {
  fontFamily: "var(--f-display)",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "var(--ink)",
  marginBottom: "0.1rem",
  letterSpacing: "-0.02em",
};

const profileHandle: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.75rem",
  color: "var(--ink-faint)",
  marginBottom: "0.65rem",
};

const metaGrid: React.CSSProperties = {
  display: "flex",
  gap: "1.25rem",
  flexWrap: "wrap",
};

const metaItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
};

const sectionList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
};

const sectionTitleRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "0.6rem",
  paddingBottom: "0.4rem",
  borderBottom: "1px solid var(--rule)",
};

const sectionHash: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.8rem",
  color: "var(--ink-faint)",
  fontWeight: 700,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--f-display)",
  fontSize: "1.05rem",
  fontWeight: 700,
  color: "var(--ink)",
};

const bioGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "2rem",
};

const skillsColumn: React.CSSProperties = {
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.35rem",
};

const skillItem: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: "0.65rem",
  color: "var(--ink-faint)",
  whiteSpace: "nowrap",
};

export default function About({
  setActive,
}: {
  setActive: (s: Section) => void;
}) {
  return (
    <div style={pageWrapper}>
      <div style={container}>
        {/* Header */}
        <div style={headerRow}>
          <h2 style={heading}>readme.md</h2>
        </div>
        <Rule style={{ marginBottom: "2rem" }} />

        {/* Profile header */}
        <div style={profileRow}>
          <div style={avatar}>
            n
            <div style={onlineDot} />
          </div>

          <div>
            <h3 style={profileName}>Novita</h3>
            <p style={profileHandle}>Novita · she/her</p>

            <div style={metaGrid}>
              {PROFILE_META.map((item) => (
                <div key={item.text} style={metaItem}>
                  <span style={{ fontSize: "0.72rem" }}>{item.icon}</span>
                  <span
                    style={{
                      fontFamily: "var(--f-mono)",
                      fontSize: "0.63rem",
                      color: "var(--ink-faint)",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* README sections */}
        <div style={sectionList}>
          {/* Hi */}
          <div>
            <div style={sectionTitleRow}>
              <span style={sectionHash}>##</span>
              <span style={sectionTitle}>Hi, I'm Novita 👋</span>
            </div>

            <div style={bioGrid}>
              <div>
                {BIO_PARAGRAPHS.map((paragraph, index) => (
                  <p
                    key={index}
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: "0.92rem",
                      lineHeight: 1.8,
                      color:
                        index === 0 ? "var(--ink-soft)" : "var(--ink-faint)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div style={skillsColumn}>
                {SKILLS.map((skill) => (
                  <div key={skill} style={skillItem}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* In code */}
          <div>
            <div style={sectionTitleRow}>
              <span style={sectionHash}>##</span>
              <span style={sectionTitle}>In code</span>
            </div>

            <div style={{ position: "relative" }}>
              <CodeBlock lang="ts" code={PRINCIPLES_CODE} />
              <Annotation
                text="I actually believe all of these"
                style={{ marginTop: "0.5rem" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact section */}
      <Contact setActive={setActive} />
    </div>
  );
}
