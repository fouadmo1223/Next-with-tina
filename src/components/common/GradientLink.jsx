"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { RollText } from "@/components/common/LetterRollLink";

// Extra props (e.g. target/rel for an outside link) go straight to the link.
export default function GradientLink({ href, className = "", icon, children, ...rest }) {
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  const text = String(children);

  return (
    <Link {...rest} href={href} aria-label={text} className={`relative inline-flex items-center overflow-hidden rounded-[10px] bg-[linear-gradient(90deg,#85B7BC_0%,#80549E_100%)] px-6 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#884fb4] ${className}`}
      onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)} onBlur={() => setActive(false)}>
      <motion.span aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[400%] bg-[linear-gradient(90deg,#85B7BC_0%,#80549E_25%,#85B7BC_50%,#80549E_75%,#85B7BC_100%)]"
        initial={false}
        animate={{ opacity: active && !reduced ? 1 : 0, x: active && !reduced ? ["0%", "-50%"] : "0%" }}
        transition={{ opacity: { duration: .25 }, x: active && !reduced ? { duration: 2.2, repeat: Infinity, ease: "linear" } : { duration: 0, delay: .25 } }}
      />
      <span className="relative z-10 inline-flex items-center gap-3">{icon}<RollText text={text} active={active} /></span>
    </Link>
  );
}
