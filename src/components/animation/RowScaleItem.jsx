"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const MotionLink = motion.create(Link);

export default function RowScaleItem({ as = "li", index = 0, children, style, ...props }) {
  const reducedMotion = useReducedMotion();
  const locale = useLocale();
  const Element = as === "link" ? MotionLink : motion[as];

  return (
    <Element
      {...props}
      initial={reducedMotion ? false : { opacity: 0, scaleX: 0.3 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: reducedMotion ? 0 : 0.6,
        delay: reducedMotion ? 0 : index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ ...style, transformOrigin: locale === "ar" ? "right center" : "left center" }}
    >
      {children}
    </Element>
  );
}
