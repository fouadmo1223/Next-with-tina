"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Reveal, useReveal } from "@/components/animation/Reveal";
import Pagination from "@/components/common/Pagination";
import { COUNTRIES_PAGE_SIZE } from "@/constants";
import CountriesGrid from "@/components/common/CountriesGrid";

const turnStagger = .06;

// The countries page's grid: the arrows and dots only show once there's more than one page.
export default function CountriesPager({ countries, explore, labels, apiPagination, loadPage, cardsDelay, cardStagger, controlsDelay }) {
  const { reduced } = useReveal();
  const locale = useLocale();
  const tCvs = useTranslations("homeCvs");
  const [page, setPage] = useState(0);
  const [turned, setTurned] = useState(false);
  const [results, setResults] = useState(countries);
  const [serverPagination, setServerPagination] = useState(apiPagination);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef(null);
  const count = loadPage ? Math.max(1, Number(serverPagination?.totalPages) || 1) : Math.ceil(countries.length / COUNTRIES_PAGE_SIZE);
  const goTo = async (index) => {
    if (loading || index === page) return;
    if (loadPage) {
      setLoading(true);
      const next = await loadPage(index + 1, locale).catch(() => null);
      setLoading(false);
      if (!next) return;
      setResults(next.countries);
      setServerPagination(next.pagination);
    }
    setPage(index);
    setTurned(true);
    gridRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      <div ref={gridRef} aria-live="polite" aria-busy={loading || undefined} className={`scroll-mt-4 transition-opacity ${loading ? "opacity-50" : ""}`}>
        <CountriesGrid key={page} countries={loadPage ? results : countries.slice(page * COUNTRIES_PAGE_SIZE, (page + 1) * COUNTRIES_PAGE_SIZE)} explore={explore}
          delay={turned ? 0 : cardsDelay} stagger={turned ? turnStagger : cardStagger} />
      </div>
      {count > 1 && (
        <Reveal delay={controlsDelay} className="mt-5">
          <Pagination current={page} count={count}
            labels={{ ...labels, goTo: Array.from({ length: count }, (_, index) => tCvs("goTo", { page: index + 1 })) }} onSelect={goTo} />
        </Reveal>
      )}
    </>
  );
}
