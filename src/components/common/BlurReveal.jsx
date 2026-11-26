"use client";

import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";

const ease = [0.16, 1, 0.3, 1];
const MotionLink = motion.create(Link);

// `cssDelay` runs the entrance from CSS, so it plays on first paint without waiting for hydration.
// `still` skips the entrance, for links that sit inside their own <Reveal>.
export function BlurReveal({ as = "div", ready, delay = 0, cssDelay, still, className, style, children, ...props }) {
  const reduced = useReducedMotion();
  const Element = as === "link" ? MotionLink : motion[as];
  const reveal = { duration: reduced ? 0 : .5, delay: reduced ? 0 : delay, ease };
  const css = cssDelay !== undefined;
  return <Element {...props}
    className={css ? `${className} reveal-blur` : className}
    style={css ? { ...style, "--reveal-delay": `${cssDelay}s`, "--reveal-duration": ".5s" } : style}
    initial={css || still ? false : { opacity: 0, filter: "blur(10px)" }}
    animate={css || still ? undefined : ready || reduced ? { opacity: 1, filter: "blur(0px)" } : undefined}
    transition={{ opacity: reveal, filter: reveal, scale: { type: "spring", stiffness: 420, damping: 28, mass: .7 } }}>
    {children}
  </Element>;
}
