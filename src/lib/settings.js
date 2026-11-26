import { cache } from "react";
import { readDoc } from "@/lib/content";
import { handleImageLink } from "@/lib/utils";
import { routing } from "@/i18n/routing";

// Server only: the site settings come from content/settings/site.json, and each page's SEO from its own document
// (for now the home page's content/home/<locale>.json), all edited in the Tina dashboard.
const SOCIAL_NAMES = { facebook: "Facebook", x: "X", twitter: "X", instagram: "Instagram", linkedin: "LinkedIn", snapchat: "Snapchat", tiktok: "TikTok", youtube: "YouTube", whatsapp: "WhatsApp" };
const ENTITIES = { "&nbsp;": " ", "&amp;": "&", "&quot;": "\"", "&#39;": "'", "&lt;": "<", "&gt;": ">" };

// Older values may hold HTML; the site only needs their text.
const toText = (value) => (typeof value === "string" ? value.replace(/<[^>]*>/g, " ").replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity] ?? entity).replace(/\s+/g, " ").trim() : "");
const localized = (field, locale) => toText(field?.[locale]);

// Saudi numbers come in as 05xxxxxxxx; WhatsApp and tel links need 9665xxxxxxxx.
function toInternational(number) {
  const digits = String(number ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("966")) return digits;
  if (digits.startsWith("0")) return `966${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith("5")) return `966${digits}`;
  return digits;
}

export const getSiteSettings = cache(async (locale) => {
  const [data, home] = await Promise.all([readDoc("settings", "site"), readDoc("home", routing.locales.includes(locale) ? locale : routing.defaultLocale)]);
  const settings = data ?? {};
  const phone = toText(settings.phone);
  const socials = (Array.isArray(settings.socials) ? settings.socials : [])
    .filter((social) => social?.url)
    .map(({ platform, url, icon }) => {
      const key = String(platform ?? "").toLowerCase();
      return { name: SOCIAL_NAMES[key] ?? platform ?? url, icon: key, url, image: handleImageLink(icon) ?? "" };
    });

  return {
    name: localized(settings.appName, locale),
    description: localized(settings.appDesc, locale),
    email: toText(settings.email),
    phone,
    phoneLink: toInternational(phone),
    // The WhatsApp number, or the phone number when there is no separate one.
    whatsapp: toInternational(settings.whatsapp) || toInternational(phone),
    address: localized(settings.address, locale),
    locationLink: toText(settings.locationLink),
    copyright: localized(settings.copyright, locale),
    logo: handleImageLink(settings.appLogo) ?? "",
    favicon: handleImageLink(settings.favicon) ?? "",
    socials,
    // Each page's title and description for search engines, by page key.
    pagesMeta: { home: { title: toText(home?.seo?.title), description: toText(home?.seo?.description) } },
  };
});
