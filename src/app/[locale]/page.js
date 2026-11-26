import PageSections from "@/components/common/PageSections";
import SectionBoundary from "@/components/common/SectionBoundary";
import FloatingPillsHero from "@/components/common/FloatingPillsHero";
import AboutCompanySection from "@/components/common/AboutCompanySection";
import FeaturesSection from "@/components/pages/home/FeaturesSection";
import ServicesSection from "@/components/pages/home/ServicesSection";
import ProfessionsSection from "@/components/pages/home/ProfessionsSection";
import CvsBrowserSection from "@/components/common/CvsBrowserSection";
import RecruitmentCountriesSection from "@/components/common/RecruitmentCountriesSection";
import OffersSection from "@/components/pages/home/OffersSection";
import RequirementsSection from "@/components/pages/home/RequirementsSection";
import TestimonialsSection from "@/components/pages/home/TestimonialsSection";
import BlogSection from "@/components/pages/home/BlogSection";
import FaqSection from "@/components/common/FaqSection";
import CallToActionSection from "@/components/common/CallToActionSection";
import ContactFormSection, { getContactProps } from "@/components/common/ContactFormSection";
import { getHomePage } from "@/lib/home";
import { getSiteSettings } from "@/lib/settings";
import { getService, toService } from "@/lib/services";
import { getCountries, getCountry, toCountry } from "@/lib/countries";
import { CV_RANGES, getCv, getCvProfessions, toCv, toCvCard } from "@/lib/cvs";
import { searchCvs } from "@/app/actions/cvs";
import { getBlog, toBlog } from "@/lib/blogs";
import { handleImageLink, normalizeHref, whatsappHref } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

// The page's content is content/home/<locale>.json, edited in the Tina dashboard at /admin ("Home page").
// Its title and description come from the layout (the document's SEO fields, or the site name and description).

