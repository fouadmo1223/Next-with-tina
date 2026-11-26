"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function DropdownPanel({ id, items, onNavigate, reduced }) {
  const present = useIsPresent();
  return (
    <motion.ul
      id={id}
      inert={!present}
      initial="closed"
      animate="open"
      exit="closed"
      variants={{
        open: { opacity: 1, y: 0, scale: 1, transition: { duration: reduced ? 0 : .2, delayChildren: reduced ? 0 : .06, staggerChildren: reduced ? 0 : .07 } },
        closed: { opacity: 0, y: reduced ? 0 : -8, scale: reduced ? 1 : .97, transition: { duration: reduced ? 0 : .16, staggerChildren: reduced ? 0 : .04, staggerDirection: -1, when: "afterChildren" } },
      }}
      className="absolute start-0 top-[calc(100%+14px)] z-50 min-w-[340px] origin-top overflow-hidden rounded-[20px] border border-[#e0d1ed] border-t-4 border-t-[#85b7bc] bg-white p-2 shadow-[0_20px_50px_rgba(45,30,56,0.22)] min-[1401px]:top-[calc(100%+42px)]"
    >
      {items.map((child, index) => (
        <motion.li key={child.key}
          variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: reduced ? 0 : -6 } }}
          transition={{ duration: reduced ? 0 : .18 }}
          className={index > 0 ? "border-t border-[#f3edf7]" : ""}
        >
          <Link href={child.href} onClick={onNavigate} className="flex min-h-14 items-center rounded-xl px-5 py-3 text-start text-[16px] font-semibold text-[#6c3d8e] transition-colors hover:bg-[#f3edf7] focus-visible:bg-[#f3edf7]">{child.label}</Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export default function ServicesDropdown({ label, items, isActive, onLinkClick }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const button = useRef(null);
  const id = useId();
  const reduced = useReducedMotion();
  const closeTimer = useRef(null);

  // A mouse opens the menu on hover; a short delay lets the pointer cross the gap down to the panel.
  // Touch and keyboard still open it with the button.
  function hoverOpen(event) {
    if (event.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function hoverClose(event) {
    if (event.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  }
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!open) return;
    function outside(event) {
      if (!root.current?.contains(event.target)) setOpen(false);
    }
    function escape(event) {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={root} className="relative" onPointerEnter={hoverOpen} onPointerLeave={hoverClose} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button ref={button} type="button" aria-expanded={open} aria-controls={id}
        onClick={(event) => {
          // A mouse already opened it on hover, so a click keeps it open; touch and keyboard toggle it.
          if (event.detail > 0 && event.nativeEvent.pointerType === "mouse") setOpen(true);
          else setOpen(value => !value);
        }}
        className={cn("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-3 text-start text-[16px] text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white", isActive ? "font-semibold" : "font-normal")}
      >
        {label}
        <svg aria-hidden="true" className={cn("transition-transform", open && "rotate-180")} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <AnimatePresence>
        {open && <DropdownPanel key="panel" id={id} items={items} reduced={reduced} onNavigate={(event) => {
          setOpen(false);
          onLinkClick?.(event);
        }} />}
      </AnimatePresence>
    </div>
  );
}
