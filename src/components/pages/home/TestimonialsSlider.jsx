"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useReveal } from "@/components/animation/Reveal";

const arrowClass = "flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#e0d1ed] bg-white transition-colors hover:border-[#6c3d8e] disabled:cursor-default disabled:opacity-40 disabled:hover:border-[#e0d1ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#884fb4]";

export default function TestimonialsSlider({ header, slides, labels, controlsDelay }) {
  const { visible, reduced } = useReveal();
  const [swiper, setSwiper] = useState(null);
  const [snapIndex, setSnapIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(1);
  const sync = (instance) => {
    setSnapIndex(instance.snapIndex);
    setSnapCount(instance.snapGrid.length);
  };
  const reveal = {
    initial: reduced ? false : { opacity: 0, filter: "blur(12px)" },
    animate: visible ? { opacity: 1, filter: "blur(0px)" } : undefined,
    transition: { duration: reduced ? 0 : .6, delay: reduced ? 0 : controlsDelay, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        {header}
        {/* Like the dots, the arrows only show when there are more cards than fit on screen. */}
        {snapCount > 1 && <motion.div {...reveal} className="flex items-center gap-3">
          <button type="button" aria-label={labels.previous} disabled={snapIndex === 0} onClick={() => swiper?.slidePrev()} className={arrowClass}>
            <Image src="/home/profiles-chevron-left.svg" alt="" width={20} height={20} className="size-5 rtl:rotate-180" />
          </button>
          <button type="button" aria-label={labels.next} disabled={snapIndex === snapCount - 1} onClick={() => swiper?.slideNext()} className={arrowClass}>
            <Image src="/home/profiles-chevron-right.svg" alt="" width={20} height={20} className="size-5 rtl:rotate-180" />
          </button>
        </motion.div>}
      </div>
      <Swiper className="mt-8" spaceBetween={20} onSwiper={(instance) => { setSwiper(instance); sync(instance); }} onSlideChange={sync} onSnapGridLengthChange={sync}
        slidesPerView={1} breakpoints={{ 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}>
        {slides.map((slide, index) => <SwiperSlide key={index} className="!h-auto">{slide}</SwiperSlide>)}
      </Swiper>
      {snapCount > 1 && (
        <motion.div {...reveal} className="mt-6 flex items-center justify-center gap-1">
          {Array.from({ length: snapCount }, (_, index) => (
            <button key={index} type="button" aria-label={labels.goTo[index]} aria-current={index === snapIndex || undefined} onClick={() => swiper?.slideTo(index)}
              className={`flex size-6 cursor-pointer items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-[#884fb4] ${index === snapIndex ? "border-[#6c3d8e]" : "border-transparent"}`}>
              <span className={`size-2 rounded-full transition-colors ${index === snapIndex ? "bg-[#6c3d8e]" : "bg-[#d5cbdc]"}`} />
            </button>
          ))}
        </motion.div>
      )}
    </>
  );
}
