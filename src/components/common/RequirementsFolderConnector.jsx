"use client";

import { motion } from "motion/react";
import { useReveal } from "@/components/animation/Reveal";

// Dashes in drawing order, from the first folder's side (top right) to the second's (bottom left).
const dashes = [
  "M54.0001 1C53.2769 1.15496 52.5725 1.32058 51.8863 1.49702",
  "M43.777 4.50526C45.0101 3.86697 46.3315 3.29006 47.7463 2.77283",
  "M36.8459 9.6481C37.8275 8.61094 38.9074 7.65703 40.0928 6.78389",
  "M32.093 16.8509C32.7011 15.499 33.3894 14.232 34.165 13.0475",
  "M29.4528 24.9431C29.6415 24.3092 29.8237 23.6614 30.0001 23C30.1786 22.2858 30.3714 21.5892 30.5789 20.9102",
  "M26.5439 32.4457C27.1315 31.2935 27.67 30.0641 28.1676 28.7605",
  "M21.8321 38.9314C22.7934 38.0254 23.6682 37.0106 24.4681 35.8914",
  "M14.9599 43.0157C16.2822 42.5715 17.4993 42.0151 18.6222 41.3505",
  "M7.03622 44.2928C8.4562 44.2594 9.79159 44.1447 11.0486 43.9511",
  "M1.00006 44C1.68648 44.0763 2.3569 44.138 3.01177 44.1853",
];

export default function RequirementsFolderConnector({ delay, duration, className }) {
  const { visible, reduced } = useReveal();
  const step = duration / dashes.length;

  return (
    <svg viewBox="0 0 55 46" fill="none" aria-hidden="true" className={`pointer-events-none absolute overflow-visible ${className}`}>
      {dashes.map((dash, index) => (
        <motion.path key={dash} d={dash} stroke="#85B7BC" strokeWidth="2" strokeLinecap="round"
          initial={reduced ? false : { opacity: 0 }}
          animate={visible ? { opacity: 1 } : undefined}
          transition={{ duration: reduced ? 0 : step, delay: reduced ? 0 : delay + index * step }}
        />
      ))}
    </svg>
  );
}
