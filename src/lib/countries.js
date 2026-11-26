import { cache } from "react";
import { pickLocale } from "@/lib/localize";
import { paginate, readCollection, readDoc } from "@/lib/content";
import { handleImageLink } from "@/lib/utils";

// Server only. Countries come from content/countries (edited in the Tina dashboard); `toCountry` turns one into what the site shows.
export const getCountry = cache(async (id) => readDoc("countries", id));

export const getCountryBySlug = cache(async (slug, locale) =>
  (await readCollection("countries")).find((country) => pickLocale(country.slug, locale) === slug) ?? null);

// Returns { items, pagination }.
export const getCountries = cache(async (page = 1, limit = 10) => paginate(await readCollection("countries"), page, limit));

// One country in the current language. Empty values stay empty so the parts that use them can be hidden.
export function toCountry(country, locale) {
  if (!country) return null;
  return {
    id: country._id,
    slug: pickLocale(country.slug, locale),
    name: pickLocale(country.title, locale),
    description: pickLocale(country.description, locale),
    flag: handleImageLink(country.image) ?? "",
  };
}
