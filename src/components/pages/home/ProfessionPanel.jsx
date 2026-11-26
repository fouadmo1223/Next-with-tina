import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { skipImageOptimizer } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1];
const drawEase = [0.65, 0, 0.35, 1];
const textStagger = .1;
const arcsDelay = .9;
const arcStagger = .3;
const arcs = [
  { viewBox: "0 0 66.1435 83.1442", className: "top-2 -right-5", d: "M1.07197 1.07197C47.7776 4.86885 74.9644 37.7751 61.7196 82.072" },
  { viewBox: "0 0 66.1435 76.1442", className: "-bottom-4 -left-5 rotate-180", d: "M1.07197 1.07197C47.7776 4.54072 74.9644 34.6032 61.7195 75.072" },
];

export default function ProfessionPanel({ profession, delay, visible, reduced }) {
  const { image } = profession;
  // Without a photo there is nothing to wait for.
  const [loaded, setLoaded] = useState(!image?.src);
  const steps = profession.steps ?? [];
  const imageRef = useRef(null);
  const ready = visible && (loaded || reduced);
  useEffect(() => {
    if (imageRef.current?.complete) setLoaded(true);
  }, []);
  const photo = image?.src && <Image ref={imageRef} src={image.src} alt={profession.imageAlt ?? ""} width={image.width} height={image.height} sizes={image.sizes} loading="eager" unoptimized={skipImageOptimizer(image.src)} onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} className={`absolute h-auto ${image.className}`} />;
  const reveal = (startDelay) => ({
    initial: reduced ? false : { opacity: 0, filter: "blur(10px)" },
    animate: visible ? { opacity: 1, filter: "blur(0px)" } : undefined,
    transition: { duration: reduced ? 0 : .5, delay: reduced ? 0 : startDelay, ease },
  });

  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
      <div>
        {profession.stepsTitle && <motion.h3 {...reveal(delay)} className="mb-6 text-[22px] leading-[1.4] font-bold text-[#6c3d8e] lg:text-[24px]">{profession.stepsTitle}</motion.h3>}
        {steps.length > 0 && <ol className="space-y-5">
          {steps.map((step, index) => (
            <motion.li key={step.key ?? index} {...reveal(delay + (index + 1) * textStagger)} className="flex gap-3">
              <Image src="/home/professions-icon-park-outline-correct.svg" alt="" width={20} height={20} className="mt-1.5 size-5 shrink-0" />
              <div>
                {step.title && <h4 className="text-[17px] leading-[1.5] font-bold text-[#2f2835]">{step.title}</h4>}
                {step.description && <p className="mt-1 text-[14px] leading-[1.7] text-[#5d5861]">{step.description}</p>}
              </div>
            </motion.li>
          ))}
        </ol>}
      </div>
      <div className="relative mx-auto h-[310px] w-full max-w-[320px]">
        {arcs.map((arc, index) => (
          <svg key={arc.d} viewBox={arc.viewBox} fill="none" aria-hidden="true" className={`pointer-events-none absolute h-auto w-[52px] overflow-visible ${arc.className}`}>
            <motion.path d={arc.d} stroke="#E0D1ED" strokeWidth="2.14384" strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={ready ? { pathLength: 1, opacity: 1 } : undefined}
              transition={{
                pathLength: { duration: reduced ? 0 : .7, delay: reduced ? 0 : delay + arcsDelay + index * arcStagger, ease: drawEase },
                opacity: { duration: 0, delay: reduced ? 0 : delay + arcsDelay + index * arcStagger },
              }}
            />
          </svg>
        ))}
        <motion.div
          initial={reduced ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
          animate={ready ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
          transition={{ duration: reduced ? 0 : .8, delay: reduced ? 0 : delay + .1, ease: drawEase }}
          className="absolute inset-0"
        >
          <div className="absolute inset-x-0 bottom-0 h-[260px] overflow-hidden rounded-[20px] bg-[#e0d1ed]">
            {!image?.cutout && photo}
          </div>
          {image?.cutout && photo}
        </motion.div>
        {profession.badge && <motion.p
          initial={reduced ? false : { opacity: 0, filter: "blur(10px)", y: 0 }}
          animate={ready ? { opacity: 1, filter: "blur(0px)", y: reduced ? 0 : [0, -7, 0] } : undefined}
          transition={{
            opacity: { duration: reduced ? 0 : .5, delay: reduced ? 0 : delay + .6, ease },
            filter: { duration: reduced ? 0 : .5, delay: reduced ? 0 : delay + .6, ease },
            y: { duration: 3.2, delay: delay + 1.1, ease: "easeInOut", repeat: reduced ? 0 : Infinity },
          }}
          className="absolute top-3 -left-3 z-10 flex max-w-[120px] items-center gap-2 rounded-[10px] bg-white px-3 py-2 text-[12px] leading-[1.4] font-medium text-[#3d3442] shadow-[0_8px_20px_-10px_rgba(45,30,56,0.35)]"
        >
          <svg width="25" height="35" viewBox="0 0 25 35" fill="none" aria-hidden="true" className="h-[35px] w-[25px] shrink-0"><path d="M10.2537 33.1248H3.82288C3.06485 33.1248 2.33787 32.786 1.80186 32.1829C1.26585 31.5798 0.964722 30.7618 0.964722 29.9088V4.18074C0.964722 3.3278 1.26585 2.5098 1.80186 1.90668C2.33787 1.30356 3.06485 0.964733 3.82288 0.964733H15.2555M15.2555 0.964733C15.7084 0.963484 16.157 1.06316 16.5754 1.25801C16.9939 1.45286 17.3739 1.73902 17.6935 2.09998L22.8211 7.86951C23.1419 8.22917 23.3962 8.65676 23.5694 9.1276C23.7425 9.59844 23.8311 10.1032 23.83 10.6128M15.2555 0.964733V9.00475C15.2555 9.43121 15.4061 9.84022 15.6741 10.1418C15.9421 10.4433 16.3056 10.6128 16.6846 10.6128L23.83 10.6128M23.83 10.6128V20.2608M15.2555 29.9088L18.1137 33.1248L23.83 26.6928" strokeWidth="1.92945" strokeLinecap="round" stroke="#6c3d8e" /></svg>
          {profession.badge}
        </motion.p>}
      </div>
    </div>
  );
}
