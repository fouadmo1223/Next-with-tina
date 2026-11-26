"use client";

import { useLocale } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import RowScaleItem from "@/components/animation/RowScaleItem";

const baseClass =
  "flex h-8 min-w-9 items-center justify-center rounded-[8px] px-2 text-[13px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

const variants = {
  default: {
    group: "border-[#e0d1ed]",
    active: "bg-[#6c3d8e] text-white",
    inactive: "text-[#6c3d8e] hover:bg-[#f3edf7] focus-visible:outline-[#6c3d8e]",
  },
  header: {
    group: "border-white/40",
    active: "bg-[#85b7bc] text-white",
    inactive: "text-white hover:bg-white/15 focus-visible:outline-white",
  },
};

export default function LocaleSwitcher({ className, variant = "default", entranceIndex }) {
  const Element = entranceIndex === undefined ? "div" : RowScaleItem;
  const locale = useLocale();
  const pathname = usePathname();
  const styles = variants[variant];

  return (
    <Element
      {...(entranceIndex === undefined ? {} : { as: "div", index: entranceIndex })}
      className={cn("flex items-center gap-1 rounded-[11px] border p-1", styles.group, className)}
      role="group"
      aria-label="Switch language"
    >
      {routing.locales.map((loc) => {
        const isActive = locale === loc;

        if (isActive) {
          return (
            <span
              key={loc}
              aria-current="page"
              className={cn(baseClass, "cursor-default", styles.active)}
            >
              {loc.toUpperCase()}
            </span>
          );
        }

        return (
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            className={cn(baseClass, styles.inactive)}
          >
            {loc.toUpperCase()}
          </Link>
        );
      })}
    </Element>
  );
}
