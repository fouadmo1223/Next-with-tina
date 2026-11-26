"use server";

import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { CV_RANGES, getCvs, toCv, toCvCard } from "@/lib/cvs";

const RESULTS_LIMIT = 24;
const text = (value) => (typeof value === "string" ? value.trim().slice(0, 80) : "");

// The home page CVs filter bar's search over the CV files in content/cvs (edited in the Tina dashboard).
// Anyone can call this, so it only accepts the filter bar's own choices: a country slug, a profession,
// and the known age and experience ranges.
export async function searchCvs(filters, locale) {
  const language = routing.locales.includes(locale) ? locale : routing.defaultLocale;
  const pick = (value) => (value && value !== "all" ? value : "");
  const { items } = await getCvs({
    page: 1, limit: RESULTS_LIMIT, locale: language,
    country: text(pick(filters?.nationality)),
    profession: text(pick(filters?.profession)),
    ...(CV_RANGES.age[pick(filters?.age)] ?? {}),
    ...(CV_RANGES.experience[pick(filters?.experience)] ?? {}),
  });
  const t = await getTranslations({ locale: language, namespace: "homeCvs" });
  return items.map((item) => toCv(item, language)).filter((cv) => cv && cv.name).map((cv) => toCvCard(cv, t));
}
