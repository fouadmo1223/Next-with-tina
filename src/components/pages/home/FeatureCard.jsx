"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReveal } from "@/components/animation/Reveal";
import { skipImageOptimizer } from "@/lib/utils";

export default function FeatureCard({ image, imageWidth, title, description, index }) {
  const { visible, reduced } = useReveal();
  const [hovered, setHovered] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 220, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 220, damping: 24 });
  const rotateX = useTransform(smoothY, [-.5, .5], [8, -8]);
  const rotateY = useTransform(smoothX, [-.5, .5], [-8, 8]);
  const glowX = useTransform(pointerX, value => `${(value + .5) * 100}%`);
  const glowY = useTransform(pointerY, value => `${(value + .5) * 100}%`);

  const movePointer = (event) => {
    if (reduced || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - .5);
    pointerY.set((event.clientY - rect.top) / rect.height - .5);
  };

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, scale: 1.16 }}
      animate={visible ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: reduced ? 0 : .7, delay: reduced ? 0 : 2.7 + index * .17, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900, "--mx": glowX, "--my": glowY }}
      onPointerEnter={(event) => { if (event.pointerType !== "touch" && !reduced) setHovered(true); movePointer(event); }}
      onPointerMove={movePointer}
      onPointerLeave={() => { setHovered(false); pointerX.set(0); pointerY.set(0); }}
      className="relative isolate flex h-full min-h-[215px] flex-col items-center overflow-hidden rounded-[14px] border-t-[7px] border-[#85b7bc] bg-white/30 px-5 pb-5 pt-4 text-center shadow-[0_8px_24px_-16px_rgba(45,30,56,0.3)] backdrop-blur-[2px] sm:min-h-[225px]"
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ opacity: hovered && !reduced ? 1 : 0 }}
        transition={{ duration: .25 }}
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        style={{ background: "radial-gradient(circle 180px at var(--mx) var(--my), rgba(133,183,188,.28), rgba(128,84,158,.12) 45%, transparent 75%)" }}
      />
      {image && (
        <div className="relative z-10 flex h-[82px] items-center justify-center">
          {/* Dashboard uploads are resized on the live site; see skipImageOptimizer. */}
          <Image src={image} alt="" width={imageWidth ?? 125} height={80} unoptimized={skipImageOptimizer(image)} className="max-h-[80px] w-auto max-w-[125px] object-contain" />
        </div>
      )}
      {title && <h3 className="relative z-10 mt-3 text-[17px] font-bold leading-[1.5] text-white sm:text-[18px]">{title}</h3>}
      {description && <p className="relative z-10 mt-2 max-w-[230px] text-[13px] leading-[1.7] font-medium text-white/90 sm:text-[14px]">{description}</p>}
    </motion.article>
  );
}
