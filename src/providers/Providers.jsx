"use client";

import { NextIntlClientProvider } from "next-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import ThemeProvider from "./ThemeProvider";
import LenisProvider from "./LenisProvider";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";

if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
}

export default function Providers({ children, locale, messages, settings }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
          },
        },
      })
  );

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Asia/Riyadh"
    >
      <SiteSettingsProvider value={settings}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <LenisProvider>{children}</LenisProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SiteSettingsProvider>
    </NextIntlClientProvider>
  );
}
