"use client";

import { motion } from "motion/react";
import { useReveal } from "@/components/animation/Reveal";

const trail = "M-133.907 476C-134.015 473.366 -134.115 470.752 -134.21 468.158M-134.702 452.841C-134.847 447.6 -134.964 442.446 -135.054 437.38M-135.242 422.167C-135.278 416.892 -135.282 411.716 -135.253 406.64M-135.064 391.271C-134.964 386.084 -134.827 381.008 -134.653 376.041M-133.975 360.539C-133.697 355.282 -133.373 350.159 -133.004 345.167M-131.696 329.893C-131.183 324.667 -130.614 319.6 -129.991 314.69M-127.8 299.469C-126.949 294.218 -126.025 289.168 -125.028 284.316M-121.559 269.345C-120.212 264.176 -118.766 259.271 -117.22 254.625M-111.738 240.177C-109.594 235.22 -107.303 230.635 -104.864 226.409M-96.2785 213.754C-92.922 209.569 -89.3474 205.898 -85.5541 202.722M-72.7675 194.277C-68.2193 191.981 -63.4206 190.228 -58.371 188.995M-43.1645 186.858C-38.2553 186.627 -33.1479 186.788 -27.8417 187.324M-12.6374 189.756C-7.81736 190.789 -2.85358 192.081 2.25426 193.624M16.7824 198.535C21.4301 200.262 26.1857 202.169 31.0495 204.25M45.0662 210.582C49.577 212.72 54.1737 214.992 58.8564 217.393M72.4495 224.586C74.7037 225.814 76.9766 227.069 79.268 228.351C81.7886 229.593 84.2637 230.747 86.6948 231.816M101.6 237.488C106.966 239.195 112.096 240.446 117.011 241.274M133.001 242.506C138.547 242.391 143.788 241.678 148.76 240.432M163.693 234.764C168.383 232.337 172.815 229.394 177.03 226.013M188.693 215.041C192.214 211.225 195.587 207.103 198.843 202.733M207.926 189.522C210.747 185.113 213.494 180.543 216.195 175.859M223.985 161.871C226.507 157.211 229.008 152.49 231.51 147.746M238.986 133.598C241.498 128.878 244.033 124.177 246.613 119.535M254.607 105.665C257.388 101.04 260.239 96.5217 263.185 92.1561M272.589 79.2348C275.956 74.9752 279.459 70.9398 283.125 67.182M295.006 56.5144C299.247 53.2257 303.702 50.3051 308.405 47.8148M323.154 41.7379C325.685 40.9748 328.283 40.3272 330.95 39.8021";
const plane = "M351.588 0.0109809C355.215 -0.363611 377.549 8.95744 382.895 10.8569C391.313 6.9628 409.002 -3.24571 416.533 4.88103C416.924 5.81186 416.886 6.56069 416.547 7.49047C415.379 10.6696 394.061 19.7419 390.04 21.5902C386.271 30.1109 383.386 39.9346 379.769 48.5869C378.361 51.9529 377.098 53.4449 373.847 54.7077C372.48 55.2322 371.825 55.7782 370.527 55.0474C369.588 52.9931 371.26 33.2558 371.725 29.8295C368.537 31.4622 358.887 35.0014 355.352 36.2275C354.154 38.7685 352.836 42.1342 349.851 42.9144C346.965 42.2037 347.549 39.3353 347.572 36.8769C342 35.0448 342.913 35.3058 342.594 31.4231C342.528 30.6178 336.127 28.1861 336.757 25.7696C337.891 24.7365 339.565 24.3386 341.048 23.8526C344.22 24.6765 348.281 26.1456 351.488 27.1703C353.926 26.1597 362.095 21.3207 364.875 19.7786C361.839 16.2944 347.352 6.69402 345.629 3.79217C346.043 1.50265 349.638 0.647998 351.588 0.0109809Z";

const flightSeconds = 3;
const segments = trail.split("M").filter(Boolean).map((segment) => `M${segment}`);
const points = segments.map((segment) => {
  const [x, y] = segment.match(/-?\d+\.?\d*/g).map(Number);
  return { x, y };
});
const end = points[points.length - 1];
const lengths = points.map((point, index) => (index === 0 ? 0 : Math.hypot(point.x - points[index - 1].x, point.y - points[index - 1].y)));
const total = lengths.reduce((sum, length) => sum + length, 0);
const times = lengths.reduce((list, length, index) => [...list, (index === 0 ? 0 : list[index - 1]) + length / total], []);
const heading = (index) => {
  const from = points[Math.min(index, points.length - 2)];
  const to = points[Math.min(index, points.length - 2) + 1];
  return Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
};
const flight = {
  x: points.map((point) => point.x - end.x),
  y: points.map((point) => point.y - end.y),
  rotate: points.map((_, index) => heading(index) - heading(points.length - 2)),
};

export default function FlightPath({ delay = 0, className }) {
  const { visible, reduced } = useReveal();

  return (
    <svg viewBox="0 0 418 477" fill="none" aria-hidden="true" className={`pointer-events-none absolute -z-10 hidden h-auto overflow-visible md:block ${className}`}>
      {segments.map((segment, index) => (
        <motion.path key={segment} d={segment} stroke="#BEDDDF" strokeWidth="1.69307"
          initial={reduced ? false : { opacity: 0 }}
          animate={visible ? { opacity: 1 } : undefined}
          transition={{ duration: reduced ? 0 : .12, delay: reduced ? 0 : delay + times[index] * flightSeconds }}
        />
      ))}
      <g className="plane-float">
        <motion.path d={plane} fill="#85B7BC"
          initial={reduced ? false : { x: flight.x[0], y: flight.y[0], rotate: flight.rotate[0] }}
          animate={visible && !reduced ? flight : undefined}
          transition={{ duration: flightSeconds, delay, ease: "linear", times }}
        />
      </g>
    </svg>
  );
}
