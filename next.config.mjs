import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Tina's database (SQLite) is a native module: load it from node_modules at runtime instead of bundling it.
  serverExternalPackages: ["sqlite-level", "better-sqlite3"],
  images: {
    qualities: [75, 85],
    // Resized images are kept for 30 days: uploads get a new file name when they change, so a long cache is safe.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // The Tina dashboard is a static app built into public/admin; /admin opens it.
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
};

export default withNextIntl(nextConfig);
