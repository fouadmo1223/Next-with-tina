import Image from "next/image";
import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import LetterRollLink from "@/components/common/LetterRollLink";
import { getLocale } from "next-intl/server";
import { getSiteSettings } from "@/lib/settings";
import { whatsappHref, skipImageOptimizer } from "@/lib/utils";
import DrawnShape from "@/components/common/DrawnShape";

const panelDelay = .8;
const imageDelay = panelDelay + .15;
const itemsDelay = imageDelay + .5;
const elementStagger = .14;
const elementsPerItem = 4;
const elementDelay = (item, element) => itemsDelay + (item * elementsPerItem + element) * elementStagger;

// Every part is optional: a part with no value is simply not shown.
export default async function OffersSection({ heading, intro, cta, whatsappMessage, image, imageAlt = "", offers = [] }) {
  const { whatsapp } = await getSiteSettings(await getLocale());
  const items = offers.filter((offer) => offer.icon || offer.title || offer.description);
  const buttonDelay = elementDelay(items.length, 0);
  const ctaHref = whatsappHref(whatsapp, whatsappMessage);
  const hasPanel = items.length > 0 || cta;

  return (
    <RevealSection aria-labelledby={heading ? "home-offers-heading" : undefined} className="relative isolate overflow-hidden bg-white py-8 lg:py-20">
      <DrawnShape viewBox="0 0 170.798 420.675" className="-top-16 -right-8 w-[150px]" after={buttonDelay + .4}
        d="M0.197473 0.566572C201.035 70.5666 205.933 125.567 107.964 205.567C19.7914 285.567 181.441 340.567 166.746 420.567" />
      <Container>
        {(heading || intro) && (
          <div className="text-center">
            {heading && <Reveal as="h2" id="home-offers-heading" className="text-[clamp(28px,3vw,42px)] leading-[1.35] font-semibold text-[#6c3d8e]">{heading}</Reveal>}
            {intro && <Reveal as="p" delay={.45} className="mx-auto mt-3 max-w-[680px] text-[15px] leading-[1.8] text-[#5d5861]">{intro}</Reveal>}
          </div>
        )}
        {(hasPanel || image) && (
          <div className="relative mt-12">
            <Reveal from="fade" delay={panelDelay} aria-hidden="true" className="absolute inset-0 -z-10 rounded-[20px] bg-[#f3edf7]" />
            <div className={`grid items-end ${hasPanel && image ? "md:grid-cols-[minmax(0,1fr)_minmax(0,48%)]" : ""}`}>
              {hasPanel && (
                <div className="px-6 py-8 lg:ps-10 lg:pe-4 lg:py-10">
                  {items.length > 0 && (
                    <ul>
                      {items.map((offer, index) => (
                        <li key={offer.key ?? index} className="relative py-5 first:pt-0">
                          <div className="flex items-start gap-4">
                            {offer.icon && (
                              <Reveal delay={elementDelay(index, 0)} className="shrink-0">
                                <Image src={offer.icon} alt="" width={64} height={64} unoptimized={skipImageOptimizer(offer.icon)} className="size-16 object-contain" />
                              </Reveal>
                            )}
                            <div>
                              {offer.title && <Reveal as="h3" delay={elementDelay(index, 1)} className="text-[20px] leading-[1.4] font-bold text-[#6c3d8e]">{offer.title}</Reveal>}
                              {offer.description && <Reveal as="p" delay={elementDelay(index, 2)} className="mt-1.5 text-[14px] leading-[1.8] text-[#5d5861]">{offer.description}</Reveal>}
                            </div>
                          </div>
                          {index < items.length - 1 && (
                            <Reveal from="clipRight" duration={.5} delay={elementDelay(index, 3)} aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[#e0d1ed]" />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {cta && (
                    <Reveal delay={buttonDelay} className="mt-2">
                      <LetterRollLink still href={ctaHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-[11px] border border-[#85b7bc] bg-[#85b7bc] px-8 py-3 text-[14px] font-bold text-white transition-colors hover:border-[#6c3d8e] hover:bg-transparent hover:text-[#6c3d8e] focus-visible:border-[#6c3d8e] focus-visible:bg-transparent focus-visible:text-[#6c3d8e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#884fb4]">{cta}</LetterRollLink>
                    </Reveal>
                  )}
                </div>
              )}
              {/* The original PNG has about 5% empty space at the bottom, so the shift stands the people on the panel's edge. */}
              {image && (
                <Reveal from="clipUp" waitForImage duration={1} delay={imageDelay} ease={[0.65, 0, 0.35, 1]} className="relative mx-auto aspect-square w-full max-w-[576px] translate-y-[5%] md:-mt-[90px]">
                  <Image src={image} alt={imageAlt} fill sizes="(max-width: 767px) 90vw, 576px" unoptimized={skipImageOptimizer(image)} className="object-contain object-bottom" />
                </Reveal>
              )}
            </div>
          </div>
        )}
      </Container>
    </RevealSection>
  );
}
