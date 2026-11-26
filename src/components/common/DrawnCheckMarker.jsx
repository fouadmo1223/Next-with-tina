"use client";

import { motion } from "motion/react";
import { useReveal } from "@/components/animation/Reveal";

const drawEase = [0.65, 0, 0.35, 1];

// The circle draws first, then the check (or the step number) appears inside it.
export default function DrawnCheckMarker({ number, delay, markDelay }) {
  const { visible, reduced } = useReveal();
  const draw = (start, duration) => ({
    initial: reduced ? false : { pathLength: 0, opacity: 0 },
    animate: visible ? { pathLength: 1, opacity: 1 } : undefined,
    transition: {
      pathLength: { duration: reduced ? 0 : duration, delay: reduced ? 0 : start, ease: drawEase },
      opacity: { duration: 0, delay: reduced ? 0 : start },
    },
  });

  return (
    <span className="relative flex size-7 shrink-0 items-center justify-center">
      <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className="absolute inset-0 size-full">
        <motion.circle cx="14" cy="14" r="13" stroke="#6C3D8E" strokeWidth="1.4" fill={number ? "#6C3D8E" : "none"}
          style={{ rotate: -90 }} {...draw(delay, .3)} />
        {!number && <motion.path d="M8.5 14.5l3.8 3.8 7.2-8" stroke="#6C3D8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...draw(markDelay, .22)} />}
      </svg>
      {number && (
        <motion.span className="relative text-[13px] font-bold text-white"
          initial={reduced ? false : { opacity: 0, scale: .6 }}
          animate={visible ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: reduced ? 0 : .22, delay: reduced ? 0 : markDelay }}
        >{number}</motion.span>
      )}
    </span>
  );
}
