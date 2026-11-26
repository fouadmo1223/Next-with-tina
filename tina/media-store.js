// The dashboard's media library, backed by public/uploads on your own server (see src/pages/api/tina-media.js).
// Used both when editing locally and on the server, so uploads behave the same everywhere.
const API = "/api/tina-media";

async function failure(response) {
  const body = await response.json().catch(() => null);
  return new Error(body?.message || `Media request failed (${response.status})`);
}

export class ServerMediaStore {
  accept = "image/*,application/pdf";
  maxSize = 25 * 1024 * 1024;

  async persist(files) {
    const uploaded = [];
    for (const { directory, file } of files) {
      const body = new FormData();
      body.append("directory", directory || "");
      body.append("file", file);
      const response = await fetch(API, { method: "POST", body, credentials: "same-origin" });
      if (!response.ok) throw await failure(response);
      uploaded.push(await response.json());
    }
    return uploaded;
  }

  async delete(media) {
    const target = [media.directory, media.filename].filter(Boolean).join("/");
    const response = await fetch(`${API}?path=${encodeURIComponent(target)}`, { method: "DELETE", credentials: "same-origin" });
    if (!response.ok) throw await failure(response);
  }

  async list(options = {}) {
    const query = new URLSearchParams({ directory: options.directory || "", offset: String(options.offset || 0), limit: String(options.limit || 50) });
    const response = await fetch(`${API}?${query}`, { credentials: "same-origin" });
    if (!response.ok) throw await failure(response);
    const { items, nextOffset } = await response.json();
    // The library shows thumbnails at the sizes it asks for; the original file serves for all of them.
    const sizes = options.thumbnailSizes || [{ w: 75, h: 75 }, { w: 400, h: 400 }, { w: 1000, h: 1000 }];
    return {
      items: items.map((item) => (item.type === "file"
        ? { ...item, thumbnails: Object.fromEntries(sizes.map(({ w, h }) => [`${w}x${h}`, item.src])) }
        : item)),
      nextOffset,
    };
  }

  parse(media) {
    return media.src;
  }
}
