"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  dark: false,
  toggleDark: () => {},
  isWide: false,
  toggleWide: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(dark ? "theme-dark" : "theme-light");
  }, [dark]);

  return (
    <ThemeContext.Provider
      value={{
        dark,
        toggleDark: () => setDark((d) => !d),
        isWide,
        toggleWide: () => setIsWide((w) => !w),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
