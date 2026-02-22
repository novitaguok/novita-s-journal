"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({ dark: false, toggleDark: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  return (
    <ThemeContext.Provider
      value={{ dark, toggleDark: () => setDark((d) => !d) }}
    >
      <div
        className={dark ? "theme-dark" : "theme-light"}
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
