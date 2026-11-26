"use client";

import { createContext, useContext } from "react";

export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
