import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/animation/Reveal";
import GradientLink from "@/components/common/GradientLink";
import { skipImageOptimizer } from "@/lib/utils";

const textStagger = .12;

// Every part is optional: a part with no value is simply not shown, and without `href` the card isn't a link.
export default function ServiceCard({ href, image, title, description, points = [], cta, delay }) {
  const textDelay = (step) => delay + .2 + step * textStagger;

  return (
    <Reveal as="article" duration={.7} delay={delay}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-[16px] border-t-[7px] border-[#85b7bc] bg-[#f3edf7] p-6 shadow-[0_8px_24px_-16px_rgba(45,30,56,0.3)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_-18px_rgba(45,30,56,0.55)] focus-within:-translate-y-1 lg:px-8 lg:pt-7"
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#6c3d8e_0%,#3b234b_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
      {title && <Reveal as="h3" duration={.5} delay={textDelay(0)} className="text-[22px] leading-[1.4] font-bold text-[#6c3d8e] transition-colors duration-300 group-hover:text-white group-focus-within:text-white lg:text-[24px]">{title}</Reveal>}
      {description && <Reveal as="p" duration={.5} delay={textDelay(1)} className="mt-3 max-w-[400px] text-[15px] leading-[1.8] text-[#5d5861] transition-colors duration-300 group-hover:text-white/90 group-focus-within:text-white/90">{description}</Reveal>}
      <div className="mt-4 flex flex-1 items-end justify-between gap-4 max-sm:flex-col max-sm:items-stretch">
        <div className="shrink-0">
          {points.length > 0 && (
            <ul className="space-y-2.5">
              {points.map((point, pointIndex) => (
                <Reveal as="li" key={`${pointIndex}-${point}`} duration={.5} delay={textDelay(2 + pointIndex)} className="flex items-center gap-2 text-[14px] text-[#5d5861] transition-colors duration-300 group-hover:text-white/90 group-focus-within:text-white/90">
                  <Image src="/home/services-included.svg" alt="" width={18} height={18} className="size-[18px] shrink-0" />
                  {point}
                </Reveal>
              ))}
            </ul>
          )}
          {cta && href && (
            <Reveal duration={.5} delay={textDelay(2 + points.length)} className="relative z-10 mt-5 w-fit">
              <GradientLink href={href} className="group-focus-within:focus-visible:outline-white">{cta}</GradientLink>
            </Reveal>
          )}
        </div>
        {image && (
          <div className="relative h-[170px] min-w-0 flex-1 transition-transform duration-300 group-hover:scale-[1.04] max-sm:w-full max-sm:flex-none">
            {/* Dashboard uploads are resized on the live site; see skipImageOptimizer. */}
            <Image src={image} alt="" fill sizes="(max-width: 767px) 80vw, 300px" unoptimized={skipImageOptimizer(image)} className="object-contain sm:ltr:object-right sm:rtl:object-left" />
          </div>
        )}
      </div>
      {href && <Link href={href} aria-hidden="true" tabIndex={-1} className="absolute inset-0" />}
    </Reveal>
  );
}
