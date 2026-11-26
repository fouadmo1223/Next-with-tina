"use client";

import { useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export default function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}
