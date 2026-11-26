"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Logo from "@/components/common/Logo";
import Navigation from "@/components/layout/Navigation";
import LocaleSwitcher from "@/components/common/LocaleSwitcher";
import MobileMenu from "@/components/layout/MobileMenu";
import Container from "@/components/layout/Container";
import SocialLinks from "@/components/common/SocialLinks";
import { HEADER_LINKS } from "@/constants/routes";

// `services` are the dashboard's services as { key, label, href }; they fill the services menu.
export default function Header({ settings, services = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const locale = useLocale();
  const tMenu = useTranslations("menu");

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className="relative z-40 w-full bg-[linear-gradient(106.93deg,#A36FCF_8.89%,#884FB4_44.79%,#6C3D8E_102.63%)] text-white"
      >
        <Container className="flex h-[100px] items-center gap-4 min-[1401px]:gap-10" dir={locale === "ar" ? "rtl" : "ltr"}>
          <Logo src={settings.logo} name={settings.name} entranceIndex={0} className="size-[65px]" />
          <Navigation services={services} className="hidden min-[968px]:block" />
          <LocaleSwitcher variant="header" entranceIndex={HEADER_LINKS.length + 1} />
          <SocialLinks links={settings.socials} entranceIndex={HEADER_LINKS.length + 2} className="hidden shrink-0 text-white min-[1200px]:flex" />
          <div className="flex flex-1 justify-end min-[968px]:hidden">
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label={tMenu("open")}
              aria-expanded={isMenuOpen}
              className="flex size-10 items-center justify-center rounded-lg border border-white/40 text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} settings={settings} services={services} />
    </>
  );
}
