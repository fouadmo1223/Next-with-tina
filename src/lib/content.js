import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

// Server only. Everything the site shows comes from the JSON files in /content, which the Tina dashboard (/admin) edits.
// Records are stored with { ar, en } fields and get `_id` = their file name, so the
// `toService`, `toCountry`, `toCv` and `toBlog` mappers work on them unchanged.

const ROOT = path.join(process.cwd(), "content");
const SAFE_ID = /^[\w.-]+$/;

// "content/services/abc.json" (how Tina stores a reference) → "abc". A bare id passes through.
export function idFromRef(ref) {
  if (!ref || typeof ref !== "string") return "";
  return path.posix.basename(ref.replaceAll("\\", "/"), ".json");
}

async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return null;
  }
}

// One document by id, with `_id` added, or null.
export const readDoc = cache(async (collection, ref) => {
  const id = idFromRef(ref);
  if (!id || !SAFE_ID.test(id)) return null;
  const data = await readJson(path.join(ROOT, collection, `${id}.json`));
  return data ? { _id: id, ...data } : null;
});

// Every document of a collection, ordered by file name (the imported records' ids are in creation order).
export const readCollection = cache(async (collection) => {
  let names = [];
  try {
    names = await fs.readdir(path.join(ROOT, collection));
  } catch {
    return [];
  }
  const docs = await Promise.all(names.filter((name) => name.endsWith(".json")).sort().map((name) => readDoc(collection, name)));
  return docs.filter(Boolean);
});

// The list helpers return { items, pagination }.
export function paginate(all, page = 1, limit = 10) {
  const size = Math.max(1, Number(limit) || 10);
  const current = Math.max(1, Number(page) || 1);
  const start = (current - 1) * size;
  return {
    items: all.slice(start, start + size),
    pagination: { page: current, limit: size, total: all.length, totalPages: Math.max(1, Math.ceil(all.length / size)), hasMore: start + size < all.length },
  };
}
