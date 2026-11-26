"use client";

import { createContext, useContext } from "react";

// Filled by the layout with the settings it fetched on the server; client components read the contact details from here.
const SiteSettingsContext = createContext({});

export function SiteSettingsProvider({ value, children }) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
