"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const showFor = 3000;

// Rendered on the body, because a parent with a filter would pin a fixed element to itself instead of the screen.
const tones = { error: "bg-[#b42318]", success: "bg-[#1f7a5a]" };

function ToastCard({ message, closeLabel, onClose, tone }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(onClose, showFor);
    return () => clearTimeout(timer);
  }, [onClose]);

  return createPortal(
    <motion.div role={tone === "success" ? "status" : "alert"}className="pointer-events-none fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[100] min-[968px]:bottom-6 flex justify-center"
      initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 16 }} transition={{ duration: .25, ease: "easeOut" }}>
      <div className={`pointer-events-auto flex items-center gap-2 rounded-[12px] ${tones[tone] ?? tones.error} py-2 ps-4 pe-2 text-white shadow-[0_14px_34px_-14px_rgba(45,30,56,0.55)]`}>
        <p className="text-[14px] font-semibold">{message}</p>
        <button type="button" aria-label={closeLabel} onClick={onClose} className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-[8px] transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-4"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
    </motion.div>,
    document.body,
  );
}

// Shows `message` for a few seconds, then calls `onClose`. Pass nothing to hide it. `tone` is "error" (default) or "success".
export default function Toast({ message, closeLabel, onClose, tone = "error" }) {
  return <AnimatePresence>{message && <ToastCard key={`${tone}-${message}`} message={message} closeLabel={closeLabel} onClose={onClose} tone={tone} />}</AnimatePresence>;
}
