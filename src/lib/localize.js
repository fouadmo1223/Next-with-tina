// One language out of a { ar, en } content field, trimmed. No fallback to the other language: missing stays "".
export function pickLocale(value, locale) {
  const text = typeof value === "object" && value !== null ? value[locale] : value;
  return typeof text === "string" ? text.trim() : "";
}
