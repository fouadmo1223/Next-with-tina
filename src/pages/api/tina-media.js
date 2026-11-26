import fs from "node:fs/promises";
import path from "node:path";
import { getAuthProvider, selfHostedApiEnabled } from "../../../tina/server/auth";
import { commitFiles } from "../../../tina/server/git-provider";

// The dashboard's media library: lists, uploads and deletes files in public/uploads on this server.
// Uploads and deletions are committed and pushed with git like content saves, so the repository keeps them.
// Self-hosted mode only: in TinaCloud mode, TinaCloud stores uploads in the GitHub repo and this API is switched off.
//   GET    /api/tina-media?directory=&offset=&limit=   list a folder
//   POST   /api/tina-media  (multipart: directory, file) upload
//   DELETE /api/tina-media?path=dir/file.png             delete

export const config = { api: { bodyParser: false } };

const MEDIA_DIR = "public/uploads";
const ROOT = path.resolve(/* turbopackIgnore: true */ process.cwd(), MEDIA_DIR);
const MAX_SIZE = 25 * 1024 * 1024;
const ALLOWED = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif", ".ico", ".pdf"]);

// A folder or file inside public/uploads, from a client-supplied relative path. Anything that escapes it is refused.
function resolveInside(relative = "") {
  const clean = String(relative).replaceAll("\\", "/").replace(/^\/+/, "");
  const target = path.resolve(/* turbopackIgnore: true */ ROOT, clean);
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) throw Object.assign(new Error("Invalid path"), { status: 400 });
  return { target, relative: path.relative(ROOT, target).split(path.sep).join("/") };
}

const toMedia = (directory, filename, type) => {
  const rel = [directory, filename].filter(Boolean).join("/");
  return { type, id: rel, filename, directory, src: type === "file" ? `/uploads/${rel}` : undefined };
};

// "My Photo (1).PNG" → "my-photo-1.png"; Arabic letters are kept.
function safeName(name) {
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, path.extname(name)).normalize("NFC").toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "file";
  return { base, ext };
}

async function uniqueName(dir, base, ext) {
  for (let i = 0; ; i++) {
    const name = i ? `${base}-${i}${ext}` : `${base}${ext}`;
    try {
      await fs.access(path.join(dir, name));
    } catch {
      return name;
    }
  }
}

async function list(req, res) {
  const { directory = "", offset = "0", limit = "50" } = req.query;
  const { target, relative } = resolveInside(directory);
  let entries = [];
  try {
    entries = await fs.readdir(target, { withFileTypes: true });
  } catch {
    entries = [];
  }
  const items = entries
    .filter((entry) => !entry.name.startsWith("."))
    .map((entry) => toMedia(relative, entry.name, entry.isDirectory() ? "dir" : "file"))
    .sort((a, b) => (a.type === b.type ? a.filename.localeCompare(b.filename) : a.type === "dir" ? -1 : 1));
  const start = Math.max(0, Number(offset) || 0);
  const size = Math.min(200, Math.max(1, Number(limit) || 50));
  const page = items.slice(start, start + size);
  res.status(200).json({ items: page, nextOffset: start + size < items.length ? start + size : undefined });
}

async function upload(req, res) {
  const request = new Request(`http://localhost${req.url}`, { method: "POST", headers: req.headers, body: req, duplex: "half" });
  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return res.status(400).json({ message: "No file received." });
  if (file.size > MAX_SIZE) return res.status(413).json({ message: "The file is larger than 25 MB." });
  const { base, ext } = safeName(file.name);
  if (!ALLOWED.has(ext)) return res.status(415).json({ message: `“${ext || file.name}” files can't be uploaded. Use images or PDF.` });

  const { target, relative } = resolveInside(form.get("directory") || "");
  await fs.mkdir(target, { recursive: true });
  const filename = await uniqueName(target, base, ext);
  await fs.writeFile(path.join(target, filename), Buffer.from(await file.arrayBuffer()));
  const media = toMedia(relative, filename, "file");
  commitFiles([`${MEDIA_DIR}/${media.id}`], `Upload ${media.id} (Tina)`);
  res.status(200).json(media);
}

async function remove(req, res) {
  const { target, relative } = resolveInside(req.query.path);
  if (target === ROOT) return res.status(400).json({ message: "Invalid path" });
  await fs.rm(target, { recursive: true, force: true });
  commitFiles([`${MEDIA_DIR}/${relative}`], `Delete ${relative} (Tina)`);
  res.status(200).json({ ok: true });
}

export default async function tinaMedia(req, res) {
  if (!selfHostedApiEnabled) return res.status(404).json({ message: "Not found" });
  try {
    const auth = await getAuthProvider().isAuthorized(req, res);
    if (!auth.isAuthorized) return res.status(auth.errorCode || 401).json({ message: auth.errorMessage || "Not signed in" });
    if (req.method === "GET") return await list(req, res);
    if (req.method === "POST") return await upload(req, res);
    if (req.method === "DELETE") return await remove(req, res);
    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("[tina-media]", error);
    return res.status(error.status || 500).json({ message: error.status ? error.message : "Something went wrong with the media library." });
  }
}
