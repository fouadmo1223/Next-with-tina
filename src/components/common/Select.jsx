"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export default function Select({ label, labelClassName = "", valueClassName = "", heightClassName = "h-11", suffix, value, options, onChange }) {
  const id = useId();
  const rootRef = useRef(null);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  const show = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const choose = (index) => {
    onChange(options[index].value);
    setOpen(false);
  };

  const onKeyDown = (event) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        show();
      }
      return;
    }
    const moves = { ArrowDown: (activeIndex + 1) % options.length, ArrowUp: (activeIndex - 1 + options.length) % options.length, Home: 0, End: options.length - 1 };
    if (event.key in moves) {
      event.preventDefault();
      setActiveIndex(moves[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(activeIndex);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative text-[13px] text-[#5d5861]">
      <span id={`${id}-label`} className={`block ${labelClassName}`}>{label}</span>
      <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label`} aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : show())} onKeyDown={onKeyDown}
        className={`mt-1.5 flex ${heightClassName} w-full cursor-pointer items-center justify-between gap-2 rounded-[10px] border bg-white ps-3 pe-3 text-[14px] text-[#2f2835] transition-colors hover:border-[#b7a0c5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#884fb4] ${open ? "border-[#6c3d8e]" : "border-[#e6dfec]"}`}
      >
        <span className={`truncate ${valueClassName}`}>{options[selectedIndex]?.label}</span>
        <span className="flex shrink-0 items-center gap-2">
          {suffix && <span className="text-[14px] font-semibold text-[#5d5861]">{suffix}</span>}
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={`size-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}><path d="M4 6L8 10L12 6" stroke={open ? "#6C3D8E" : "#57525C"} strokeWidth="1.6" strokeLinecap="round" /></svg>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} data-lenis-prevent
            initial={reduced ? false : { opacity: 0, y: -6, scale: .98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: .98 }}
            transition={{ duration: reduced ? 0 : .18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-56 origin-top overflow-y-auto rounded-[12px] border border-[#e6dfec] bg-white p-1.5 shadow-[0_16px_32px_-14px_rgba(45,30,56,0.4)]"
          >
            {options.map((option, index) => {
              const selected = index === selectedIndex;
              return (
                <li key={option.value} id={`${id}-option-${index}`} role="option" aria-selected={selected}
                  onClick={() => choose(index)} onPointerEnter={() => setActiveIndex(index)}
                  className={`flex cursor-pointer items-center justify-between gap-2 rounded-[8px] px-2.5 py-2 text-[14px] transition-colors ${selected ? "font-semibold text-[#6c3d8e]" : "text-[#2f2835]"} ${index === activeIndex ? "bg-[#f3edf7]" : ""}`}
                >
                  {option.label}
                  <span className="flex shrink-0 items-center gap-2">
                    {suffix && <span className="text-[13px] text-[#5d5861]">{suffix}</span>}
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={`size-4 shrink-0 ${selected ? "" : "invisible"}`}><path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="#6C3D8E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
