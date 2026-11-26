"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { HEADER_LINKS } from "@/constants/routes";
import { NAV_ICONS } from "@/constants/navIcons";
import LocaleSwitcher from "@/components/common/LocaleSwitcher";
import SocialLinks from "@/components/common/SocialLinks";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1];
const itemsDelay = .18;
const itemStagger = .05;
const matches = (href, pathname) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

function NavIcon({ name, className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {NAV_ICONS[name]?.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

const rowClass = (active) => cn(
  "group flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-start text-[15px] font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#884fb4]",
  active ? "bg-[#f3edf7] text-[#6c3d8e]" : "text-[#3d3442] hover:bg-[#faf7fc] hover:text-[#6c3d8e]",
);

const iconTileClass = (active) => cn(
  "flex size-9 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-300",
  active ? "bg-[linear-gradient(135deg,#85B7BC_0%,#6C3D8E_100%)] text-white" : "bg-[#f3edf7] text-[#6c3d8e] group-hover:bg-[#e9dff2]",
);

function MenuPanel({ onClose, settings, services }) {
  const t = useTranslations("nav");
  const tMenu = useTranslations("menu");
  const locale = useLocale();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const closeRef = useRef(null);
  const servicesActive = services.some(({ href }) => matches(href, pathname));
  const [servicesOpen, setServicesOpen] = useState(servicesActive);
  const rtl = locale === "ar";
  // The panel sits on the reading end of the screen and slides in from that edge.
  const offscreen = rtl ? "-100%" : "100%";
  const item = (index) => ({
    initial: reduced ? false : { opacity: 0, x: rtl ? -24 : 24 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: .45, delay: reduced ? 0 : itemsDelay + index * itemStagger, ease },
  });

  useEffect(() => {
    const previous = document.activeElement;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = overflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 min-[968px]:hidden" dir={rtl ? "rtl" : "ltr"} role="dialog" aria-modal="true" aria-label={tMenu("title")} data-lenis-prevent>
      <motion.div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-[#2d1e38]/45 backdrop-blur-[3px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .3 }} />

      <motion.aside className="absolute inset-y-0 end-0 flex w-[min(86vw,340px)] flex-col overflow-hidden rounded-s-[26px] bg-white shadow-[0_0_60px_-12px_rgba(45,30,56,0.5)]"
        initial={{ x: offscreen }} animate={{ x: 0 }} exit={{ x: offscreen }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 36, mass: .9 }}>
        <div className="relative isolate overflow-hidden bg-[linear-gradient(106.93deg,#A36FCF_8.89%,#884FB4_44.79%,#6C3D8E_102.63%)] px-5 pt-6 pb-5 text-white">
          <svg viewBox="0 0 200 200" aria-hidden="true" className="pointer-events-none absolute -end-12 -top-14 -z-10 w-44 opacity-20"><circle cx="100" cy="100" r="80" fill="none" stroke="#fff" strokeWidth="18" /></svg>
          <div className="flex items-center justify-between gap-3">
            <Link href="/" onClick={onClose} className="flex min-w-0 items-center gap-3 rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              {settings.logo && <span className="flex size-14 shrink-0 items-center justify-center rounded-[16px] bg-white p-1.5">
                <Image src={settings.logo} alt="" width={56} height={56} className="size-full object-contain" />
              </span>}
              <span className="min-w-0">
                <span className="block truncate text-[16px] font-bold">{settings.name}</span>
                <span className="block text-[12px] text-white/80">{tMenu("title")}</span>
              </span>
            </Link>
            <button ref={closeRef} type="button" onClick={onClose} aria-label={tMenu("close")}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-[18px]"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4" aria-label={tMenu("title")}>
          <ul className="flex flex-col gap-1">
            {HEADER_LINKS.map(({ key, href, services: hasServices }, index) => {
              const children = hasServices ? services : null;
              if (hasServices && services.length === 0) return null;
              // Services has no page of its own, so its row only opens the list of services.
              if (children) {
                return (
                  <motion.li key={key} {...item(index)}>
                    <button type="button" onClick={() => setServicesOpen((open) => !open)} aria-expanded={servicesOpen} className={cn(rowClass(servicesActive), "cursor-pointer")}>
                      <span className={iconTileClass(servicesActive)}><NavIcon name={key} className="size-[18px]" /></span>
                      <span className="flex-1">{t(key)}</span>
                      <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4 text-[#8a8290]"
                        initial={false} animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: reduced ? 0 : .3, ease }}>
                        <path d="m6 9 6 6 6-6" />
                      </motion.svg>
                    </button>
                    <AnimatePresence initial={false}>
                      {servicesOpen && (
                        <motion.ul key="children" className="overflow-hidden"
                          initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: reduced ? 0 : .35, ease }}>
                          <li className="ms-[30px] mt-1 border-s-2 border-[#e0d1ed] py-1 ps-4">
                            <ul className="flex flex-col gap-0.5">
                              {children.map((child) => {
                                const active = matches(child.href, pathname);
                                return (
                                  <li key={child.key}>
                                    <Link href={child.href} onClick={onClose} aria-current={active ? "page" : undefined}
                                      className={cn("flex items-center gap-2 rounded-[10px] px-3 py-2 text-[14px] transition-colors", active ? "bg-[#f3edf7] font-semibold text-[#6c3d8e]" : "text-[#5d5861] hover:bg-[#faf7fc] hover:text-[#6c3d8e]")}>
                                      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", active ? "bg-[#884fb4]" : "bg-[#d5c4e3]")} />
                                      {child.label}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              }
              const active = matches(href, pathname);
              return (
                <motion.li key={key} {...item(index)}>
                  <Link href={href} onClick={onClose} aria-current={active ? "page" : undefined} className={rowClass(active)}>
                    <span className={iconTileClass(active)}><NavIcon name={key} className="size-[18px]" /></span>
                    <span className="flex-1">{t(key)}</span>
                    {active && <span aria-hidden="true" className="size-2 rounded-full bg-[#884fb4]" />}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        <motion.div className="border-t border-[#efe7f5] px-5 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]" {...item(HEADER_LINKS.length)}>
          {settings.whatsapp && <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"
            className="flex min-h-12 items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(90deg,#85B7BC_0%,#80549E_100%)] px-4 text-[14px] font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#884fb4]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.4 7.5L3 20.5l1.4-5a8.5 8.5 0 1 1 16.1-3.8Z" /><path d="M8.4 8.2c.2-.4.4-.4.7-.4h.6c.2 0 .4.1.5.4l.8 1.8c.1.3 0 .5-.2.7l-.6.7c.7 1.3 1.8 2.3 3.1 3l.7-.7c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.5v.6c0 .3 0 .5-.4.7-.5.3-1.1.4-1.7.3-3.4-.6-6.1-3.3-6.7-6.7-.1-.6 0-1.2.3-1.5Z" /></svg>
            {tMenu("whatsapp")}
          </a>}
          <div className="mt-4 flex items-center justify-between gap-3">
            <LocaleSwitcher />
            <SocialLinks links={settings.socials} className="text-[#6c3d8e]" />
          </div>
        </motion.div>
      </motion.aside>
    </div>
  );
}

export default function MobileMenu({ isOpen, onClose, settings, services = [] }) {
  return <AnimatePresence>{isOpen && <MenuPanel key="menu" onClose={onClose} settings={settings} services={services} />}</AnimatePresence>;
}
