import { Fragment } from "react";
import Image from "next/image";
import DoubleWaveLink from "@/components/common/DoubleWaveLink";
import LetterRollLink from "@/components/common/LetterRollLink";
import Container from "@/components/layout/Container";
import heroBackgroundSmall from "../../../public/home/hero-bg-640.webp";
import heroBackgroundMedium from "../../../public/home/hero-bg-1280.webp";
import heroBackgroundLarge from "../../../public/home/hero-bg-1920.webp";
import { skipImageOptimizer } from "@/lib/utils";

export function WordsBlur({ text, startIndex = 0, delay = 0, stagger = .08, duration = .6 }) {
  return <>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">
      {text.split(/\s+/).map((word, index) => <Fragment key={index}>
        {index > 0 && " "}
        <span className="reveal-blur inline-block" style={{ "--reveal-delay": `${delay + (startIndex + index) * stagger}s`, "--reveal-duration": `${duration}s` }}>{word}</span>
      </Fragment>)}
    </span>
  </>;
}

function FloatingPill({ delay, index, className, children }) {
  return <span className={`float-pill ${className}`} style={{ "--reveal-delay": `${delay}s`, "--float-duration": `${3.2 + index * .4}s` }}>{children}</span>;
}

// Line icons for pills that don't bring their own image.
export const HERO_PILL_ICONS = {
  clipboard: <svg className="h-[15px] w-[15px] shrink-0 text-[#a9ced0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2h6v2M9 9h6M9 13h6M9 17h4" /></svg>,
  document: <svg className="h-[15px] w-[15px] shrink-0 text-[#a9ced0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6M8 13h8M8 17h6" /></svg>,
  arrow: <svg className="h-[15px] w-[15px] shrink-0 text-[#a9ced0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>,
};

const accentText = "text-[#a9ced0]";
const wordsIn = (text) => (text ? text.split(/\s+/).length : 0);
const buttonClass = "inline-flex min-h-12 w-full items-center sm:w-auto justify-center rounded-[11px] border px-[25px] py-3 text-[14px] font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:text-[clamp(12px,0.95vw,18px)] md:max-[1100px]:min-h-[42px] md:max-[1100px]:px-4 md:max-[1100px]:py-[9px]";
const pillClass = "absolute z-[1] flex items-center gap-[7px] whitespace-nowrap rounded-[9px] max-md:max-w-[80vw] max-md:whitespace-normal max-md:leading-[1.3] border border-[#e0d1ed80] bg-white/25 px-3 py-[9px] text-right text-[14px] leading-none font-medium text-white shadow-[0_6px_16px_-6px_#00000012] backdrop-blur-[23.9px] max-md:px-[9px] max-md:py-[7px] max-md:[direction:rtl]";
// Where the first three pills float over the image.
const PILL_SPOTS = ["top-[19%] left-[10%]", "top-[28%] right-[2%] max-md:right-[12%]", "bottom-[26%] left-[15%]"];
// A framed picture keeps its top clear, so its first pill sits low over the picture instead.
const FRAMED_PILL_SPOTS = ["top-[75%] left-[20%]", PILL_SPOTS[1], PILL_SPOTS[2]];

function PillIcon({ icon }) {
  if (!icon) return null;
  if (typeof icon === "string") return <Image src={icon} alt="" width={15} height={15} unoptimized className="h-[15px] w-[15px] shrink-0 object-contain" />;
  return icon;
}

