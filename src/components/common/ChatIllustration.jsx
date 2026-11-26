"use client";

import { motion, useReducedMotion } from "motion/react";

const ring = "M367.92 98.5998C434.611 162.729 235.478 213.655 77.6743 168.387C-29.4066 137.266 42.92 77.8521 147.183 73.1367";
const typingDots = [205.812, 240.505, 275.199];

// Inlined from public/home/chat.svg so each part can move on its own.
export default function ChatIllustration({ className }) {
  const reduced = useReducedMotion();
  const loop = (animate, transition) => (reduced ? {} : { animate, transition: { repeat: Infinity, ease: "easeInOut", ...transition } });

  return (
    <svg viewBox="0 0 406 235" fill="none" aria-hidden="true" className={`overflow-visible ${className}`}>
      <defs>
        <linearGradient id="chat-back" x1="72.668" y1="28.129" x2="72.668" y2="153.773" gradientUnits="userSpaceOnUse"><stop stopColor="#EDF7F5" /><stop offset="1" stopColor="#D3ECE9" /></linearGradient>
        <linearGradient id="chat-front" x1="149.555" y1="81.574" x2="149.555" y2="202.53" gradientUnits="userSpaceOnUse"><stop stopColor="#9468B2" /><stop offset=".5" stopColor="#80549E" /><stop offset="1" stopColor="#6C3D8E" /></linearGradient>
        <filter id="chat-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dy="9.4" stdDeviation="6.5" floodColor="#56316B" floodOpacity=".15" /></filter>
      </defs>

      <motion.g style={{ transformOrigin: "203px 130px", transformBox: "view-box" }} initial={{ rotate: -10 }} {...loop({ rotate: [-10, 10] }, { duration: 7, repeatType: "mirror" })}>
        <path d="M24.8477 131.27C45.4758 198.378 250.82 230.384 381.152 146.756" stroke="#E0D1ED" strokeWidth="1.40647" />
        <path d={ring} stroke="#E0D1ED" strokeWidth="1.40647" />
        <circle r="7.5" fill="#85B7BC" cx={reduced ? 41.7258 : 0} cy={reduced ? 141.583 : 0}>
          {!reduced && <animateMotion dur="9s" repeatCount="indefinite" path={ring} keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" />}
        </circle>
      </motion.g>

      <motion.g {...loop({ y: [0, -7] }, { duration: 2.6, repeatType: "mirror" })}>
        <path d="M108.297 138.77H150.491L94.2324 182.839L108.297 138.77Z" fill="#BEDDDF" />
        <rect x="72.668" y="28.1289" width="204.406" height="125.644" rx="45.0069" fill="url(#chat-back)" />
      </motion.g>

      <motion.g {...loop({ y: [0, 6] }, { duration: 3.1, repeatType: "mirror" })}>
        <path d="M281.762 189.402H306.14L315.517 226.908L281.762 189.402Z" fill="#6C3D8E" />
        <rect x="149.555" y="81.5742" width="187.529" height="120.956" rx="40.3187" fill="url(#chat-front)" filter="url(#chat-shadow)" />
        {typingDots.map((cx, index) => (
          <motion.circle key={cx} cx={cx} cy="143.458" r="9.37644" fill="#85B7BC"
            {...loop({ y: [0, -9, 0], opacity: [.55, 1, .55] }, { duration: 1.2, delay: index * .18, repeatDelay: .35 })} />
        ))}
      </motion.g>

      <motion.g {...loop({ opacity: [.35, 1] }, { duration: 1.1, repeatType: "mirror" })}>
        <circle cx="319.737" cy="62.3521" r="3.28176" fill="#85B7BC" />
        <path d="M331.457 61.1469L339.583 44.0684M347.71 75.9483L355.836 69.1169" stroke="#B294CE" strokeWidth="4.68822" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}
