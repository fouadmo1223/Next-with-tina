import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import Logo from "@/components/common/Logo";
import SocialLinks from "@/components/common/SocialLinks";
import FooterNewsletter from "@/components/layout/FooterNewsletter";
import { ROUTES } from "@/constants";

const linkClass = "text-[14px] text-white/85 transition-colors hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const headingClass = "text-[20px] font-bold text-white";
const linkStagger = .09;
const columnsDelay = .25;
const contactDelay = columnsDelay + 5 * linkStagger + .15;
const newsletterDelay = contactDelay + 3 * .14 + .1;

const columns = [
  {
    key: "linksTitle",
    links: [
      { namespace: "nav", key: "home", href: ROUTES.home },
      { namespace: "nav", key: "cvs", href: ROUTES.cvs },
      { namespace: "nav", key: "blog", href: ROUTES.blog },
      { namespace: "nav", key: "faq", href: ROUTES.faq },
      { namespace: "footer", key: "privacy", href: ROUTES.privacy },
    ],
  },
  {
    key: "discoverTitle",
    links: [
      { namespace: "nav", key: "countries", href: ROUTES.countries },
      { namespace: "nav", key: "request", href: "/request" },
      { namespace: "nav", key: "about", href: ROUTES.about },
      { namespace: "nav", key: "contact", href: ROUTES.contact },
      { namespace: "footer", key: "terms", href: ROUTES.terms },
    ],
  },
];

const contactIcons = {
  email: <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm-.6 1.2L12 13l8.6-5.8" />,
  phone: <path d="M21 16.4v2.7a1.8 1.8 0 0 1-2 1.8 17.8 17.8 0 0 1-7.8-2.8 17.5 17.5 0 0 1-5.4-5.4A17.8 17.8 0 0 1 3 4.9a1.8 1.8 0 0 1 1.8-2h2.7A1.8 1.8 0 0 1 9.3 4.5c.1.9.3 1.7.6 2.5a1.8 1.8 0 0 1-.4 1.9L8.4 10a14.4 14.4 0 0 0 5.4 5.4l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.5.6a1.8 1.8 0 0 1 1.7 1.9Z" />,
  address: <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Zm-8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
};

function ContactItem({ icon, label, href, external, delay, wide, children }) {
  const body = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f3edf7] sm:size-11">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-[#6c3d8e]">{contactIcons[icon]}</svg>
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-bold text-white">{label}</span>
        <span className="mt-0.5 block text-[11px] leading-[1.6] [overflow-wrap:anywhere] text-white/85 min-[360px]:text-[12px] sm:text-[13px]">{children}</span>
      </span>
    </>
  );
  return (
    <Reveal as="li" duration={.5} delay={delay} className={wide ? "col-span-2" : undefined}>
      {href ? <a href={href} {...(external && { target: "_blank", rel: "noreferrer" })} className="flex items-start gap-2 rounded text-start transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:gap-3">{body}</a> : <div className="flex items-start gap-2 text-start sm:gap-3">{body}</div>}
    </Reveal>
  );
}

export default function Footer({ settings }) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const label = ({ namespace, key }) => (namespace === "nav" ? tNav(key) : t(key));

  return (
    <RevealSection as="footer" amount={.15} className="relative isolate overflow-hidden bg-white pt-24 pb-[calc(4.5rem+env(safe-area-inset-bottom))] text-white min-[968px]:pt-24 min-[968px]:pb-0 lg:pt-28">
      <Image src="/home/footer-bg.svg" alt="" fill sizes="100vw" className="-z-20 object-cover object-top" />
      <svg viewBox="0 0 290 310" aria-hidden="true" className="pointer-events-none absolute top-[0%] left-0 -z-10 hidden w-[190px] md:block"><path d="M0 0H290C290 60 265 110 180 110C120 110 60 95 30 115C5 135 30 200 22 250C18 280 8 300 0 310Z" fill="#B9C3DE" fillOpacity=".75" /></svg>
      {/* Mirrored from the professions section: the small circle rides the big one's edge and turns back at the screen edge. */}
      <svg viewBox="0 0 234 543" fill="none" aria-hidden="true" className="pointer-events-none absolute top-8 right-0 -z-10 hidden w-[120px] -scale-x-100 overflow-visible md:block">
        <g opacity=".22">
          <circle cx="-7.439" cy="195.902" r="178.832" fill="#fff" fillOpacity=".71" />
          <g className="[animation:orbit-border_8s_ease-in-out_infinite_alternate] [transform-box:view-box] [transform-origin:-7.439px_195.902px]">
            <circle cx="171.393" cy="195.902" r="38.205" fill="#fff" />
          </g>
        </g>
      </svg>

      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,.7fr)_minmax(0,.7fr)_minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-8">
          <div className="col-span-2 lg:col-span-1">
            {(settings.logo || settings.name) && <Reveal duration={.5} className="w-fit"><Logo src={settings.logo} name={settings.name} className="size-20" /></Reveal>}
            {settings.description && <Reveal as="p" duration={.5} delay={.12} className="mt-4 max-w-[380px] text-[14px] leading-[1.9] text-white/90">{settings.description}</Reveal>}
            {settings.socials.length > 0 && <Reveal duration={.5} delay={.24} className="mt-5 flex flex-wrap items-center gap-4">
              <span className="text-[15px] font-bold">{t("follow")}</span>
              <SocialLinks links={settings.socials} className="text-white" />
            </Reveal>}
          </div>

          {columns.map((column, columnIndex) => (
            <nav key={column.key} aria-label={t(column.key)}>
              <Reveal as="h2" duration={.5} delay={columnsDelay + columnIndex * .1} className={headingClass}>{t(column.key)}</Reveal>
              <ul className="mt-4 space-y-3">
                {column.links.map((link, index) => <Reveal as="li" key={link.key} duration={.45} delay={columnsDelay + columnIndex * .1 + (index + 1) * linkStagger}><Link href={link.href} className={linkClass}>{label(link)}</Link></Reveal>)}
              </ul>
            </nav>
          ))}

          <ul className="col-span-2 grid grid-cols-2 gap-x-3 gap-y-5 sm:col-span-1 sm:block sm:space-y-4">
            {settings.email && <ContactItem icon="email" delay={contactDelay} label={t("email")} href={`mailto:${settings.email}`}><span dir="ltr">{settings.email}</span></ContactItem>}
            {settings.phone && <ContactItem icon="phone" delay={contactDelay + .14} label={t("phone")} href={settings.phoneLink ? `tel:+${settings.phoneLink}` : undefined}><span dir="ltr">{settings.phone}</span></ContactItem>}
            {settings.address && <ContactItem icon="address" delay={contactDelay + .28} label={t("address")} href={settings.locationLink || undefined} external wide>{settings.address}</ContactItem>}
          </ul>

          {settings.email && <div className="col-span-2 sm:col-span-1">
            <Reveal as="h2" duration={.5} delay={newsletterDelay} className={headingClass}>{t("newsletterTitle")}</Reveal>
            <Reveal duration={.5} delay={newsletterDelay + .14}>
              <FooterNewsletter email={settings.email} placeholder={t("newsletterPlaceholder")} submit={t("newsletterSubmit")} subject={t("newsletterSubject")} />
            </Reveal>
          </div>}
        </div>
        {settings.copyright ? <Reveal as="p" duration={.5} delay={newsletterDelay + .3} className="mt-12 border-t border-white/20 py-6 text-center text-[14px] text-white/90">{settings.copyright}</Reveal> : <div className="mt-12" />}
      </Container>
    </RevealSection>
  );
}
