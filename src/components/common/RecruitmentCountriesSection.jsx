import Image from "next/image";
import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import LetterRollLink from "@/components/common/LetterRollLink";
import { COUNTRIES_PAGE_SIZE, ROUTES } from "@/constants";
import CountriesGrid from "@/components/common/CountriesGrid";
import CountriesPager from "@/components/common/CountriesPager";
import FlightPath from "@/components/common/FlightPath";

const cardsDelay = .9;
const cardStagger = .12;
const mapDelay = .2;
const flightDelay = .6;
// The bottom plane waits a little longer, since that part of the section scrolls into view later.
const bottomFlightDelay = 1.4;

// With `pagination` labels the countries are split into pages and the "view all" link goes away.
// Every part is optional: a part with no value is simply not shown.
export default function RecruitmentCountriesSection({ heading, intro, explore, viewAll, countries = [], pagination, apiPagination, loadPage }) {
  const firstCards = loadPage ? countries.length : pagination ? Math.min(countries.length, COUNTRIES_PAGE_SIZE) : countries.length;
  const buttonDelay = cardsDelay + firstCards * cardStagger + .1;

  return (
    <RevealSection aria-labelledby={heading ? "home-countries-heading" : undefined}className="relative isolate overflow-hidden bg-white py-8 lg:py-24">
      <Reveal from="clipRight" duration={1.4} delay={mapDelay} ease={[0.65, 0, 0.35, 1]} aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 -z-20 w-[1392px] max-w-none -translate-x-1/2">
        <Image src="/home/countries-world1.svg" alt="" width={1392} height={863} className="map-drift h-auto w-full" />
      </Reveal>
      <FlightPath delay={flightDelay} className="top-6 left-0 w-[320px]" />
      <FlightPath delay={bottomFlightDelay} className="right-0 bottom-14 w-[200px] rotate-180 lg:w-[320px]" />
      <Container>
        {(heading || intro) && (
          <div className="text-center">
            {heading && <Reveal as="h2" id="home-countries-heading" className="text-[clamp(28px,3vw,42px)] leading-[1.35] font-semibold text-[#6c3d8e]">{heading}</Reveal>}
            {intro && <Reveal as="p" delay={.45} className="mx-auto mt-3 max-w-[620px] text-[15px] leading-[1.8] text-[#5d5861]">{intro}</Reveal>}
          </div>
        )}
        {countries.length === 0 ? null : pagination ? (
          <CountriesPager countries={countries} explore={explore} labels={pagination} apiPagination={apiPagination} loadPage={loadPage}
            cardsDelay={cardsDelay} cardStagger={cardStagger} controlsDelay={buttonDelay} />
        ) : (
          <>
            <CountriesGrid countries={countries} explore={explore} delay={cardsDelay} stagger={cardStagger} mobileSwiper />
            {viewAll && <Reveal delay={buttonDelay} className="mt-9 text-center">
              <LetterRollLink still href={ROUTES.countries} className="inline-flex min-h-12 items-center justify-center rounded-[11px] border border-[#85b7bc] bg-[#85b7bc] px-8 py-3 text-[14px] font-bold text-white transition-colors hover:border-[#6c3d8e] hover:bg-transparent hover:text-[#6c3d8e] focus-visible:border-[#6c3d8e] focus-visible:bg-transparent focus-visible:text-[#6c3d8e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#884fb4]">{viewAll}</LetterRollLink>
            </Reveal>}
          </>
        )}
      </Container>
    </RevealSection>
  );
}
