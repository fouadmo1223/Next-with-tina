export const ROUTES = {
  home: "/",
  about: "/about",
  services: "/services",
  service: (slug) => `/services/${slug}`,
  cvs: "/cvs",
  cv: (slug) => `/cvs/${slug}`,
  countries: "/countries",
  faq: "/faqs",
  requirements: "/requirements",
  country: (slug) => `/countries/${slug}`,
  portfolio: "/portfolio",
  blog: "/blogs",
  // A post's URL carries its `identifierId` (the "Link code" field in Tina).
  blogPost: (identifier) => `/blogs/${identifier}`,
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
};

export const HEADER_LINKS = [
  { key: "home", href: "/" },
  { key: "countries", href: "/countries" },
  { key: "cvs", href: "/cvs" },
  // Its links are the dashboard's services (getNavServices); with none, the entry is hidden.
  { key: "services", href: "/services", services: true },
  { key: "blog", href: "/blogs" },
  { key: "contact", href: "/contact" },
  { key: "request", href: "/request" },
];
