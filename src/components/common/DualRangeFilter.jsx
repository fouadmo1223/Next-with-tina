"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import styles from "./DualRangeFilter.module.css";

export default function DualRangeFilter({ label, fromLabel, toLabel, allLabel, min, max, fromValue, toValue, onFromChange, onToChange, align = "start" }) {
  const id = useId();
  const rootRef = useRef(null);
  const railRef = useRef(null);
  const dragging = useRef(null);
  const reduced = useReducedMotion();
  const rtl = useLocale() === "ar";
  const [open, setOpen] = useState(false);
  const from = fromValue === "" ? min : Number(fromValue);
  const to = toValue === "" ? max : Number(toValue);
  const fromPercent = ((from - min) / (max - min)) * 100;
  const toPercent = ((to - min) / (max - min)) * 100;
  const selectedLeft = rtl ? 100 - toPercent : fromPercent;
  const selected = fromValue !== "" || toValue !== "";

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const updateAt = (clientX, handle) => {
    const rail = railRef.current;
    if (!rail) return;
    const rect = rail.getBoundingClientRect();
    const fraction = rtl ? (rect.right - clientX) / rect.width : (clientX - rect.left) / rect.width;
    const value = Math.round(min + Math.max(0, Math.min(1, fraction)) * (max - min));
    if (handle === "from") {
      const next = Math.min(value, to);
      onFromChange(next === min ? "" : String(next));
    } else {
      const next = Math.max(value, from);
      onToChange(next === max ? "" : String(next));
    }
  };

  const startTrackDrag = (event) => {
    if (event.target.tagName === "INPUT") return;
    const rail = railRef.current;
    const rect = rail.getBoundingClientRect();
    const fraction = rtl ? (rect.right - event.clientX) / rect.width : (event.clientX - rect.left) / rect.width;
    const value = min + Math.max(0, Math.min(1, fraction)) * (max - min);
    dragging.current = Math.abs(value - from) <= Math.abs(value - to) ? "from" : "to";
    rail.setPointerCapture(event.pointerId);
    updateAt(event.clientX, dragging.current);
  };

  return (
    <div ref={rootRef} className={`relative min-w-0 text-[13px] text-[#5d5861] ${open ? "z-30" : ""}`}>
      <span id={`${id}-label`} className="block">{label}</span>
      <button type="button" aria-labelledby={`${id}-label`} aria-expanded={open} aria-controls={id} onClick={() => setOpen((current) => !current)}
        className={`mt-1.5 flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-[10px] border bg-white px-3 text-[14px] text-[#2f2835] transition-colors hover:border-[#b7a0c5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#884fb4] ${open ? "border-[#6c3d8e]" : "border-[#e6dfec]"}`}>
        <span className={`min-w-0 truncate ${selected ? "font-semibold" : "text-[#77717d]"}`}>{selected ? `${from}–${to}` : allLabel}</span>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={`size-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </button>
      <AnimatePresence>
        {open && <motion.div id={id} role="group" aria-label={label} data-lenis-prevent
          initial={reduced ? false : { opacity: 0, y: -8, scale: .97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: .97 }}
          transition={{ duration: reduced ? 0 : .2, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute top-full z-30 mt-2 w-[min(280px,calc(100vw-2rem))] origin-top rounded-[14px] border border-[#e6dfec] bg-white p-4 shadow-[0_16px_35px_-16px_rgba(45,30,56,0.35)] ${align === "end" ? "end-0" : "start-0"}`}>
        <div className="mb-3 flex items-center justify-between gap-3 text-[13px] text-[#5d5861]">
          <span>{fromLabel}: <strong className="text-[#6c3d8e] tabular-nums">{from}</strong></span>
          <span>{toLabel}: <strong className="text-[#6c3d8e] tabular-nums">{to}</strong></span>
        </div>
        <div ref={railRef} dir={rtl ? "rtl" : "ltr"} className={styles.rail} onPointerDown={startTrackDrag}
          onPointerMove={(event) => { if (dragging.current) updateAt(event.clientX, dragging.current); }}
          onPointerUp={() => { dragging.current = null; }} onPointerCancel={() => { dragging.current = null; }}>
          <div className={styles.track} />
          <div className={styles.selected} style={{ left: `${selectedLeft}%`, width: `${toPercent - fromPercent}%` }} />
          <input type="range" min={min} max={max} step="1" value={from} aria-label={`${label} ${fromLabel}`}
            onChange={(event) => {
              const next = Math.min(Number(event.target.value), to);
              onFromChange(next === min ? "" : String(next));
            }} className={styles.thumb} />
          <input type="range" min={min} max={max} step="1" value={to} aria-label={`${label} ${toLabel}`}
            onChange={(event) => {
              const next = Math.max(Number(event.target.value), from);
              onToChange(next === max ? "" : String(next));
            }} className={styles.thumb} />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-[#77717d] tabular-nums"><span>{min}</span><span>{max}</span></div>
        {selected && <button type="button" onClick={() => { onFromChange(""); onToChange(""); }} className="mt-3 text-[12px] font-semibold text-[#6c3d8e] cursor-pointer underline underline-offset-2">{allLabel}</button>}
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
