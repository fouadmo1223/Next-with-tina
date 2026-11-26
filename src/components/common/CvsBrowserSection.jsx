import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import CvsBrowser from "@/components/common/CvsBrowser";
import { LazyCvsBrowser } from "@/components/pages/home/LazyHomeWidgets";
import DrawnShape from "@/components/common/DrawnShape";

// `compact` is the country pages' version: a white background and the smaller CV card. `paged` is the CVs page's: a white background and a grid of pages.
// `search` (a server function) makes the filter bar search the CV files on the server instead of filtering `cvs` in the browser.
// Every part is optional: a part with no value is simply not shown.
// In `compact`, `browseHref` and `askHref` set where the two buttons under the cards go.
export default function CvsBrowserSection({ heading, intro, cvs = [], filters, labels, compact, paged, hideActions, search, loadPage, pagination, browseHref, askHref, defer = false }) {
  const Browser = defer ? LazyCvsBrowser : CvsBrowser;
  return (
    <RevealSection amount={paged ? .05 : undefined} aria-labelledby={heading ? "home-cvs-heading" : undefined} className={`relative isolate overflow-hidden ${compact || paged ? "bg-white" : "bg-[#f6f1fa]"} py-8 lg:py-20`}>
      <DrawnShape viewBox="0 0 260 600" opacity={.6} fill className="-right-16 bottom-0 w-[220px]" after={2.2}
        d="M260 0C7.99509 15 -18.5317 130 114.102 220C246.737 310 -51.6903 370 7.99508 485C41.1536 560 133.998 590 260 600V0Z" />
      <Container>
        {(heading || intro) && (
          <div className="text-center">
            {heading && <Reveal as="h2" id="home-cvs-heading" className="text-[clamp(28px,3vw,42px)] leading-[1.35] font-semibold text-[#6c3d8e]">{heading}</Reveal>}
            {intro && <Reveal as="p" delay={.45} className={`mx-auto mt-3 ${compact || paged ? "max-w-[860px]" : "max-w-[620px]"} text-[15px] leading-[1.8] text-[#5d5861]`}>{intro}</Reveal>}
          </div>
        )}
        <Browser cvs={cvs} filters={filters} labels={labels} compact={compact} paged={paged} hideActions={hideActions} search={search} loadPage={loadPage} pagination={pagination} {...(browseHref && { browseHref })} {...(askHref && { askHref })} />
      </Container>
    </RevealSection>
  );
}
