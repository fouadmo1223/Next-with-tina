import { cache } from "react";
import { pickLocale } from "@/lib/localize";
import { paginate, readCollection, readDoc } from "@/lib/content";
import { handleImageLink } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

// Server only. Services come from content/services (edited in the Tina dashboard); `toService` turns one into what the site shows.
export const getService = cache(async (id) => readDoc("services", id));

export const getServiceBySlug = cache(async (slug, locale) =>
  (await readCollection("services")).find((service) => pickLocale(service.slug, locale) === slug) ?? null);

// Returns { items, pagination }.
export const getServices = cache(async (page = 1, limit = 10) => paginate(await readCollection("services"), page, limit));

// The site's services as menu links ({ key, label, href }) for the header, mobile menu and footer.
// Services switched off, or with no slug or title in this language, are left out.
export async function getNavServices(locale) {
  const { items } = await getServices(1, 100);
  return items.filter((service) => service?.isActive !== false)
    .map((service) => toService(service, locale))
    .filter((service) => service?.slug && service.title)
    .map((service) => ({ key: service.id, label: service.title, href: ROUTES.service(service.slug) }));
}

// One service in the current language. Empty values stay empty so the parts that use them can be hidden.
export function toService(service, locale) {
  if (!service) return null;
  return {
    id: service._id,
    slug: pickLocale(service.slug, locale),
    title: pickLocale(service.title, locale),
    description: pickLocale(service.description, locale),
    image: handleImageLink(service.image) ?? "",
    icon: handleImageLink(service.icon) ?? "",
    points: (service.features ?? []).map((feature) => pickLocale(feature, locale)).filter(Boolean),
  };
}
