"use client";
import { useTheme } from "./ThemeProvider";

export default function ArticleLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isWide } = useTheme();

  return (
    <div
      style={{
        maxWidth: isWide ? "1200px" : "820px",
        margin: "0 auto",
        padding: "3.5rem 2.5rem 5rem",
        transition: "max-width 0.3s ease",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}
