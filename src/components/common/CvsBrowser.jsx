"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import Select from "@/components/common/Select";
import DualRangeFilter from "@/components/common/DualRangeFilter";
import Pagination from "@/components/common/Pagination";
import { Reveal, useReveal } from "@/components/animation/Reveal";
import { ROUTES } from "@/constants";
import CvCard from "@/components/common/CvCard";
import DoubleWaveLink from "@/components/common/DoubleWaveLink";
import { RollText } from "@/components/common/LetterRollLink";

const ease = [0.16, 1, 0.3, 1];
const filtersDelay = .9;
const cardsDelay = 1.2;
const cardStagger = .15;
const visibleCards = 4;
// Divides evenly into the grid's 1, 2, 3 and 4 columns, so every page ends on a full row.
const pageSize = 12;
const controlsDelay = cardsDelay + visibleCards * cardStagger + .4;
// Filtering always runs on the server (a `search` action over the Tina CV files, or server paging); without one the list shows as given.
const filterKeys = ["nationality", "profession", "age", "experience"];
const noFilters = {
  ...Object.fromEntries(filterKeys.map((key) => [key, "all"])),
  minAge: "", maxAge: "", minExperienceYears: "", maxExperienceYears: "",
};
// Three filters leave an odd one on phones, so that one takes the full row.
const filterColumns = {
  1: "lg:grid-cols-[minmax(0,1fr)_auto] max-lg:[&>:first-child]:col-span-2",
  2: "lg:grid-cols-[repeat(2,minmax(0,1fr))_auto]",
  3: "lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] max-lg:[&>:nth-child(3)]:col-span-2",
  4: "lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]",
};
const outlineButton = "inline-flex min-h-12 w-full items-center justify-center rounded-[11px] border px-10 py-3 text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#884fb4] sm:w-auto";

// A grid card that appears once it's scrolled into view, so a new page doesn't show all its cards at once.
function GridCard({ cv, labels, delay, visible, reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: .25 });
  return (
    <div ref={ref} className="px-5 pt-12 pb-6">
      <CvCard cv={cv} labels={labels} delay={delay} visible={visible && inView} reduced={reduced} />
    </div>
  );
}