// Every part is optional: a part with no value is simply not shown.
// `image` is a URL or { src, width, height }; `pills` is [{ text, icon }], where icon is an image URL or an element.
// `accentLine` picks which of the two title lines takes the accent colour.
// `framed` is for a complete picture (such as a dashboard upload with its own frame): it's shown whole, centred in the hero's
// height, instead of standing on the bottom edge and running past the top like a cut-out photo.
export default function FloatingPillsHero({ title, titleHighlight, subtitle, cta, ctaHref, ctaSecondary, ctaSecondaryHref, imageAlt = "", pills = [], image, accentLine = "first", framed, contained = false }) {
  const imageProps = typeof image === "string" ? { src: image, width: 1200, height: 976 } : image;
  const shownPills = pills.filter((pill) => pill?.text).slice(0, PILL_SPOTS.length);
  const showCta = cta && ctaHref;
  const showSecondary = ctaSecondary && ctaSecondaryHref;

  const firstWords = wordsIn(title);
  const wordCount = firstWords + wordsIn(titleHighlight);
  const descriptionAt = Math.max(wordCount - 1, 0) * .08 + .6;
  const buttonsAt = descriptionAt + Math.max(wordsIn(subtitle) - 1, 0) * .035 + .45;
  const pillsAt = Math.max(.9, buttonsAt + .16 + .5) + .12;

  const content = <>
      <div dir={contained ? "auto" : undefined} className={contained
        ? "relative z-[2] w-full pt-4 pb-2 text-center md:max-w-[600px] md:py-10 md:text-start"
        : "relative z-[2] w-auto px-6 pt-12 pb-6 text-center md:absolute md:top-1/2 md:right-[10%] md:w-[39%] md:-translate-y-1/2 md:p-0 md:text-start md:max-[1100px]:right-[6%] md:max-[1100px]:w-[44%] min-[1100px]:rtl:right-[7%]"}>
        {(title || titleHighlight) && (
          <h1 id="hero-heading" className="m-0 text-[clamp(27px,6vw,42px)] leading-[135%] font-[750] tracking-[-0.025em] md:text-[42px]">
            {title && <span className={accentLine === "first" ? accentText : undefined}><WordsBlur text={title} /></span>}
            {title && titleHighlight && <br />}
            {titleHighlight && <span className={accentLine === "second" ? accentText : undefined}><WordsBlur text={titleHighlight} startIndex={firstWords} /></span>}
          </h1>
        )}
        {subtitle && (
          <p className="mx-auto mt-[18px] max-w-[480px] text-base md:text-[17px] leading-[180%] font-normal text-[#F3EDF7] md:mx-0 md:mt-[26px] md:max-w-none md:max-[1100px]:mt-4">
            <WordsBlur text={subtitle} delay={descriptionAt} stagger={.035} duration={.45} />
          </p>
        )}
        {(showCta || showSecondary) && (
          <div className="mt-[22px] flex flex-wrap justify-center gap-3 md:mt-7 md:justify-start md:max-[1100px]:mt-5 md:max-[1100px]:gap-2">
            {showCta && <LetterRollLink cssDelay={buttonsAt} href={ctaHref} className={`${buttonClass} border-[#85b7bc] bg-[#85b7bc] transition-colors hover:border-white hover:bg-transparent focus-visible:border-white focus-visible:bg-transparent`}>{cta}</LetterRollLink>}
            {showSecondary && <DoubleWaveLink cssDelay={buttonsAt + (showCta ? .16 : 0)} href={ctaSecondaryHref} className={`${buttonClass} border-[#b7a0c5] bg-[#ffffff05]`}>{ctaSecondary}</DoubleWaveLink>}
          </div>
        )}
      </div>
      {imageProps?.src && (
        <div className={contained
          ? "relative z-[1] mx-auto w-full min-w-0 self-end [direction:ltr] md:mx-0"
          : framed
          ? "relative mx-auto w-full max-w-[520px] px-6 pb-10 [direction:ltr] md:absolute md:top-1/2 md:left-[4%] md:max-w-none md:-translate-y-1/2 md:p-0 md:max-[1100px]:left-[2%]"
          : "relative -bottom-px -mx-[10%] -mt-3 w-[120%] [direction:ltr] md:absolute md:-left-[2%] md:mx-0 md:mt-0 md:w-auto md:max-[1100px]:-left-[6%]"}>
          {/* Dashboard uploads are resized on the live site; see skipImageOptimizer. */}
          {/* On larger screens the image fits the hero's height whatever its shape, and never grows past the space beside the text. */}
          <div><Image src={imageProps.src} alt={imageAlt} width={imageProps.width} height={imageProps.height} loading="eager" fetchPriority="high" sizes="(max-width: 767px) 100vw, 60vw" unoptimized={skipImageOptimizer(imageProps.src)}
            className={contained
              ? "block h-auto w-full object-contain object-bottom md:max-h-[calc(100svh-100px)] min-[2000px]:h-[40svh] min-[2000px]:max-h-[40svh]"
              : framed
              ? "block h-auto w-full md:h-[calc((100vh-100px)*.86)] md:w-auto md:max-w-[50vw] md:object-contain md:max-[1100px]:max-w-[48vw]"
              : "block h-auto w-full md:h-[calc((100vh-100px)*1.05)] md:w-auto md:max-w-[62vw] md:object-contain md:object-bottom md:max-[1100px]:max-w-[68vw]"} /></div>
          {shownPills.map((pill, index) => (
            <FloatingPill key={index} delay={pillsAt + index * .16} index={index} className={`${pillClass} ${(framed ? FRAMED_PILL_SPOTS : PILL_SPOTS)[index]}`}>
              <PillIcon icon={pill.icon} />{pill.text}
            </FloatingPill>
          ))}
        </div>
      )}
    </>;

  return (
    <section className={`relative isolate overflow-hidden bg-[#3b234b] text-white ${contained ? "" : "md:h-[calc(100vh-100px)]"}`} aria-labelledby={title || titleHighlight ? "hero-heading" : undefined}>
      <img src={heroBackgroundLarge.src} srcSet={`${heroBackgroundSmall.src} 640w, ${heroBackgroundMedium.src} 1280w, ${heroBackgroundLarge.src} 1920w`} sizes="100vw" width={1920} height={869} alt="" loading="eager" fetchPriority="high" className="absolute inset-0 -z-10 size-full object-cover object-center ltr:-scale-x-100 max-md:object-left max-md:opacity-60" />
      {contained ? <Container className="relative z-[2] grid max-[1999px]:min-h-[calc(100svh-100px)] grid-cols-1 items-center gap-6 pt-10 pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-10 md:py-0 min-[2000px]:h-[45svh]">{content}</Container> : content}
    </section>
  );
}
