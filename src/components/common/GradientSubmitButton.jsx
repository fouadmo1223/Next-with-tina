"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RollText } from "@/components/common/LetterRollLink";

// While `pending`, the button is disabled and shows a spinner with `pendingLabel`.
export default function GradientSubmitButton({ label, pending = false, pendingLabel, className = "w-full" }) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  const active = hovered || pending;
  const text = pending && pendingLabel ? pendingLabel : label;

  return (
    <button type="submit" disabled={pending} aria-busy={pending || undefined} aria-label={text} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={(event) => setHovered(event.currentTarget.matches(":focus-visible"))} onBlur={() => setHovered(false)}
      className={`relative flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-[10px] bg-[linear-gradient(90deg,#85B7BC_0%,#80549E_100%)] text-[14px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#884fb4] disabled:cursor-wait ${className}`}>
      {/* The moving gradient runs on hover, and keeps running while the form is sending. */}
      <motion.span aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[400%] bg-[linear-gradient(90deg,#85B7BC_0%,#80549E_25%,#85B7BC_50%,#80549E_75%,#85B7BC_100%)]"
        initial={false}
        animate={{ opacity: active && !reduced ? 1 : 0, x: active && !reduced ? ["0%", "-50%"] : "0%" }}
        transition={{ opacity: { duration: .25 }, x: active && !reduced ? { duration: pending ? 1.2 : 2.2, repeat: Infinity, ease: "linear" } : { duration: 0, delay: .25 } }}
      />
      <span className="relative z-10 flex items-center gap-2">
        <AnimatePresence initial={false}>
          {pending && (
            <motion.span key="spinner" aria-hidden="true" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 18 }} exit={{ opacity: 0, width: 0 }} transition={{ duration: reduced ? 0 : .2 }} className="flex overflow-hidden">
              <span className="size-[18px] shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />
            </motion.span>
          )}
        </AnimatePresence>
        <RollText key={text} text={text} active={hovered && !pending} />
      </span>
    </button>
  );
}
