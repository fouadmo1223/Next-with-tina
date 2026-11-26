"use client";

import { useEffect } from "react";

// Smooth scrolling. Lenis runs its own animation loop (autoRaf), and it's loaded and started only once the page has
// finished loading and the browser is idle, so it doesn't compete with drawing the first screen.
export default function LenisProvider({ children }) {
  useEffect(() => {
    let lenis;
    let cancelled = false;
    let idleId;

    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      lenis = new Lenis({
        // <html> is h-full, so its size never changes; watch <body> so the scroll limit follows page height.
        content: document.body,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        autoRaf: true,
      });
    };
    const whenIdle = () => {
      idleId = "requestIdleCallback" in window ? requestIdleCallback(start, { timeout: 2000 }) : setTimeout(start, 200);
    };

    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", whenIdle);
      if ("cancelIdleCallback" in window) cancelIdleCallback(idleId);
      clearTimeout(idleId);
      lenis?.destroy();
    };
  }, []);

  return children;
}
