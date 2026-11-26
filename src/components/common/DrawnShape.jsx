"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { useReveal } from "@/components/animation/Reveal";

const drawEase = [0.65, 0, 0.35, 1];
const shapeStagger = .45;

export default function DrawnShape({ viewBox, opacity = 1, fill, className, d, index = 0, after = 0 }) {
  const { visible, reduced } = useReveal();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: .25 });
  const [armed, setArmed] = useState(false);
  const delay = reduced ? 0 : index * shapeStagger;
  const duration = reduced ? 0 : 1.6;
  const settle = { duration: reduced ? 0 : .7, delay: reduced ? 0 : delay + duration };

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setArmed(true), after * 1000);
    return () => clearTimeout(timer);
  }, [visible, after]);

  return (
    <svg ref={ref} viewBox={viewBox} fill="none" aria-hidden="true" className={`pointer-events-none absolute -z-10 hidden h-auto overflow-visible md:block ${className}`}>
      <motion.path d={d} strokeWidth={fill ? 2.5 : 2} fill={fill ? "#BEDDDF" : "none"}
        initial={reduced ? false : { pathLength: 0, opacity: 0, fillOpacity: 0, strokeOpacity: 1, stroke: "#85B7BC" }}
        animate={(armed && inView) || reduced
          ? { pathLength: 1, opacity: 1, fillOpacity: opacity, strokeOpacity: fill ? 0 : 1, stroke: "#BEDDDF" }
          : undefined}
        transition={{
          pathLength: { duration, delay, ease: drawEase },
          opacity: { duration: 0, delay },
          fillOpacity: settle,
          strokeOpacity: settle,
          stroke: settle,
        }}
      />
    </svg>
  );
}
