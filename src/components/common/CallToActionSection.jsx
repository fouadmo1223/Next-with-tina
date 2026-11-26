import Image from "next/image";
import { getLocale } from "next-intl/server";
import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import { ROUTES } from "@/constants";
import { getSiteSettings } from "@/lib/settings";
import { whatsappHref, skipImageOptimizer } from "@/lib/utils";
import DoubleWaveLink from "@/components/common/DoubleWaveLink";
import LetterRollLink from "@/components/common/LetterRollLink";

const clipEase = [0.65, 0, 0.35, 1];
const buttonBase =
  "inline-flex min-h-12 w-full items-center justify-center rounded-[11px] border px-[25px] py-3 text-[14px] font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto";
const firstButton = "border-[#85b7bc] bg-[#85b7bc] transition-colors hover:border-white hover:bg-transparent focus-visible:border-white focus-visible:bg-transparent";
const otherButton = "border-[#e0d1ed] bg-[#ffffff05]";

// `buttons` (dashboard pages) is the full list in order, as { key, label, href }; external links open in a new tab.
// Without it, the show* props pick from the built-in buttons. Every part is optional: a part with no value is simply not shown.
export default async function CallToActionSection({
  buttons: buttonList,
  heading,
  headingSize = "text-[clamp(28px,3.2vw,46px)]",
  description,
  showCvs = false,
  cvsLabel,
  showRequest = false,
  requestLabel,
  requestHref = "/request",
  showContact = false,
  contactLabel,
  showWhatsapp = false,
  whatsappLabel,
  whatsappMessage,
  image,
  imageAlt = "",
}) {
  const locale = await getLocale();
  const { whatsapp } = await getSiteSettings(locale);
  const buttons = buttonList ? buttonList.filter((button) => button.label && button.href).map((button) => (
    /^https?:\/\//.test(button.href) ? { ...button, target: "_blank", rel: "noreferrer" } : button
  )) : [
    showCvs && { key: "cvs", label: cvsLabel, href: ROUTES.cvs },
    showRequest && { key: "request", label: requestLabel, href: requestHref },
    showContact && { key: "contact", label: contactLabel, href: ROUTES.contact },
    showWhatsapp && { key: "whatsapp", label: whatsappLabel, href: whatsappHref(whatsapp, whatsappMessage), target: "_blank", rel: "noreferrer" },
  ].filter(Boolean);

  return (
    <RevealSection
      aria-labelledby={heading ? "home-cta-heading" : undefined}
      className="relative isolate bg-white pt-20 pb-12 sm:pt-24 sm:pb-14 lg:py-0"
    >
      <Reveal
        from={locale === "ar" ? "clipRight" : "clipLeft"}
        waitForImage
        duration={1.1}
        ease={clipEase}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 bottom-0 -z-10 overflow-hidden lg:top-10"
      >
        <Image
          src="/home/sec3-bg.svg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </Reveal>
      <Container className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,50%)] lg:gap-8">
        <div className="text-center text-white lg:pt-10 lg:ps-[20%]">
          {heading && <Reveal
            as="h2"
            duration={0.6}
            delay={0.7}
            id="home-cta-heading"
            className="text-[clamp(28px,3.2vw,46px)] text-[#BEDDDF] leading-[1.35] font-semibold"
          >
            {heading}
          </Reveal>}
          {description && <Reveal
            as="p"
            delay={1}
            className="mx-auto mt-3 max-w-[560px] text-[16px] leading-[1.8] text-white/90"
          >
            {description}
          </Reveal>}
          {buttons.length > 0 && <div className="mt-6 flex flex-wrap justify-center gap-3">
            {buttons.map(({ key, label, ...link }, index) => {
              const Button = index === 0 ? LetterRollLink : DoubleWaveLink;
              return (
                <Reveal key={key} delay={1.3 + index * 0.15} className="w-full sm:w-auto">
                  <Button still {...link} className={`${buttonBase} ${index === 0 ? firstButton : otherButton}`}>
                    {label}
                  </Button>
                </Reveal>
              );
            })}
          </div>}
        </div>
        {image && <Reveal
          from="clipDown"
          waitForImage
          duration={1}
          delay={0.5}
          ease={clipEase}
          className="relative mx-auto aspect-[887/769] w-full max-w-[640px] lg:mx-0 lg:justify-self-end"
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1023px) 92vw, 640px"
            unoptimized={skipImageOptimizer(image)}
            className="object-contain"
          />
        </Reveal>}
      </Container>
    </RevealSection>
  );
}
