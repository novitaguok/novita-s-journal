"use client";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Section } from "../../types";
import Home from "../../app/page";
import Articles from "../../components/articles/page";
import Projects from "../../components/projects/page";
import About from "../../components/about/page";
import Nav from "./Nav";
import Footer from "./Footer";

export default function App() {
  const [active, setActive] = useState<Section>("home");
  const { dark, toggleDark } = useTheme();

  return (
    <>
      <Nav active={active} setActive={setActive} dark={dark} toggleDark={toggleDark} />
      <main style={{ animation: "pageIn 0.35s ease", flex: 1 }}>
        {active === "home" && <Home setActive={setActive} />}
        {active === "articles" && <Articles />}
        {active === "projects" && <Projects />}
        {active === "about" && <About setActive={setActive} />}
      </main>
      <Footer setActive={setActive} />
    </>
  );
}
