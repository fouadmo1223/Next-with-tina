"use client";

import { useState } from "react";
import { Reveal } from "@/components/animation/Reveal";

function FaqItem({ item, open, onToggle, delay }) {
  return (
    <Reveal duration={.5} delay={delay}>
      <div className={`relative overflow-hidden rounded-[14px] border transition-colors duration-300 ${open ? "border-[#e0d1ed] bg-[#f3edf7]" : "border-[#e6dfec] bg-white"}`}>
        <span aria-hidden="true" className={`pointer-events-none absolute start-0 top-0 size-4 bg-[#85b7bc] transition-opacity duration-300 [clip-path:polygon(0_0,100%_0,0_100%)] rtl:[clip-path:polygon(0_0,100%_0,100%_100%)] ${open ? "opacity-100" : "opacity-0"}`} />
        <h3>
          <button type="button" id={`faq-question-${item.id}`} aria-expanded={open} aria-controls={`faq-answer-${item.id}`} onClick={onToggle}
            className="flex min-h-[68px] w-full cursor-pointer items-center justify-between gap-4 px-5 py-3 text-start focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#884fb4]">
            <span className="text-[17px] leading-[1.5] font-bold text-[#6c3d8e] lg:text-[18px]">{item.question}</span>
            <span aria-hidden="true" className={`relative size-8 shrink-0 rounded-full transition-[background-color,rotate] duration-300 ${open ? "rotate-180 bg-white" : "bg-[#eef7f5]"}`}>
              <span className="absolute top-1/2 left-1/2 h-[1.6px] w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6c3d8e]" />
              <span className={`absolute top-1/2 left-1/2 h-3 w-[1.6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6c3d8e] transition-[rotate,opacity] duration-300 ${open ? "rotate-90 opacity-0" : "opacity-100"}`} />
            </span>
          </button>
        </h3>
        {/* Animating the row from 0fr to 1fr slides to the answer's real height in both directions. */}
        <div id={`faq-answer-${item.id}`} role="region" aria-labelledby={`faq-question-${item.id}`}
          className={`grid transition-[grid-template-rows,visibility] duration-[350ms] ease-out ${open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"}`}>
          <div className="min-h-0 overflow-hidden">
            <p className={`mx-5 border-t border-[#e0d1ed] pt-3 pb-5 text-[15px] leading-[1.8] text-[#5d5861] transition-[opacity,translate] duration-300 ${open ? "translate-y-0 opacity-100 delay-75" : "-translate-y-2 opacity-0"}`}>{item.answer}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function FaqAccordion({ columns, itemsDelay, itemStagger }) {
  const [openId, setOpenId] = useState(columns[0][0].id);

  return (
    <div className="mt-8 grid items-start gap-3 lg:grid-cols-2 lg:gap-5">
      {columns.map((column, columnIndex) => (
        <div key={column[0].id} className="grid gap-3">
          {column.map((item, index) => (
            <FaqItem key={item.id} item={item} open={item.id === openId}
              onToggle={() => setOpenId(item.id === openId ? null : item.id)}
              delay={itemsDelay + index * itemStagger + columnIndex * .05} />
          ))}
        </div>
      ))}
    </div>
  );
}
