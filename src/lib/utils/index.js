export { cn } from "./cn";

/**
 * Resolve an image value from the content. Tina stores uploads as site paths ("/uploads/x.png", served from /public);
 * full URLs are returned untouched, and a bare "uploads/x.png" gets its leading slash.
 */
export function handleImageLink(image) {
  if (!image) return null;

  // Usually a string; an object (`{ url }`, `{ src }`, `{ path }`, `{ value }` or a localized `{ ar, en }`) is unwrapped.
  const src =
    typeof image === "string"
      ? image
      : image.image ||
        image.url ||
        image.src ||
        image.path ||
        image.value ||
        image.ar ||
        image.en;

  if (typeof src !== "string" || !src) return null;
  if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
  return `/${src}`;
}

/**
 * Strip tags/entities from CMS rich text so it can be used as a meta
 * description (fields come back as e.g. "<p>&nbsp;desc</p>").
 */
export function toPlainText(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pick the right language out of a content field shaped like { ar, en }.
 * Plain strings pass through, so it's safe on either shape.
 */
export function getLocalized(value, locale, fallback = "") {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  return value[locale] || value.ar || value.en || fallback;
}

/**
 * Normalize a link coming from the CMS into something `<Link href>` accepts.
 * Editors enter paths inconsistently ("contact" in one block, "/services" in
 * the next), so a leading slash is added when it's missing. Absolute URLs and
 * mailto/tel/hash links are left untouched.
 */
export function normalizeHref(value) {
  const str = String(value ?? "").trim();
  if (!str) return null;
  if (/^(https?:|mailto:|tel:|#|\/\/)/i.test(str)) return str;
  return `/${str.replace(/^\/+/, "")}`;
}

/**
 * Map a CMS section of `type: "image"` blocks into the `{src, alt}` shape the
 * marquee/gallery components take. Image paths are resolved by
 * `handleImageLink`; blocks without a usable value are dropped.
 *
 * The CMS carries no alt text for these blocks, so `alt` is left empty —
 * correct for decorative brand marks, which is what this section holds.
 */
export function sectionImages(section) {
  const items = section?.items ?? [];

  return items
    .map((item) => handleImageLink(item?.blocks?.[0]?.value))
    .filter(Boolean)
    .map((src) => ({ src, alt: "" }));
}

const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "tiff", "avif"]);

/**
 * Galleries can mix plain images with video links (e.g. YouTube), all as
 * bare URLs with no `type` field to tell them apart — so this checks the
 * extension instead.
 */
export function isImageUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split(".").pop().toLowerCase();
    return IMAGE_EXTS.has(ext);
  } catch {
    return false;
  }
}

export function formatDate(date, locale = "ar", options = {}) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(new Date(date));
}

export function truncate(str, length = 100) {
  if (!str || str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function isRTL(locale) {
  return locale === "ar";
}

export function getDir(locale) {
  return isRTL(locale) ? "rtl" : "ltr";
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/** A wa.me chat link to `number`, with `message` typed in when there is one. */
// Whether next/image should send `src` as it is instead of resizing it. Dashboard uploads are resized and compressed on the
// live site; while developing they're sent as they are, since the dev server's resizer times out on large remote files. SVGs
// can't be resized at all.
export function skipImageOptimizer(src) {
  if (typeof src !== "string") return false;
  return /\.svg(?:[?#]|$)/i.test(src) || (process.env.NODE_ENV === "development" && /^https?:\/\//.test(src));
}

export function whatsappHref(number, message) {
  if (!number) return "";
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
