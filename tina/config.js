import { defineConfig, LocalAuthProvider } from "tinacms";
import { TinaUserCollection, UsernamePasswordAuthJSProvider } from "tinacms-authjs/dist/tinacms";

// Content lives as JSON files in /content and images in /public/uploads; both are edited at /admin. There is no API.
// Tina is fully self-hosted:
//  - Local editing (`npm run dev`, TINA_PUBLIC_IS_LOCAL=true): no login, saves go straight to the files.
//  - On your server (`npm run build` + `npm start`): editors log in (Users collection), saves are written to the
//    server's files and committed/pushed with git. See DEPLOY.md.
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

// ---------------------------------------------------------------- field helpers

const text = (name, label, extra = {}) => ({ type: "string", name, label, ...extra });
const longText = (name, label, extra = {}) => text(name, label, { ui: { component: "textarea" }, ...extra });
const image = (name, label, extra = {}) => ({ type: "image", name, label, ...extra });
const link = (name, label) => text(name, label, { description: "A page path such as /request, or a full URL." });
const group = (name, label, fields, extra = {}) => ({ type: "object", name, label, fields, ...extra });
const list = (name, label, fields, itemLabel, extra = {}) => ({
  type: "object", name, label, list: true, fields,
  ui: { itemProps: (item) => ({ label: (typeof itemLabel === "function" ? itemLabel(item) : item?.[itemLabel]) || label }) },
  ...extra,
});

// A field kept in both languages, stored as { ar, en } (used by the shared records: services, countries, CVs, posts).
const both = (name, label, { long = false, ...extra } = {}) => group(name, label, [
  (long ? longText : text)("ar", "العربية"),
  (long ? longText : text)("en", "English"),
], extra);

// A reference picker that shows each record's title instead of its file name.
const pick = (name, label, collection) => ({
  type: "reference", name, label, collections: [collection],
  ui: { optionComponent: (values, sys) => values?.title?.ar || values?.title?.en || sys?.filename || "" },
});

// Records are named after their slug when created here (existing ones keep the IDs they had in the old dashboard).
const filenameFromSlug = {
  slugify: (values) => String(values?.slug?.en || values?.title?.en || "").trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `item-${Date.now()}`,
};

const singleDocument = { allowedActions: { create: false, delete: false } };

// ---------------------------------------------------------------- home page (one document per language)

