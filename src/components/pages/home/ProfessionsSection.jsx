import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import DrawnShape from "@/components/common/DrawnShape";
import { LazyProfessionTabs as ProfessionTabs } from "./LazyHomeWidgets";

// Every part is optional: a part with no value is simply not shown.
export default function ProfessionsSection({ heading, intro, tabsLabel, professions = [] }) {
  return (
    <RevealSection aria-labelledby={heading ? "home-professions-heading" : undefined} className="relative isolate overflow-hidden bg-white py-8 lg:py-20">
      <Reveal delay={.9} aria-hidden="true" className="pointer-events-none absolute top-4 left-0 -z-10 hidden w-[170px] md:block">
        <svg viewBox="0 0 234 543" fill="none" className="h-auto w-full overflow-visible">
          <g opacity=".3">
            <circle cx="-7.439" cy="195.902" r="178.832" fill="#80549E" fillOpacity=".71" />
            <g className="[animation:orbit-border_8s_ease-in-out_infinite_alternate] [transform-box:view-box] [transform-origin:-7.439px_195.902px]">
              <circle cx="171.393" cy="195.902" r="38.205" fill="#6C3D8E" />
            </g>
          </g>
        </svg>
      </Reveal>
      <DrawnShape viewBox="0 0 170.798 420.675" className="-top-16 -right-8 w-[150px]" after={1.38}
        d="M0.197473 0.566572C201.035 70.5666 205.933 125.567 107.964 205.567C19.7914 285.567 181.441 340.567 166.746 420.567" />
      <Container>
        {(heading || intro) && (
          <div className="text-center">
            {heading && <Reveal as="h2" id="home-professions-heading" className="text-[clamp(28px,3vw,42px)] leading-[1.35] font-semibold text-[#6c3d8e]">{heading}</Reveal>}
            {intro && <Reveal as="p" delay={.45} className="mx-auto mt-3 max-w-[620px] text-[15px] leading-[1.8] text-[#5d5861]">{intro}</Reveal>}
          </div>
        )}
        {professions.length > 0 && <ProfessionTabs tabsLabel={tabsLabel} professions={professions} />}
      </Container>
    </RevealSection>
  );
}
