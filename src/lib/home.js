import { cache } from "react";
import { readDoc } from "@/lib/content";
import { routing } from "@/i18n/routing";

// Server only. The home page's content in one language: content/home/<locale>.json, edited in the Tina dashboard.
// An unknown language falls back to the default one; a missing file gives an empty page rather than an error.
export const getHomePage = cache(async (locale) => {
  const language = routing.locales.includes(locale) ? locale : routing.defaultLocale;
  return (await readDoc("home", language)) ?? {};
});