const home = {
  name: "home",
  label: "Home page",
  path: "content/home",
  format: "json",
  ui: { ...singleDocument },
  fields: [
    group("seo", "SEO", [
      text("title", "Page title", { description: "Shown in the browser tab and search results. Empty uses the site name." }),
      longText("description", "Meta description", { description: "Empty uses the site description." }),
    ]),

    group("hero", "1 · Hero", [
      image("image", "Image"),
      text("title", "Title (first line)"),
      text("titleHighlight", "Title (highlighted line)"),
      longText("subtitle", "Intro text"),
      text("cta", "Main button label"),
      link("ctaHref", "Main button link"),
      text("ctaSecondary", "Second button label"),
      link("ctaSecondaryHref", "Second button link"),
      list("pills", "Floating pills", [image("icon", "Icon"), text("text", "Text")], "text"),
    ]),

    group("about", "2 · About the company", [
      text("eyebrow", "Small label above the heading"),
      text("headingStart", "Heading (first line)"),
      text("headingAccent", "Heading (coloured line)"),
      longText("bodyOne", "Paragraph 1"),
      longText("bodyTwo", "Paragraph 2"),
      text("cta", "WhatsApp button label"),
      longText("whatsappMessage", "WhatsApp pre-filled message"),
      image("consultationImage", "Photo 1 (consultation)"),
      image("workerImage", "Photo 2 (worker)"),
      text("photoCta", "Text on the photo link"),
    ]),

    group("features", "3 · How we deliver (feature cards)", [
      text("headingStart", "Heading (first line)"),
      text("headingAccent", "Heading (coloured line)"),
      longText("intro", "Intro"),
      list("items", "Cards", [image("image", "Icon"), text("title", "Title"), longText("description", "Text")], "title"),
    ]),

    group("services", "4 · Services", [
      text("heading", "Heading"),
      longText("intro", "Intro"),
      list("items", "Services shown", [pick("service", "Service", "service"), text("cta", "Button label")], "cta"),
    ]),

    group("professions", "5 · Professions (tabs)", [
      text("heading", "Heading"),
      longText("intro", "Intro"),
      list("items", "Professions", [
        image("icon", "Tab icon"),
        text("title", "Title"),
        text("subtitle", "Subtitle"),
        text("stepsTitle", "Steps heading"),
        image("photo", "Photo (standing cut-out, about 274×346)"),
        text("badge", "Badge on the photo"),
        list("steps", "Steps", [text("title", "Step title"), longText("description", "Step text")], "title"),
      ], "title"),
    ]),

    group("cvs", "6 · CVs", [
      text("heading", "Heading"),
      longText("intro", "Intro"),
      list("items", "CVs shown first", [pick("cv", "CV", "cv")], () => "CV"),
    ]),

    group("countries", "7 · Recruitment countries", [
      text("heading", "Heading"),
      longText("intro", "Intro"),
      list("items", "Countries shown", [
        pick("country", "Country", "country"),
        image("image", "Card image (optional, replaces the country's flag)"),
      ], () => "Country"),
    ]),

    group("offers", "8 · Offers", [
      text("heading", "Heading"),
      longText("intro", "Intro"),
      image("image", "Image"),
      text("cta", "WhatsApp button label"),
      longText("whatsappMessage", "WhatsApp pre-filled message"),
      list("items", "Offers", [image("icon", "Icon"), text("title", "Title"), longText("description", "Text")], "title"),
    ]),

    group("requirements", "9 · Requirements", [
      text("heading", "Heading"),
      longText("intro", "Intro"),
      text("cta", "WhatsApp button label"),
      longText("whatsappMessage", "WhatsApp pre-filled message"),
      ...[["documents", "Documents folder"], ["procedures", "Procedures folder"]].map(([name, label]) => group(name, label, [
        text("title", "Title"),
        text("subtitle", "Subtitle"),
        image("icon", "Icon"),
        text("items", "Checklist lines", { list: true }),
      ])),
    ]),

    group("testimonials", "10 · Testimonials", [
      text("heading", "Heading"),
      longText("intro", "Intro"),
      list("items", "Testimonials", [
        { type: "number", name: "rating", label: "Rating (0–5, 0 hides the stars)" },
        longText("quote", "Quote"),
        image("avatar", "Photo"),
        text("name", "Name"),
        text("role", "Role"),
      ], "name"),
    ]),

    group("blog", "11 · Blog", [
      text("heading", "Heading"),
      longText("intro", "Intro"),
      text("viewAll", "“View all” label"),
      list("items", "Posts shown", [pick("post", "Post", "blog")], () => "Post"),
    ]),

    group("faq", "12 · FAQ", [
      text("heading", "Heading"),
      list("items", "Questions", [text("question", "Question"), longText("answer", "Answer")], "question"),
    ]),

    group("cta", "13 · Call to action", [
      image("image", "Image"),
      text("heading", "Heading"),
      longText("description", "Text"),
      group("whatsapp", "WhatsApp button", [
        { type: "boolean", name: "enabled", label: "Show" }, text("label", "Label"), longText("message", "Pre-filled message"),
      ]),
      ...[["request", "Request button"], ["cvs", "CVs button"], ["contact", "Contact button"]].map(([name, label]) => group(name, label, [
        { type: "boolean", name: "enabled", label: "Show" }, text("label", "Label"), link("href", "Link"),
      ])),
    ]),

    group("contact", "14 · Contact form", [
      text("headingStart", "Heading (first line)"),
      text("headingAccent", "Heading (coloured line)"),
      longText("intro", "Intro"),
      text("formTitle", "Form title"),
      text("submit", "Send button label"),
    ]),
  ],
};

// ---------------------------------------------------------------- site settings

const settings = {
  name: "settings",
  label: "Site settings",
  path: "content/settings",
  format: "json",
  ui: { ...singleDocument },
  fields: [
    both("appName", "Site name"),
    both("appDesc", "Site description", { long: true }),
    image("appLogo", "Logo"),
    image("favicon", "Favicon"),
    text("phone", "Phone", { description: "Saudi numbers can be written as 05xxxxxxxx." }),
    text("whatsapp", "WhatsApp number", { description: "Empty uses the phone number." }),
    text("email", "Email"),
    both("address", "Address", { long: true }),
    text("locationLink", "Map link"),
    both("copyright", "Copyright line"),
    list("socials", "Social links", [
      text("platform", "Platform", { description: "TikTok, Snapchat, X, Instagram, Facebook, LinkedIn, YouTube, WhatsApp" }),
      text("url", "URL"),
      image("icon", "Icon"),
    ], "platform"),
  ],
};

