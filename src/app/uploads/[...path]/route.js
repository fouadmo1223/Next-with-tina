import fs from "node:fs/promises";
import path from "node:path";

// Serves files from public/uploads that were uploaded in the Tina dashboard after the server started.
// (Next.js only serves the public files it saw at startup; files that existed then are still served directly.)
export const dynamic = "force-dynamic";

const ROOT = path.resolve(/* turbopackIgnore: true */ process.cwd(), "public/uploads");
const TYPES = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif",
  ".svg": "image/svg+xml", ".avif": "image/avif", ".ico": "image/x-icon", ".pdf": "application/pdf",
};

export async function GET(_request, { params }) {
  const { path: parts = [] } = await params;
  const file = path.resolve(/* turbopackIgnore: true */ ROOT, ...parts.map((part) => decodeURIComponent(part)));
  const type = TYPES[path.extname(file).toLowerCase()];
  if (!type || !file.startsWith(ROOT + path.sep)) return new Response("Not found", { status: 404 });
  try {
    const body = await fs.readFile(file);
    return new Response(body, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
        // An SVG opened on its own can't run scripts.
        ...(type === "image/svg+xml" && { "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox" }),
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
