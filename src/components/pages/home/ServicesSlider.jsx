"use client";

import { useRef, useState } from "react";

// A swipeable row on mobile (one card per view) and a two-column grid from md up.
export default function ServicesSlider({ count, dotLabels, children }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const syncActive = () => {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(Math.abs(track.scrollLeft) / track.clientWidth));
  };

  const goTo = (index) => {
    const track = trackRef.current;
    track?.scrollTo({ left: track.children[index].offsetLeft - track.children[0].offsetLeft, behavior: "smooth" });
  };

  return (
    <>
      <div ref={trackRef} onScroll={syncActive}
        className="relative mt-9 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-10 max-md:mt-6 max-md:-mb-3 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:overscroll-x-contain max-md:py-3 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
        {children}
      </div>
      <div className="mt-5 flex items-center justify-center gap-1 md:hidden">
        {Array.from({ length: count }, (_, index) => (
          <button key={index} type="button" aria-label={dotLabels[index]} aria-current={index === active || undefined} onClick={() => goTo(index)}
            className={`flex size-7 cursor-pointer items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-[#884fb4] ${index === active ? "border-[#6c3d8e]" : "border-transparent"}`}>
            <span className={`size-2.5 rounded-full transition-colors ${index === active ? "bg-[#6c3d8e]" : "bg-[#d5cbdc]"}`} />
          </button>
        ))}
      </div>
    </>
  );
}