// True when a section has anything to show: some text, number or image anywhere in it (on/off switches don't count).
const hasContent = (value) => {
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return true;
  if (Array.isArray(value)) return value.some(hasContent);
  if (value && typeof value === "object") return Object.values(value).some(hasContent);
  return false;
};
const img = (value) => handleImageLink(value) ?? "";
const items = (section) => (Array.isArray(section?.items) ? section.items.filter(Boolean) : []);

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [
    home, settings, { items: countryList }, cvProfessions,
    [tServices, tProfessions, tCvs, tCountries, tTestimonials, tBlog, tFaq, tContact],
  ] = await Promise.all([
    getHomePage(locale), getSiteSettings(locale), getCountries(1, 100), getCvProfessions(locale),
    Promise.all(["homeServices", "homeProfessions", "homeCvs", "homeCountries", "homeTestimonials", "homeBlog", "homeFaq", "homeContact"].map((namespace) => getTranslations(namespace))),
  ]);
  const {
    hero = {}, about = {}, features: featuresSection = {}, services: servicesSection = {}, professions: professionsSection = {},
    cvs: cvsSection = {}, countries: countriesSection = {}, offers: offersSection = {}, requirements: requirementsSection = {},
    testimonials: testimonialsSection = {}, blog: blogSection = {}, faq: faqSection = {}, cta: ctaSection = {}, contact: contactSection = {},
  } = home;

  // The records each section picks (services, CVs, countries, posts) are references to their own files.
  const [serviceList, pickedCvs, pickedCountries, postList] = await Promise.all([
    Promise.all(items(servicesSection).map(async ({ service: ref, cta }) => {
      const service = toService(await getService(ref), locale);
      return service && { ...service, cta, href: service.slug ? ROUTES.service(service.slug) : null };
    })),
    Promise.all(items(cvsSection).map(async ({ cv: ref }) => toCv(await getCv(ref), locale))),
    Promise.all(items(countriesSection).map(async ({ country: ref, image }, index) => {
      const country = toCountry(await getCountry(ref), locale);
      return country && { ...country, key: country.id ?? `country-${index}`, flag: img(image) || country.flag, href: country.slug ? ROUTES.country(country.slug) : null };
    })),
    Promise.all(items(blogSection).map(async ({ post: ref }) => {
      const post = toBlog(await getBlog(ref), locale);
      return post && { ...post, key: post.id, imageAlt: post.title, href: post.identifier ? ROUTES.blogPost(post.identifier) : null };
    })),
  ]);

  // Hero and about.
  const heroPills = items(hero.pills).map(({ icon, text }) => ({ icon: img(icon), text }));
  const aboutCtaHref = whatsappHref(settings.whatsapp, about.whatsappMessage);

  // Feature cards and services.
  const features = items(featuresSection).map(({ image, title, description }) => ({ image: img(image), title, description }));
  const services = serviceList.filter(Boolean);

  // Professions: each tab has an icon, title, subtitle, steps heading, photo, badge and its steps.
  const professions = items(professionsSection).map(({ icon, title, subtitle, stepsTitle, photo, badge, steps }, index) => ({
    key: `profession-${index}`, icon: img(icon), title, subtitle, stepsTitle, badge,
    // Photos are standing cut-outs that rise from the frame's floor; 238px wide keeps a 274×346 photo inside the 310px panel.
    image: photo && { src: img(photo), width: 274, height: 346, sizes: "320px", cutout: true, className: "bottom-0 left-1/2 w-[238px] max-w-none -translate-x-1/2" },
    steps: (steps ?? []).filter((step) => step?.title || step?.description).map(({ title: stepTitle, description }) => ({ title: stepTitle, description })),
  })).filter((profession) => profession.title || profession.subtitle || profession.icon);

  // CVs: the picked ones are the cards shown first; the filter bar then searches all CVs.
  const cvs = pickedCvs.filter((cv) => cv?.name).map((cv) => toCvCard(cv, tCvs));
  const cvFilters = [
    { key: "nationality", options: countryList.map((item) => toCountry(item, locale)).filter((country) => country?.slug && country.name).map((country) => ({ value: country.slug, label: country.name })) },
    { key: "profession", options: cvProfessions.map((profession) => ({ value: profession, label: profession })) },
    { key: "age", options: Object.keys(CV_RANGES.age).map((value) => ({ value, label: tCvs(`options.age.${value}`) })) },
    { key: "experience", options: Object.keys(CV_RANGES.experience).map((value) => ({ value, label: tCvs(`options.experience.${value}`) })) },
  ].filter((filter) => filter.options.length > 0).map((filter) => ({ ...filter, label: tCvs(`filters.${filter.key}`) }));
  const cvLabels = {
    ...Object.fromEntries(["all", "filter", "empty", "previous", "next", "browseAll", "viewCv"].map((key) => [key, tCvs(key)])),
    goTo: Array.from({ length: 24 }, (_, index) => tCvs("goTo", { page: index + 1 })),
  };

  const countries = pickedCountries.filter((country) => country && (country.name || country.flag));

  // Offers.
  const offers = items(offersSection).map(({ icon, title, description }) => ({ icon: img(icon), title, description }));

  // Requirements: two checklist folders.
  const requirementsCtaHref = whatsappHref(settings.whatsapp, requirementsSection.whatsappMessage);
  const toFolder = (folder) => {
    const result = { title: folder?.title, subtitle: folder?.subtitle, icon: img(folder?.icon), items: (folder?.items ?? []).filter(Boolean).map((label) => ({ label })) };
    return result.title || result.subtitle || result.icon || result.items.length ? result : null;
  };
  const documentsFolder = toFolder(requirementsSection.documents);
  const proceduresFolder = toFolder(requirementsSection.procedures);

  // Testimonials: anything that isn't a number from 0 to 5 hides the stars.
  const testimonials = items(testimonialsSection).map(({ rating, quote, avatar, name, role }) => {
    const stars = Math.min(5, Math.max(0, Number.parseFloat(rating) || 0));
    return { rating: stars, quote, avatar: img(avatar), name, role, ratingLabel: stars ? tTestimonials("ratingLabel", { rating: stars }) : "" };
  });

  const posts = postList.filter((post) => post && (post.title || post.image));

  // Call to action: four buttons, each switched on or off; WhatsApp takes a message instead of a link.
  const ctaButtons = ["whatsapp", "request", "cvs", "contact"].map((key) => {
    const button = ctaSection[key];
    if (!button?.enabled || !button.label) return null;
    if (key === "whatsapp") return { key, label: button.label, href: whatsappHref(settings.whatsapp, button.message) };
    return { key, label: button.label, href: normalizeHref(button.href) };
  }).filter(Boolean);

  // Contact: the channels come from the site settings; field labels and toasts keep their own texts.
  const contact = getContactProps(tContact, settings, {
    headingStart: contactSection.headingStart, headingAccent: contactSection.headingAccent, intro: contactSection.intro,
    formTitle: contactSection.formTitle, submit: contactSection.submit,
  });

  // FAQ: split evenly over two columns.
  const faqQuestions = items(faqSection).map(({ question, answer }, index) => ({ id: `faq-${index}`, question, answer })).filter((item) => item.question && item.answer);
  const faqFirstColumn = Math.ceil(faqQuestions.length / 2);
  const faq = [faqQuestions.slice(0, faqFirstColumn), faqQuestions.slice(faqFirstColumn)];

  return (
    <PageSections>
      {hasContent(hero) && <SectionBoundary>
        <FloatingPillsHero contained title={hero.title} titleHighlight={hero.titleHighlight} subtitle={hero.subtitle} image={img(hero.image)}
          cta={hero.cta} ctaHref={normalizeHref(hero.ctaHref)} ctaSecondary={hero.ctaSecondary} ctaSecondaryHref={normalizeHref(hero.ctaSecondaryHref)}
          pills={heroPills} />
      </SectionBoundary>}
      {hasContent(about) && <SectionBoundary>
        <AboutCompanySection eyebrow={about.eyebrow} headingStart={about.headingStart} headingAccent={about.headingAccent} bodyOne={about.bodyOne} bodyTwo={about.bodyTwo}
          cta={about.cta} ctaHref={aboutCtaHref} photoCta={about.photoCta} photoCtaHref="/about" consultationImage={img(about.consultationImage)} workerImage={img(about.workerImage)} />
      </SectionBoundary>}
      {/* The features band's tinted end runs into the services background. */}
      <div>
        {hasContent(featuresSection) && <SectionBoundary>
          <FeaturesSection headingStart={featuresSection.headingStart} headingAccent={featuresSection.headingAccent} intro={featuresSection.intro} features={features} />
        </SectionBoundary>}
        {(services.length > 0 || servicesSection.heading || servicesSection.intro) && <SectionBoundary>
          <ServicesSection heading={servicesSection.heading} intro={servicesSection.intro} services={services} dotLabels={services.map((_, index) => tServices("goTo", { page: index + 1 }))} />
        </SectionBoundary>}
      </div>
      {(professions.length > 0 || professionsSection.heading || professionsSection.intro) && <SectionBoundary>
        <ProfessionsSection heading={professionsSection.heading} intro={professionsSection.intro} tabsLabel={tProfessions("tabsLabel")} professions={professions} />
      </SectionBoundary>}
      {(cvs.length > 0 || cvsSection.heading || cvsSection.intro) && <SectionBoundary>
        <CvsBrowserSection defer heading={cvsSection.heading} intro={cvsSection.intro} cvs={cvs} filters={cvFilters} labels={cvLabels} search={searchCvs} />
      </SectionBoundary>}
      {(countries.length > 0 || countriesSection.heading || countriesSection.intro) && <SectionBoundary>
        <RecruitmentCountriesSection heading={countriesSection.heading} intro={countriesSection.intro} explore={tCountries("explore")} viewAll={tCountries("viewAll")} countries={countries} />
      </SectionBoundary>}
      {hasContent(offersSection) && <SectionBoundary>
        <OffersSection heading={offersSection.heading} intro={offersSection.intro} image={img(offersSection.image)} cta={offersSection.cta} whatsappMessage={offersSection.whatsappMessage} offers={offers} />
      </SectionBoundary>}
      {hasContent(requirementsSection) && <SectionBoundary>
        <RequirementsSection heading={requirementsSection.heading} intro={requirementsSection.intro} cta={requirementsSection.cta} ctaHref={requirementsCtaHref} documents={documentsFolder} procedures={proceduresFolder} />
      </SectionBoundary>}
      {(testimonials.length > 0 || testimonialsSection.heading || testimonialsSection.intro) && <SectionBoundary>
        <TestimonialsSection heading={testimonialsSection.heading} intro={testimonialsSection.intro} items={testimonials}
          labels={{ previous: tTestimonials("previous"), next: tTestimonials("next"), goTo: testimonials.map((_, index) => tTestimonials("goTo", { page: index + 1 })) }} />
      </SectionBoundary>}
      {(posts.length > 0 || blogSection.heading || blogSection.intro) && <SectionBoundary>
        <BlogSection heading={blogSection.heading} intro={blogSection.intro} viewAll={blogSection.viewAll} readMore={tBlog("readMore")} posts={posts} />
      </SectionBoundary>}
      {(faqQuestions.length > 0 || faqSection.heading) && <SectionBoundary>
        <FaqSection heading={faqSection.heading} columns={faq} viewAll={tFaq("viewAll")} />
      </SectionBoundary>}
      {hasContent(ctaSection) && <SectionBoundary>
        <CallToActionSection heading={ctaSection.heading} description={ctaSection.description} buttons={ctaButtons} image={img(ctaSection.image)} />
      </SectionBoundary>}
      {hasContent(contactSection) && <SectionBoundary>
        <ContactFormSection {...contact} />
      </SectionBoundary>}
    </PageSections>
  );
}
