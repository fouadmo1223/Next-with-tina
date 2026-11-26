"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BlurReveal } from "@/components/common/BlurReveal";

const ease = [0.16, 1, 0.3, 1];

export default function DoubleWaveLink({ children, ...props }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion();
  const active = hovered || focused;

  return (
    <BlurReveal {...props} as="link"
      className={`${props.className} relative isolate`}
      whileTap={reduced ? undefined : { scale: .97 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={(event) => setFocused(event.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
    >
      <span aria-hidden="true" className="pointer-events-none absolute -inset-px overflow-hidden rounded-[inherit] [direction:ltr]">
          <motion.span
            className="absolute inset-x-0 top-0 h-[170%]"
            initial={{ y: "100%" }}
            animate={{ y: active ? "-38%" : "100%" }}
            transition={{ duration: reduced ? 0 : .9, ease, delay: reduced ? 0 : .06 }}
          >
            <motion.svg viewBox="0 0 200 100" preserveAspectRatio="none"
              className="block h-full w-[200%]"
              initial={{ x: "0%" }}
              animate={{ x: active && !reduced ? ["0%", "-50%"] : "0%" }}
              transition={active && !reduced ? { duration: 1.5, repeat: Infinity, ease: "linear" } : undefined}
            >
              <path d="M0 12 Q25 0 50 12 T100 12 T150 12 T200 12 V100 H0 Z" fill="#a9ced0" />
            </motion.svg>
          </motion.span>
      </span>
      <span className="relative z-10">{children}</span>
    </BlurReveal>
  );
}
