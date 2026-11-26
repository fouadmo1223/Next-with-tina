import Image from "next/image";
import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import AboutWhatsappButton from "@/components/common/AboutWhatsappButton";
import DrawnArc from "@/components/common/DrawnArc";
import PhotoCalloutLink from "@/components/common/PhotoCalloutLink";
import RollingHeading from "@/components/common/RollingHeading";
import { skipImageOptimizer } from "@/lib/utils";


// Every part is optional: a part with no value is simply not shown.
// `ctaHref` can be a page or a full URL (WhatsApp opens in a new tab); `photoCtaHref` is where the photo callout leads.
export default function AboutCompanySection({ eyebrow, headingStart, headingAccent, bodyOne, bodyTwo, cta, ctaHref, photosLabel, photoCta, photoCtaHref, consultationImage, consultationAlt = "", workerImage, workerAlt = "" }) {
  const showPhotos = consultationImage || workerImage;
  const showCallout = photoCta && photoCtaHref;

  return (
    <RevealSection amount={.45} aria-labelledby={headingStart || headingAccent ? "home-about-heading" : undefined} className="relative isolate overflow-x-clip bg-white py-8 text-[#3d3442] lg:py-28">
      <Image src="/home/about-side.png" alt="" width={155} height={543} aria-hidden="true" className="pointer-events-none absolute top-1/2 -start-10 -z-10 h-auto w-[110px] -translate-y-1/2 ltr:-scale-x-100 md:-start-5 md:w-[155px]" />

      <Container className={`grid items-center gap-14 md:gap-10 lg:gap-20 ${showPhotos ? "md:grid-cols-[1fr_48%]" : ""}`}>
        {showPhotos && (
          <div className="relative order-2 mx-auto h-[360px] w-full max-w-[520px] [direction:ltr] md:h-[440px] lg:h-[490px]" aria-label={photosLabel}>
            {consultationImage && <>
              <Reveal from="fadeUp" duration={.55} delay={2.28} className="absolute top-[2%] left-[4%] z-0 h-[76%] w-[49%] rounded-[30px] bg-[#85b7bc]" aria-hidden="true" />
              <Reveal from="clipRight" waitForImage duration={.8} delay={1.45} className="absolute top-[6%] left-[4%] z-10 h-[76%] w-[80%] overflow-hidden rounded-[24px]">
                <Image src={consultationImage} alt={consultationAlt} fill sizes="(max-width: 767px) 65vw, 35vw" unoptimized={skipImageOptimizer(consultationImage)} className="object-cover" />
              </Reveal>
            </>}

            <DrawnArc delay={2.85} className="pointer-events-none absolute top-[-2%] left-[68%] z-0 w-[22%]" />
            <DrawnArc delay={3.35} className="pointer-events-none absolute bottom-[-6%] left-[49%] z-0 w-[22%] rotate-180 lg:bottom-[-15%]" />
            {workerImage && <>
              <Reveal from="fadeUp" duration={.55} delay={2.5} className="absolute top-[52%] right-[0%] z-0 h-[45%] w-[47%] rounded-[22px] bg-[#884fb4]" aria-hidden="true" />
              <Reveal from="clipRight" waitForImage duration={.8} delay={1.68} className="absolute top-[55%] right-[0%] z-20 h-[45%] w-[47%] overflow-hidden rounded-[20px] border-[5px] border-white">
                <Image src={workerImage} alt={workerAlt} fill sizes="(max-width: 767px) 45vw, 24vw" unoptimized={skipImageOptimizer(workerImage)} className="object-cover object-center" />
              </Reveal>
            </>}

            {showCallout && <PhotoCalloutLink href={photoCtaHref} delay={2.65}>{photoCta}</PhotoCalloutLink>}
          </div>
        )}

        <div dir="auto" className="order-1 text-center md:text-start">
          {eyebrow && <Reveal as="p" from="fadeUp" duration={.55} className="mb-3 text-sm font-semibold text-[#884fb4]">{eyebrow}</Reveal>}
          {(headingStart || headingAccent) && <RollingHeading id="home-about-heading" start={headingStart} accent={headingAccent} delay={.25} />}
          {bodyOne && <Reveal as="p" from="fadeUp" duration={.55} delay={.55} className="mt-7 text-[18px] leading-[1.9] text-[#57525C]">{bodyOne}</Reveal>}
          {bodyTwo && <Reveal as="p" from="fadeUp" duration={.55} delay={.75} className="mt-4 text-[18px] leading-[1.9] text-[#57525C]">{bodyTwo}</Reveal>}
          {cta && ctaHref && <Reveal from="fadeUp" duration={.55} delay={1.05} className="inline-block"><AboutWhatsappButton href={ctaHref}>{cta}</AboutWhatsappButton></Reveal>}
        </div>
      </Container>
    </RevealSection>
  );
}
