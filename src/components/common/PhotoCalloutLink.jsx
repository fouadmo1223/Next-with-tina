"use client";

import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { useReveal } from "@/components/animation/Reveal";

const MotionLink = motion.create(Link);

export default function PhotoCalloutLink({ href, children, delay = 0 }) {
  const { visible, reduced } = useReveal();

  return (
    <MotionLink href={href} dir="auto" initial={reduced ? false : { opacity: 0 }} animate={visible ? { opacity: 1 } : undefined} transition={{ duration: reduced ? 0 : .45, delay: reduced ? 0 : delay }} className="absolute bottom-[5%] left-[8%] z-30 inline-flex min-h-[90px] max-w-[200px] items-center gap-4 overflow-hidden rounded-[17px] bg-[linear-gradient(180deg,#80549E_0%,#2D1E38_100%)] px-5 py-4 text-right text-[18px] leading-[1.25] font-semibold text-white shadow-[0_6.43px_21.44px_0_var(--MiscellaneousFloatingTab-PillShadow,#00000026)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3d8e]">
     
      <svg width="25" height="35" viewBox="0 0 25 35" fill="none" className="relative z-10 h-[35px] w-[25px] shrink-0" aria-hidden="true"><path d="M10.2537 33.1248H3.82288C3.06485 33.1248 2.33787 32.786 1.80186 32.1829C1.26585 31.5798 0.964722 30.7618 0.964722 29.9088V4.18074C0.964722 3.3278 1.26585 2.5098 1.80186 1.90668C2.33787 1.30356 3.06485 0.964733 3.82288 0.964733H15.2555M15.2555 0.964733C15.7084 0.963484 16.157 1.06316 16.5754 1.25801C16.9939 1.45286 17.3739 1.73902 17.6935 2.09998L22.8211 7.86951C23.1419 8.22917 23.3962 8.65676 23.5694 9.1276C23.7425 9.59844 23.8311 10.1032 23.83 10.6128M15.2555 0.964733V9.00475C15.2555 9.43121 15.4061 9.84022 15.6741 10.1418C15.9421 10.4433 16.3056 10.6128 16.6846 10.6128L23.83 10.6128M23.83 10.6128V20.2608M15.2555 29.9088L18.1137 33.1248L23.83 26.6928" strokeWidth="1.92945" strokeLinecap="round" stroke="white" /></svg>
      <span className="relative z-10">{children}</span>
    </MotionLink>
  );
}