// ---------------------------------------------------------------- shared records

const service = {
  name: "service",
  label: "Services",
  path: "content/services",
  format: "json",
  ui: { filename: filenameFromSlug },
  fields: [
    both("title", "Title"),
    both("slug", "Slug (URL)"),
    both("description", "Short description", { long: true }),
    image("image", "Image"),
    image("icon", "Icon"),
    list("features", "Points", [text("ar", "العربية"), text("en", "English")], (item) => item?.ar || item?.en),
    { type: "boolean", name: "isActive", label: "Show in the menus" },
  ],
};

const country = {
  name: "country",
  label: "Countries",
  path: "content/countries",
  format: "json",
  ui: { filename: filenameFromSlug },
  fields: [
    both("title", "Name"),
    both("slug", "Slug (URL)"),
    both("description", "Short description", { long: true }),
    image("image", "Flag / image"),
  ],
};

const cv = {
  name: "cv",
  label: "CVs",
  path: "content/cvs",
  format: "json",
  ui: { filename: filenameFromSlug },
  fields: [
    both("title", "Name"),
    both("slug", "Slug (URL)"),
    pick("country", "Nationality", "country"),
    both("profession", "Profession"),
    both("religion", "Religion"),
    { type: "number", name: "age", label: "Age" },
    { type: "number", name: "experienceYears", label: "Years of experience" },
    { type: "number", name: "monthlySalary", label: "Monthly salary (SAR)" },
    { type: "number", name: "recruitmentFee", label: "Recruitment fee (SAR)" },
    { type: "number", name: "externalOfficeFee", label: "External office fee (SAR)" },
    image("image", "Photo"),
    image("cvImage", "CV image"),
    image("file", "CV PDF"),
  ],
};

const blog = {
  name: "blog",
  label: "Blog posts",
  path: "content/blogs",
  format: "json",
  ui: { filename: filenameFromSlug },
  fields: [
    both("title", "Title"),
    both("slug", "Slug"),
    text("identifierId", "Link code", { description: "The post's URL is /blogs/<this code>." }),
    both("shortDescription", "Excerpt", { long: true }),
    image("image", "Cover image"),
    { type: "datetime", name: "createdAt", label: "Published" },
    list("tags", "Tags", [text("ar", "العربية"), text("en", "English")], (item) => item?.ar || item?.en),
  ],
};

// Editor logins, kept in content/users/index.json with hashed passwords (PBKDF2). A password change or a new editor
// is saved to that file and committed like any other edit, so logins survive every redeploy and re-index.
const editors = { ...TinaUserCollection, label: "Editors (logins)", isDetached: false };

// Two ways to run the dashboard on your server (see DEPLOY.md and TINACLOUD.md):
//  - Self-hosted (default): logins and saving handled by this site, works with any git host.
//  - TinaCloud: set NEXT_PUBLIC_TINA_CLIENT_ID and TINA_TOKEN. Logins and saving go through tina.io (GitHub only).
// `npm run dev` is always local editing, whichever mode the server uses.
const clientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "";
const useTinaCloud = Boolean(clientId) && !isLocal;
const collections = [home, settings, service, country, cv, blog];

const selfHosted = {
  // The dashboard talks to this site's own backend (src/pages/api/tina).
  contentApiUrlOverride: "/api/tina/gql",
  authProvider: isLocal ? new LocalAuthProvider() : new UsernamePasswordAuthJSProvider(),
  // Uploads are stored in public/uploads on the server that runs the site (tina/media-store.js).
  media: { loadCustomStore: async () => (await import("./media-store")).ServerMediaStore },
  schema: { collections: [...collections, editors] },
};

const tinaCloud = {
  clientId,
  token: process.env.TINA_TOKEN || "",
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.GIT_BRANCH || "main",
  // Uploads are committed to the GitHub repo in public/uploads by TinaCloud.
  media: { tina: { mediaRoot: "uploads", publicFolder: "public" } },
  schema: { collections },
};

export default defineConfig({
  build: { outputFolder: "admin", publicFolder: "public" },
  ...(useTinaCloud ? tinaCloud : selfHosted),
});
