"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ROUTES } from "@/constants/routes";
import { NAV_ICONS } from "@/constants/navIcons";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "home", href: ROUTES.home },
  { key: "countries", href: ROUTES.countries },
  { key: "cvs", href: ROUTES.cvs },
  { key: "blog", href: ROUTES.blog },
];

const slide = { type: "spring", stiffness: 420, damping: 34, mass: .8 };
const matches = (href, pathname) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

// App-style tabs for phones and tablets; the header menu still holds the other pages.
export default function MobileTabBar() {
  const t = useTranslations("mobileTabs");
  const pathname = usePathname();
  const reduced = useReducedMotion();
  // The tapped tab lights up straight away instead of waiting for the next page to load.
  const [pending, setPending] = useState(null);
  const activeKey = pending && pending.from === pathname ? pending.key : TABS.find(({ href }) => matches(href, pathname))?.key;
  const transition = reduced ? { duration: 0 } : slide;

  return (
    <nav aria-label={t("label")} className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e8dced] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-18px_rgba(45,30,56,0.35)] backdrop-blur-md min-[968px]:hidden">
      <ul className="mx-auto grid h-[72px] max-w-[560px] grid-cols-4 px-2">
        {TABS.map(({ key, href }) => {
          const active = key === activeKey;
          return (
            <li key={key}>
              <Link href={href} aria-current={matches(href, pathname) ? "page" : undefined}
                onClick={() => !matches(href, pathname) && setPending({ key, from: pathname })}
                className={cn("relative flex h-full flex-col items-center justify-center gap-1 text-[12px] transition-colors duration-300 focus-visible:rounded-lg focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#884fb4]", active ? "font-bold text-[#6c3d8e]" : "font-medium text-[#706877] hover:text-[#6c3d8e]")}>
                {active && <motion.span layoutId="mobile-tab-bar" transition={transition} aria-hidden="true" className="absolute top-0 h-[3px] w-10 rounded-b-full bg-[#6c3d8e]" />}
                <span className={cn("relative flex h-8 w-12 items-center justify-center", active && "text-white")}>
                  {active && <motion.span layoutId="mobile-tab-pill" transition={transition} aria-hidden="true" className="absolute inset-0 rounded-xl bg-[#6c3d8e] shadow-[0_5px_12px_-6px_rgba(108,61,142,0.85)]" />}
                  <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="relative size-[22px]"
                    initial={false} animate={{ scale: active ? 1.05 : 1, strokeWidth: active ? 2 : 1.7 }} transition={transition}>
                    {NAV_ICONS[key].map((d) => <path key={d} d={d} />)}
                  </motion.svg>
                </span>
                {t(key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
