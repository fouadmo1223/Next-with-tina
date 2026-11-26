"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useReveal } from "@/components/animation/Reveal";

function WordRollText({ text, active, reduced, startIndex = 0, className = "" }) {
  return (
    <span className={className}>
      {text.split(/\s+/).map((word, index) => {
        const delay = reduced ? 0 : (startIndex + index) * .06;
        const transition = { type: "spring", stiffness: 420, damping: 28, mass: .7, delay };
        return (
          <span key={index}>
            {index > 0 && " "}
            <span className="relative inline-grid overflow-hidden align-bottom [&>*]:col-start-1 [&>*]:row-start-1">
              <motion.span className="inline-block" initial={false}
                animate={{ y: active && !reduced ? "-110%" : "0%" }} transition={transition}>{word}</motion.span>
              <motion.span className="inline-block" initial={false}
                animate={{ y: active && !reduced ? "0%" : "110%" }} transition={transition}>{word}</motion.span>
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function RollingHeading({ id, start, accent, delay }) {
  const { visible, reduced } = useReveal();
  const [active, setActive] = useState(false);

  return (
    <motion.h2 id={id} tabIndex={0}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: reduced ? 0 : .55, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)} onBlur={() => setActive(false)}
      className="text-[clamp(28px,3vw,46px)] leading-[1.35] font-semibold tracking-tight text-[#884fb4] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#884fb4]">
      <span className="sr-only">{[start, accent].filter(Boolean).join(" ")}</span>
      <span aria-hidden="true">
        {start && <WordRollText text={start} active={active} reduced={reduced} className="text-[#884fb4]" />}
        {start && accent && " "}
        {accent && <WordRollText text={accent} active={active} reduced={reduced} startIndex={start ? start.split(/\s+/).length : 0} className="text-[#85b7bc]" />}
      </span>
    </motion.h2>
  );
}
