import { cache } from "react";
import { pickLocale } from "@/lib/localize";
import { paginate, readCollection, readDoc } from "@/lib/content";
import { handleImageLink } from "@/lib/utils";

// Server only. Posts come from content/blogs (edited in the Tina dashboard); `toBlog` turns one into what the site shows.

// A post by its `identifierId`, the short code its page's URL carries.
export const getBlogByIdentifier = cache(async (identifier) =>
  (await readCollection("blogs")).find((blog) => blog.identifierId === identifier) ?? null);

// A post by its id (its file name), which is how the home page picks the posts it features.
export const getBlog = cache(async (id) => readDoc("blogs", id));

// Returns { items, pagination }, newest first.
export const getBlogs = cache(async (page = 1, limit = 18) => {
  const all = [...await readCollection("blogs")].sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")));
  return paginate(all, page, limit);
});

// A post's date in the page's language, as "10 نوفمبر 2026" / "10 November 2026" (Gregorian, Saudi time, Latin digits),
// with its ISO form for <time dateTime>. Null when the date is missing or invalid.
export function blogDate(value, locale) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  const label = new Intl.DateTimeFormat(locale === "ar" ? "ar-u-ca-gregory-nu-latn" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Riyadh" }).format(date);
  return { label, iso: date.toISOString() };
}

// One blog post in the current language. Empty values stay empty so the parts that use them can be hidden.
export function toBlog(blog, locale) {
  const id = blog?.id ?? blog?._id;
  if (!id) return null;
  const tags = (blog.tags ?? []).map((tag) => (typeof tag === "string" ? tag.trim() : pickLocale(tag, locale))).filter(Boolean);
  return {
    id,
    // The short code the post is linked by. A post without one gets no link.
    identifier: typeof blog.identifierId === "string" ? blog.identifierId.trim() : "",
    slug: pickLocale(blog.slug, locale),
    title: pickLocale(blog.title, locale),
    excerpt: pickLocale(blog.shortDescription, locale),
    body: pickLocale(blog.description, locale),
    image: handleImageLink(blog.image) ?? "",
    date: blogDate(blog.createdAt, locale),
    tag: tags[0] ?? "",
    faqs: (blog.faqs ?? []).map((faq) => ({ question: pickLocale(faq?.question, locale), answer: pickLocale(faq?.answer, locale) }))
      .filter((faq) => faq.question && faq.answer),
    meta: { title: pickLocale(blog.meta?.title, locale), description: pickLocale(blog.meta?.description, locale) },
  };
}