// `paged` is the CVs page's version: a grid of pages instead of the one-row slider. Without `filters` there's no filter bar, and `hideActions` drops the links under the cards.
// With `search` (a server function), filtering asks the server; with every filter on "all", the starting `cvs` come back.
// In `compact`, `browseHref` and `askHref` set where the two buttons under the cards go (labels.browse and labels.ask).
export default function CvsBrowser({ cvs, filters, labels, compact, paged, hideActions, search, loadPage, pagination, browseHref = ROUTES.cvs, askHref = ROUTES.contact }) {
  const external = (href) => (/^https?:\/\//.test(href) ? { target: "_blank", rel: "noreferrer" } : {});
  const { visible, reduced } = useReveal();
  const locale = useLocale();
  const tCvs = useTranslations("homeCvs");
  const serverPaged = paged && Boolean(loadPage);
  const [results, setResults] = useState(null);
  const [serverPagination, setServerPagination] = useState(pagination);
  const [searching, setSearching] = useState(false);
  const [draft, setDraft] = useState(noFilters);
  const [applied, setApplied] = useState(noFilters);
  const [filtered, setFiltered] = useState(false);
  const [filterHovered, setFilterHovered] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const [snapIndex, setSnapIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(1);
  const [page, setPage] = useState(0);
  const resultsRef = useRef(null);
  const shown = serverPaged || search ? (results ?? cvs) : cvs;
  const reveal = (delay) => ({
    initial: reduced ? false : { opacity: 0, filter: "blur(12px)" },
    animate: visible ? { opacity: 1, filter: "blur(0px)" } : undefined,
    transition: { duration: reduced ? 0 : .6, delay: reduced ? 0 : delay, ease },
  });
  const pageCount = serverPaged ? Math.max(1, Number(serverPagination?.totalPages) || 1) : Math.ceil(shown.length / pageSize);
  const currentCards = serverPaged ? shown : shown.slice(page * pageSize, (page + 1) * pageSize);
  const current = paged ? page : snapIndex;
  const count = paged ? pageCount : snapCount;
  const goTo = async (index) => {
    if (!paged) {
      swiper?.slideTo(index);
      return;
    }
    if (serverPaged) {
      if (searching || index === page) return;
      setSearching(true);
      const next = await loadPage(index + 1, applied, locale).catch(() => null);
      setSearching(false);
      if (!next) return;
      setResults(next.cvs);
      setServerPagination(next.pagination);
    }
    setPage(index);
    setFiltered(true);
    resultsRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };
  const syncSwiper = (instance) => {
    setSnapIndex(instance.snapIndex);
    setSnapCount(instance.snapGrid.length);
  };

  const applyFilters = async (event) => {
    event.preventDefault();
    if (searching) return;
    if (serverPaged) {
      setSearching(true);
      const next = await loadPage(1, draft, locale).catch(() => ({ cvs: [], pagination: null }));
      setSearching(false);
      setResults(next.cvs);
      setServerPagination(next.pagination);
    } else if (search) {
      const unfiltered = filterKeys.every((key) => draft[key] === "all");
      setSearching(true);
      // A failed search shows the empty message rather than stale cards.
      const found = unfiltered ? null : await search(draft, locale).catch(() => []);
      setSearching(false);
      setResults(found);
    }
    setApplied(draft);
    setFiltered(true);
    setSnapIndex(0);
    setPage(0);
  };

  return (
    <>
    {filters && <motion.form {...reveal(filtersDelay)} onSubmit={applyFilters} className={`relative z-20 mx-auto mt-8 grid max-w-[1040px] grid-cols-2 items-end gap-3 rounded-[16px] p-4 shadow-[0_10px_26px_-20px_rgba(45,30,56,0.4)] ${paged ? "bg-[#f3edf7]" : "bg-white"} ${filterColumns[filters.length]}`}>
      {filters.map(({ key, label, options, type, min, max, fromKey, toKey }) => type === "range" ? (
        <DualRangeFilter key={key} label={label} fromLabel={labels.rangeFrom} toLabel={labels.rangeTo} allLabel={labels.all}
          min={min} max={max} fromValue={draft[fromKey]} toValue={draft[toKey]} align={key === "experience" ? "end" : "start"}
          onFromChange={(value) => setDraft((current) => ({ ...current, [fromKey]: value }))}
          onToChange={(value) => setDraft((current) => ({ ...current, [toKey]: value }))} />
      ) : type === "text" ? (
        <label key={key} className="block text-[13px] text-[#5d5861]">{label}
          <input type="search" value={draft[key] === "all" ? "" : draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
            placeholder={label} maxLength={80} className="mt-1.5 h-11 w-full rounded-[10px] border border-[#e6dfec] bg-white px-3 text-[14px] text-[#2f2835] outline-none transition-colors hover:border-[#b7a0c5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#884fb4]" />
        </label>
      ) : (
        <Select key={key} label={label} value={draft[key]} onChange={(value) => setDraft({ ...draft, [key]: value })}
          options={[{ value: "all", label: labels.all }, ...options]} />
      ))}
      <button type="submit" disabled={searching} aria-busy={searching || undefined} aria-label={labels.filter} onMouseEnter={() => setFilterHovered(true)} onMouseLeave={() => setFilterHovered(false)} onFocus={(event) => setFilterHovered(event.currentTarget.matches(":focus-visible"))} onBlur={() => setFilterHovered(false)}
          className="col-span-2 h-11 cursor-pointer rounded-[10px] border border-[#6c3d8e] bg-[#6c3d8e] px-9 text-[14px] font-semibold text-white transition-colors hover:bg-transparent hover:text-[#6c3d8e] focus-visible:bg-transparent focus-visible:text-[#6c3d8e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#884fb4] disabled:cursor-wait disabled:opacity-70 lg:col-span-1"><span className="flex items-center justify-center gap-2">{searching && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />}<RollText text={labels.filter} active={filterHovered && !searching} /></span></button>
    </motion.form>}

    <div ref={resultsRef} aria-live="polite" className={`mt-6 scroll-mt-4 transition-opacity ${searching ? "opacity-50" : ""}`}>
      {shown.length === 0 ? (
        <p className="py-16 text-center text-[16px] text-[#5d5861]">{labels.empty}</p>
      ) : paged ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentCards.map((cv, index) => (
            <GridCard key={`${page}-${cv.id}`} cv={cv} labels={labels} visible={visible} reduced={reduced}
              delay={(index % visibleCards) * .08 + (!filtered && index < visibleCards ? cardsDelay : 0)} />
          ))}
        </div>
      ) : (
        <Swiper key={JSON.stringify(applied)} onSwiper={(instance) => { setSwiper(instance); syncSwiper(instance); }} onSlideChange={syncSwiper} onSnapGridLengthChange={syncSwiper}
          slidesPerView={1} breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 }, 1280: { slidesPerView: visibleCards } }}
        >
          {shown.map((cv, index) => (
            <SwiperSlide key={cv.id ?? cv.slug} className="!h-auto px-5 pt-12 pb-6">
              <CvCard cv={cv} labels={labels} delay={filtered ? Math.min(index, visibleCards - 1) * .08 : cardsDelay + Math.min(index, visibleCards - 1) * cardStagger} visible={visible} reduced={reduced} compact={compact} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>

    {count > 1 && shown.length > 0 && (
      <Reveal delay={filtered ? 0 : controlsDelay}>
        <Pagination current={current} count={count} labels={serverPaged ? { ...labels, goTo: Array.from({ length: count }, (_, index) => tCvs("goTo", { page: index + 1 })) } : labels} onSelect={goTo} />
      </Reveal>
    )}

    {paged || hideActions ? null : compact ? (
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
        {labels.browse && browseHref && <DoubleWaveLink ready={visible} delay={filtered ? 0 : controlsDelay + .15} href={browseHref} {...external(browseHref)} className={`${outlineButton} border-[#85b7bc] bg-[#85b7bc] text-white`}>{labels.browse}</DoubleWaveLink>}
        {labels.ask && askHref && <DoubleWaveLink ready={visible} delay={filtered ? 0 : controlsDelay + .3} href={askHref} {...external(askHref)} className={`${outlineButton} border-[#6c3d8e] text-[#6c3d8e]`}>{labels.ask}</DoubleWaveLink>}
      </div>
    ) : (
      <div className="mt-8 text-center">
        <DoubleWaveLink ready={visible} delay={filtered ? 0 : controlsDelay + .15} href={ROUTES.cvs} className={`${outlineButton} border-[#6c3d8e] text-[#6c3d8e]`}>{labels.browseAll}</DoubleWaveLink>
      </div>
    )}
    </>
  );
}
