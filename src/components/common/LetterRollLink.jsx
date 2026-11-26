"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import { BlurReveal } from "@/components/common/BlurReveal";

const spring = { type: "spring", stiffness: 420, damping: 28, mass: .7 };

export function RollText({ text, active }) {
  const reduced = useReducedMotion();
  const locale = useLocale();
  const units = locale === "ar" ? text.split(/(\s+)/) : Array.from(text);
  let animatedIndex = -1;

  return (
    <span aria-hidden="true" className="inline-flex whitespace-nowrap">
      {units.map((unit, index) => {
        if (/^\s+$/.test(unit) || unit === " ") return <span key={index}>&nbsp;</span>;
        animatedIndex += 1;
        const delay = reduced ? 0 : animatedIndex * (locale === "ar" ? .09 : .022);
        return <span key={index} className="relative inline-grid overflow-hidden whitespace-nowrap [&>*]:col-start-1 [&>*]:row-start-1">
          <motion.span className="inline-block" initial={false}
            animate={{ y: active && !reduced ? "-110%" : "0%" }}
            transition={{ ...spring, delay }}>{unit}</motion.span>
          <motion.span className="inline-block" initial={false}
            animate={{ y: active && !reduced ? "0%" : "110%" }}
            transition={{ ...spring, delay }}>{unit}</motion.span>
        </span>;
      })}
    </span>
  );
}

export default function LetterRollLink({ children, ...props }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const text = String(children);

  return <BlurReveal {...props} as="link"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocus={(event) => setFocused(event.currentTarget.matches(":focus-visible"))}
    onBlur={() => setFocused(false)}
    aria-label={text}
  >
    <RollText text={text} active={hovered || focused} />
  </BlurReveal>;
}
