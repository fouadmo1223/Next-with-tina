import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/animation/Reveal";
import MobileCardsSwiper from "@/components/common/MobileCardsSwiper";
import { ROUTES } from "@/constants";
import { skipImageOptimizer } from "@/lib/utils";

export default function CountriesGrid({ countries, explore, delay, stagger, mobileSwiper = false }) {
  const cards = countries.map((country, index) => {
    // Dashboard countries bring their own href (or none); the built-in list links by slug.
    const href = country.href !== undefined ? country.href : country.slug && ROUTES.country(country.slug);
    const Card = href ? Link : "div";
    return (
      <Reveal key={country.key ?? country.slug ?? index} duration={.7} delay={delay + index * stagger}>
        <Card {...(href ? { href } : {})} className="group relative flex h-[178px] flex-col items-center justify-center overflow-hidden rounded-[14px] border border-t-[4px] border-[#edf7f5] border-t-[#85b7bc] bg-white text-center shadow-[0_8px_22px_-14px_rgba(45,30,56,0.35)] transition-colors duration-300 hover:bg-[#884fb4] focus-visible:bg-[#884fb4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#884fb4]">
          <span className="flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-3 group-focus-visible:-translate-y-3">
            {country.flag && <Image src={country.flag} alt="" width={72} height={72} unoptimized={skipImageOptimizer(country.flag)} className="size-[72px] rounded-full object-contain" />}
            {country.name && <span className="mt-3 text-[18px] font-bold text-[#3d3442] transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">{country.name}</span>}
          </span>
          {href && explore && <span className="absolute inset-x-4 bottom-3 text-[13px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">{explore}</span>}
        </Card>
      </Reveal>
    );
  });

  return (
    <>
      {mobileSwiper && (
        <div className="mt-9 sm:hidden">
          <MobileCardsSwiper>{cards}</MobileCardsSwiper>
        </div>
      )}
      <div className={`mx-auto mt-9 max-w-[1120px] gap-4 sm:grid-cols-2 lg:mt-11 lg:grid-cols-3 lg:gap-5 ${mobileSwiper ? "hidden sm:grid" : "grid grid-cols-1 sm:grid"}`}>
        {cards}
      </div>
    </>
  );
}
