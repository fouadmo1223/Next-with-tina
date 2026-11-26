import Image from "next/image";
import { getLocale } from "next-intl/server";
import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import LetterRollLink from "@/components/common/LetterRollLink";
import { ROUTES } from "@/constants";
import RequirementsFolderConnector from "@/components/common/RequirementsFolderConnector";
import DrawnCheckMarker from "@/components/common/DrawnCheckMarker";
import { skipImageOptimizer } from "@/lib/utils";

const clipEase = [0.65, 0, 0.35, 1];
const folderClip = .7;
const titleAfter = .55;
const itemsAfter = .85;
const itemStep = .47;
const markerAfter = .17;
const markAfter = .36;
const itemsEnd = (count) => itemsAfter + (count - 1) * itemStep + markAfter + .47;
const lineDuration = .6;

const documentsFolder = { image: "/home/folder1", line: "bg-[#e0d1ed]" };
const proceduresFolder = { image: "/home/folder2", numbered: true, line: "bg-[#bedddf]" };
const firstFolderDelay = 1.6;

function ChecklistIcon() {
  return (
    <svg viewBox="0 0 40 48" fill="none" aria-hidden="true" className="h-12 w-10 shrink-0" stroke="#6C3D8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M25 2H7a5 5 0 0 0-5 5v34a5 5 0 0 0 5 5h26a5 5 0 0 0 5-5V15L25 2Z" />
      <path d="M25 2v13h13M10 24l2.5 2.5L17 22M10 35l2.5 2.5L17 33M22 25h8M22 36h8" />
    </svg>
  );
}

function Folder({ folder, from, delay, locale }) {
  return (
    <Reveal as="article" from={from} duration={folderClip} delay={delay} ease={clipEase} className="relative isolate flex flex-col px-[7%] pt-[17%] pb-[9%] sm:pt-[13%] sm:pb-[7%] lg:min-h-[560px] 2xl:min-h-[616px] 3xl:min-h-[710px]">
      {/* The fragment lets the SVG stretch when the content is taller than its natural shape. */}
      <img src={`${folder.image}${locale === "ar" ? "" : "-en"}.svg#svgView(preserveAspectRatio(none))`} alt="" className="pointer-events-none absolute inset-0 -z-10 size-full" />
      {(folder.title || folder.subtitle || folder.icon !== "") && <Reveal duration={.45} delay={delay + titleAfter} className="flex items-center justify-between gap-4 rounded-[14px] bg-white/75 p-4">
        <div>
          {folder.title && <h3 className="text-[22px] leading-[1.4] font-bold text-[#6c3d8e] lg:text-[28px]">{folder.title}</h3>}
          {folder.subtitle && <p className="mt-0.5 text-[13px] text-[#5d5861]">{folder.subtitle}</p>}
        </div>
        {/* A dashboard icon replaces the built-in checklist drawing. */}
        {folder.icon === undefined ? <ChecklistIcon /> : folder.icon && <Image src={folder.icon} alt="" width={48} height={48} unoptimized={skipImageOptimizer(folder.icon)} className="size-12 shrink-0 object-contain" />}
      </Reveal>}
      <ol className="mt-3 flex flex-1 flex-col">
        {folder.items.map((item, index) => {
          const itemDelay = delay + itemsAfter + index * itemStep;
          return (
            <li key={item.key ?? index} className="relative flex flex-1 items-center gap-3 py-3">
              <DrawnCheckMarker number={folder.numbered ? index + 1 : undefined} delay={folder.numbered ? itemDelay : itemDelay + markerAfter} markDelay={folder.numbered ? itemDelay + markerAfter : itemDelay + markAfter} />
              <Reveal as="span" duration={.35} delay={folder.numbered ? itemDelay + markAfter : itemDelay} className="text-[15px] leading-[1.5] font-semibold text-[#2f2835] lg:text-[24px]">{item.label}</Reveal>
              {index < folder.items.length - 1 && <Reveal from="fade" duration={.3} delay={itemDelay + markAfter} aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-px ${folder.line}`} />}
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}

// Every part is optional: a part with no value is simply not shown.
export default async function RequirementsSection({ heading, intro, cta, ctaHref = ROUTES.requirements, documents, procedures }) {
  const locale = await getLocale();
  const lineDelay = firstFolderDelay + itemsEnd(Math.max(documents?.items?.length ?? 0, 1));
  const secondFolderDelay = lineDelay + lineDuration;

  return (
    <RevealSection aria-labelledby={heading ? "home-requirements-heading" : undefined} className="relative isolate overflow-hidden bg-white py-8 text-white lg:py-20">
      <Reveal from={locale === "ar" ? "clipLeft" : "clipRight"} waitForImage duration={.95} ease={clipEase} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Image src="/home/sec2-bg.svg" alt="" fill sizes="100vw" className="object-cover" />
      </Reveal>
      <Container>
        {(heading || intro || cta) && <div className="flex flex-wrap items-end justify-between gap-6">
          {(heading || intro) && <div className="max-w-[640px]">
            {heading && <Reveal as="h2" duration={.5} delay={.5} id="home-requirements-heading" className="text-[clamp(28px,3vw,42px)] leading-[1.35] font-semibold">{heading}</Reveal>}
            {intro && <Reveal as="p" delay={.85} className="mt-3 text-[15px] leading-[1.8] text-white/90">{intro}</Reveal>}
          </div>}
          {cta && ctaHref && <Reveal delay={1.2}>
            <LetterRollLink still href={ctaHref} {...(/^https?:\/\//.test(ctaHref) && { target: "_blank", rel: "noreferrer" })} className="inline-flex min-h-12 items-center justify-center rounded-[11px] border border-[#85b7bc] bg-[#85b7bc] px-7 py-3 text-[14px] font-bold text-white transition-colors hover:border-white hover:bg-transparent focus-visible:border-white focus-visible:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{cta}</LetterRollLink>
          </Reveal>}
        </div>}
        {(documents || procedures) && <div className={`relative mt-10 grid gap-6 lg:mt-12 lg:gap-8 ${documents && procedures ? "lg:grid-cols-2" : ""}`}>
          {documents && <Folder folder={{ ...documentsFolder, items: [], ...documents }} from="clipDown" delay={firstFolderDelay} locale={locale} />}
          {documents && procedures && <RequirementsFolderConnector delay={lineDelay} duration={lineDuration} className="top-[38%] left-1/2 z-10 hidden h-[46px] w-[55px] -translate-x-1/2 ltr:-scale-x-100 lg:block" />}
          {procedures && <Folder folder={{ ...proceduresFolder, items: [], ...procedures }} from={locale === "ar" ? "clipLeft" : "clipRight"} delay={documents ? secondFolderDelay : firstFolderDelay} locale={locale} />}
        </div>}
      </Container>
    </RevealSection>
  );
}
