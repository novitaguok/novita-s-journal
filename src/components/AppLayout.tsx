"use client";
import { useTheme } from "./ThemeProvider";
import Nav from "./Nav";
import Footer from "./Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { dark, toggleDark, isWide, toggleWide } = useTheme();

  return (
    <>
      <Nav
        dark={dark}
        toggleDark={toggleDark}
        isWide={isWide}
        toggleWide={toggleWide}
      />
      <main style={{ animation: "pageIn 0.35s ease", flex: 1 }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
