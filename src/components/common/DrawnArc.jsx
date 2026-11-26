"use client";

import { motion } from "motion/react";
import { useReveal } from "@/components/animation/Reveal";

const arcPath = "M1.07198 1.07198C83.9914 7.85521 132.258 66.6432 108.744 145.781";

export default function DrawnArc({ className, delay }) {
  const { visible, reduced } = useReveal();
  return (
    <div aria-hidden="true" className={className}>
      <svg viewBox="0 0 115.767 146.853" fill="none" className="block h-auto w-full overflow-visible">
        <motion.path d={arcPath} stroke="#E0D1ED" strokeWidth="2.14384" strokeLinecap="round"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          animate={visible ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: reduced ? 0 : .85, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </div>
  );
}
