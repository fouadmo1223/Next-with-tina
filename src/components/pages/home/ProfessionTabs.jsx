"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useReveal } from "@/components/animation/Reveal";
import ProfessionPanel from "./ProfessionPanel";
import { skipImageOptimizer } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1];
const tabsDelay = .9;
const tabStagger = .12;

export default function ProfessionTabs({ tabsLabel, professions }) {
  const panelDelay = tabsDelay + professions.length * tabStagger;
  const { visible, reduced } = useReveal();
  const [activeKey, setActiveKey] = useState(professions[0]?.key);
  const [switched, setSwitched] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const active = professions.find((profession) => profession.key === activeKey);
  const reveal = (delay) => ({
    initial: reduced ? false : { opacity: 0, filter: "blur(12px)" },
    animate: visible ? { opacity: 1, filter: "blur(0px)" } : undefined,
    transition: { duration: reduced ? 0 : .6, delay: reduced ? 0 : delay, ease },
  });

  const select = (key) => {
    setActiveKey(key);
    setSwitched(true);
    const index = professions.findIndex((profession) => profession.key === key);
    if (index >= 0 && swiper?.activeIndex !== index) swiper?.slideTo(index);
  };

  const moveFocus = (event) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const steps = { ArrowDown: 1, ArrowUp: -1, ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1 };
    const step = steps[event.key];
    if (!step) return;
    event.preventDefault();
    const index = professions.findIndex((profession) => profession.key === activeKey);
    const nextIndex = (index + step + professions.length) % professions.length;
    select(professions[nextIndex].key);
    event.currentTarget.querySelectorAll('[role="tab"]')[nextIndex].focus();
  };

  const tab = (profession, index, mode) => {
    const selected = profession.key === activeKey;
    return (
      <motion.button key={profession.key} {...reveal(tabsDelay + index * tabStagger)} type="button" role="tab"
        id={`profession-tab-${mode}-${profession.key}`} aria-selected={selected} aria-controls="profession-panel" tabIndex={selected ? 0 : -1}
        onClick={() => select(profession.key)}
        className="relative isolate flex min-h-[84px] w-full cursor-pointer items-center justify-start gap-3 rounded-[14px] border border-[#EDF7F5] bg-[#FFFFFF] px-4 py-3 text-start shadow-[0_6px_18px_-14px_rgba(45,30,56,0.35)] transition-colors hover:border-[#b7a0c5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#884fb4]"
      >
        {selected && (
          <motion.span layoutId={`profession-tab-highlight-${mode}`} aria-hidden="true"
            transition={{ type: "spring", stiffness: 420, damping: 34, duration: reduced ? 0 : undefined }}
            className="absolute -inset-px -z-10 rounded-[14px] bg-[linear-gradient(180deg,#6c3d8e_0%,#553072_100%)]" />
        )}
        {profession.icon && <Image src={profession.icon} alt="" width={26} height={26} unoptimized={skipImageOptimizer(profession.icon)} className={`size-[26px] shrink-0 transition-[filter] duration-200 ${selected ? "brightness-0 invert" : ""}`} />}
        <span className="min-w-0">
          {profession.title && <span className={`block text-[17px] leading-[1.4] font-bold transition-colors duration-200 ${selected ? "text-white" : "text-[#2f2835]"}`}>{profession.title}</span>}
          {profession.subtitle && <span className={`mt-1 block text-[13px] leading-[1.5] transition-colors duration-200 ${selected ? "text-white/85" : "text-[#5d5861]"}`}>{profession.subtitle}</span>}
        </span>
      </motion.button>
    );
  };

  return (
    <>
      {visible && (
        <div aria-hidden="true" className="hidden">
          {professions.filter(({ image }) => image?.src).map(({ key, image }) => <Image key={key} src={image.src} alt="" width={image.width} height={image.height} sizes={image.sizes} loading="eager" unoptimized={skipImageOptimizer(image.src)} />)}
        </div>
      )}
    <div className="mt-9 grid items-start gap-5 lg:mt-12 lg:grid-cols-[310px_minmax(0,1fr)] lg:gap-6">
      <div className="min-w-0 lg:hidden">
        <Swiper role="tablist" aria-label={tabsLabel} onKeyDown={moveFocus} slidesPerView={1.5} spaceBetween={16}
          onSwiper={setSwiper} onSlideChange={(instance) => select(professions[instance.activeIndex].key)}>
          {professions.map((profession, index) => <SwiperSlide key={profession.key} className="!h-auto">{tab(profession, index, "mobile")}</SwiperSlide>)}
        </Swiper>
      </div>
      <div role="tablist" aria-label={tabsLabel} aria-orientation="vertical" onKeyDown={moveFocus} className="hidden gap-3 lg:grid">
        {professions.map((profession, index) => tab(profession, index, "desktop"))}
      </div>
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={visible ? { opacity: 1 } : undefined}
        transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : panelDelay }}
        id="profession-panel" role="tabpanel" aria-label={active?.title}
        className="rounded-[20px] bg-[#f1f8f7] px-6 pt-8 pb-8 lg:px-10"
      >
        <ProfessionPanel key={activeKey} profession={active} delay={switched ? 0 : panelDelay + .15} visible={visible} reduced={reduced} />
      </motion.div>
    </div>
    </>
  );
}
