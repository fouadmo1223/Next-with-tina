import localFont from "next/font/local";


import "../globals.css";
import "swiper/css";

const norsal = localFont({
  src: [
    { path: "../../../public/fonts/alfont_com_Norsal-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../../public/fonts/alfont_com_Norsal-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../../public/fonts/alfont_com_Norsal-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../../public/fonts/alfont_com_Norsal-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../../public/fonts/alfont_com_Norsal-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-norsal",
  display: "swap",
});


import { getMessages, setRequestLocale } from "next-intl/server";
import { getSiteSettings } from "@/lib/settings";
import { getNavServices } from "@/lib/services";
import { routing } from "@/i18n/routing";
import Providers from "@/providers/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";
import { notFound } from "next/navigation";
import { getDir } from "@/lib/utils";

// Content is read from the files on every request, so a save in the Tina dashboard shows on the next page load
// without rebuilding the site.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const settings = await getSiteSettings(locale);
  const home = settings.pagesMeta.home ?? {};
  const title = home.title || settings.name;
  const description = home.description || settings.description;
  return {
    ...(title && { title: { default: title, ...(settings.name && { template: `%s | ${settings.name}` }) } }),
    ...(description && { description }),
    ...(settings.favicon && { icons: { icon: settings.favicon } }),
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) notFound();
  setRequestLocale(locale);

  const [messages, settings, services] = await Promise.all([getMessages({ locale }), getSiteSettings(locale), getNavServices(locale)]);
  const dir = getDir(locale);

  return (
    <html lang={locale} dir={dir} className={`${norsal.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-white text-neutral-900">
    <Providers key={locale} locale={locale} messages={messages} settings={settings}>

      <Header settings={settings} services={services} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <MobileTabBar />
    </Providers>
      </body>
    </html>
  );
}

