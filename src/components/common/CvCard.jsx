import Image from "next/image";
import { motion } from "motion/react";
import { ROUTES } from "@/constants";
import DoubleWaveLink from "@/components/common/DoubleWaveLink";
import GradientLink from "@/components/common/GradientLink";
import CvQuickStats from "@/components/common/CvQuickStats";
import { skipImageOptimizer } from "@/lib/utils";

// Same colours and angles as public/home/cv-bg.svg; each layer swings to the other's angle.
const backLayers = [
  { color: "#E0D1ED", from: -2.9, to: 4.8 },
  { color: "#BEDDDF", from: 4.8, to: -2.9 },
];

// `compact` is the country pages' card: only the price boxes, with no icons, and two actions.
export default function CvCard({ cv, labels, delay, visible, reduced, compact }) {
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, filter: "blur(12px)" }}
      animate={visible ? { opacity: 1, filter: "blur(0px)" } : undefined}
      transition={{ duration: reduced ? 0 : .7, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative isolate"
    >
      {backLayers.map((layer) => (
        <motion.span key={layer.color} aria-hidden="true"
          initial={{ rotate: layer.from }}
          animate={visible && !reduced ? { rotate: [layer.from, layer.to] } : undefined}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: delay + .7 }}
          className="pointer-events-none absolute -inset-x-1.5 -inset-y-1 -z-10 rounded-[19px]"
          style={{ backgroundColor: layer.color }}
        />
      ))}
      <div className="flex flex-col rounded-[18px] bg-white px-4 pb-4 pt-12 text-center shadow-[0_10px_26px_-18px_rgba(45,30,56,0.35)]">
        <span className="absolute -top-7 left-1/2 size-[72px] -translate-x-1/2 overflow-hidden rounded-full border-2 border-[#6c3d8e] bg-white">
          {cv.avatar && <Image src={cv.avatar} alt="" width={72} height={72} sizes="72px" unoptimized={skipImageOptimizer(cv.avatar)} className="size-full object-contain " />}
        </span>
        {cv.name && <h3 className="text-[19px] leading-[1.4] font-bold text-[#6c3d8e]">{cv.name}</h3>}
        {cv.stats?.profession?.value && <p className="mt-1 text-[14px] text-[#5d5861]">{cv.stats.profession.value}</p>}
        {labels.sample && <p className="mx-auto mt-2 rounded-full bg-[#f3edf7] px-3 py-1 text-[11px] font-medium text-[#6c3d8e]">{labels.sample}</p>}
        {compact ? (
          <>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-start">
              {[{ key: "cost", tone: "bg-[#f3edf7]" }, { key: "installment", tone: "bg-[#eef7f5]" }].filter(({ key }) => cv.price?.[key]).map(({ key, tone }, index, boxes) => (
                <div key={key} className={`rounded-[10px] px-2.5 py-2.5 ${tone} ${boxes.length === 1 ? "col-span-2" : ""}`}>
                  <dt className="text-[12px] leading-[1.4] text-[#5d5861]">{labels[key]}</dt>
                  <dd className="mt-1 text-[13px] leading-[1.4] font-bold text-[#2f2835]">{cv.price[key]}</dd>
                </div>
              ))}
            </dl>
            <GradientLink href={cv.slug ? `/request?cv=${encodeURIComponent(cv.slug)}` : "/request"} className="mt-4 w-full justify-center">{labels.startRequest}</GradientLink>
            <DoubleWaveLink ready={visible} delay={delay} href={ROUTES.cv(cv.slug)} className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-[10px] border border-[#6c3d8e] px-6 py-2.5 text-sm font-semibold text-[#6c3d8e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#884fb4]">{labels.viewDetails}</DoubleWaveLink>
          </>
        ) : (
          <>
            <div className="mt-4 text-start"><CvQuickStats stats={cv.stats} /></div>
            <GradientLink href={ROUTES.cv(cv.slug)} className="mt-4 w-full justify-center">{labels.viewCv}</GradientLink>
          </>
        )}
      </div>
    </motion.article>
  );
}
