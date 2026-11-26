import { cache } from "react";
import { pickLocale } from "@/lib/localize";
import { paginate, readCollection, readDoc } from "@/lib/content";
import { handleImageLink } from "@/lib/utils";

// Server only. CVs come from content/cvs (edited in the Tina dashboard); `toCv` turns one into what the site shows.
// A CV's nationality is a reference to a country file; the country is read and filled in here.
async function withCountry(cv) {
  if (!cv) return null;
  const country = typeof cv.country === "string" ? await readDoc("countries", cv.country) : cv.country ?? null;
  return { ...cv, country };
}

const allCvs = cache(async () => Promise.all((await readCollection("cvs")).map(withCountry)));

export const getCv = cache(async (id) => withCountry(await readDoc("cvs", id)));

export const getCvBySlug = cache(async (slug, locale) => (await allCvs()).find((cv) => pickLocale(cv.slug, locale) === slug) ?? null);

const inRange = (value, min, max) => {
  if (min === undefined && max === undefined) return true;
  if (!Number.isFinite(value)) return false;
  return (min === undefined || value >= Number(min)) && (max === undefined || value <= Number(max));
};
const has = (value) => value !== undefined && value !== null && value !== "";

// Returns { items, pagination }. Filters: country slug, profession in the given language,
// exact age / experience, or their min / max ranges. Empty filters are ignored.
export async function getCvs({ page = 1, limit = 10, locale = "ar", ...filters } = {}) {
  const items = (await allCvs()).filter((cv) => {
    if (has(filters.country) && pickLocale(cv.country?.slug, locale) !== filters.country) return false;
    if (has(filters.profession) && pickLocale(cv.profession, locale) !== filters.profession) return false;
    if (has(filters.age) && cv.age !== Number(filters.age)) return false;
    if (has(filters.experienceYears) && cv.experienceYears !== Number(filters.experienceYears)) return false;
    return inRange(cv.age, filters.minAge ?? undefined, filters.maxAge ?? undefined)
      && inRange(cv.experienceYears, filters.minExperienceYears ?? undefined, filters.maxExperienceYears ?? undefined);
  });
  return paginate(items, page, limit);
}

// Distinct profession names in the requested language.
export const getCvProfessions = cache(async (locale) =>
  [...new Set((await allCvs()).map((cv) => pickLocale(cv.profession, locale)).filter(Boolean))]);

// The age and experience choices in the filter bar, as min/max values. Their labels are "homeCvs.options.*".
export const CV_RANGES = {
  age: { under30: { maxAge: 29 }, from30to40: { minAge: 30, maxAge: 40 }, over40: { minAge: 41 } },
  experience: { upTo3: { maxExperienceYears: 3 }, from4to7: { minExperienceYears: 4, maxExperienceYears: 7 }, over7: { minExperienceYears: 8 } },
};

// What a CV card shows, from a `toCv` result. `t` is the "homeCvs" translator; a stat with no value is left out.
export function toCvCard(cv, t) {
  const stats = {
    nationality: cv.country?.name && { label: t("filters.nationality"), value: cv.country.name },
    profession: cv.profession && { label: t("filters.profession"), value: cv.profession },
    age: cv.age !== null && { label: t("filters.age"), value: t("ageValue", { count: cv.age }) },
    experience: cv.experience !== null && { label: t("filters.experience"), value: t("experienceValue", { count: cv.experience }) },
  };
  const price = { cost: cv.recruitmentFee !== null ? t("costValue", { amount: cv.recruitmentFee.toLocaleString("en-US") }) : "", installment: "" };
  return { id: cv.id, slug: cv.slug, name: cv.name, avatar: cv.avatar, price, stats: Object.fromEntries(Object.entries(stats).filter(([, value]) => value)) };
}

const number = (value) => (Number.isFinite(value) ? value : null);

// One CV in the current language. Empty values stay empty so the parts that use them can be hidden.
export function toCv(cv, locale) {
  if (!cv?._id) return null;
  const country = typeof cv.country === "object" && cv.country !== null ? cv.country : null;
  return {
    id: cv._id,
    slug: pickLocale(cv.slug, locale),
    name: pickLocale(cv.title, locale),
    avatar: handleImageLink(cv.image) ?? "",
    country: country ? { slug: pickLocale(country.slug, locale), name: pickLocale(country.title, locale) } : null,
    profession: pickLocale(cv.profession, locale),
    age: number(cv.age),
    experience: number(cv.experienceYears),
    religion: pickLocale(cv.religion, locale),
    salary: number(cv.monthlySalary),
    recruitmentFee: number(cv.recruitmentFee),
    externalOfficeFee: number(cv.externalOfficeFee),
    document: handleImageLink(cv.cvImage) ?? "",
    pdf: handleImageLink(cv.file) ?? "",
  };
}
