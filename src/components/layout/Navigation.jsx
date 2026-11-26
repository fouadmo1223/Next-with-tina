"use client";

import ServicesDropdown from "./ServicesDropdown";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { HEADER_LINKS } from "@/constants/routes";
import { cn } from "@/lib/utils";
import RowScaleItem from "@/components/animation/RowScaleItem";

export default function Navigation({ className, onLinkClick, services = [] }) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className={cn("min-w-0 flex-1", className)} aria-label="Main navigation">
      <ul className="mx-16 flex items-center justify-center gap-6 whitespace-nowrap" role="list">
        {HEADER_LINKS.map(({ key, href, services: hasServices }, index) => {
          const children = hasServices ? services : null;
          if (hasServices && services.length === 0) return null;
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href)) || children?.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`));

          return (
            <RowScaleItem key={key} index={index + 1}>
              {children ? (
                <ServicesDropdown label={t(key)} items={children} isActive={isActive} onLinkClick={onLinkClick} />
              ) : (
                <Link
                  href={href}
                  onClick={onLinkClick}
                  aria-current={isActive ? "page" : undefined}
                  className={cn("inline-flex items-center rounded-lg px-2 py-3 text-[16px] text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white", isActive ? "font-semibold" : "font-normal")}
                >
                  {t(key)}
                </Link>
              )}
            </RowScaleItem>
          );
        })}
      </ul>
    </nav>
  );
}
