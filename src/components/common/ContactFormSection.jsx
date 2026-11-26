import { whatsappHref } from "@/lib/utils";
import Container from "@/components/layout/Container";
import { Reveal, RevealSection } from "@/components/animation/Reveal";
import ChatIllustration from "@/components/common/ChatIllustration";
import ContactForm from "@/components/common/ContactForm";

const formDelay = 1;

const channelIcons = {
  whatsapp: <path d="M20.5 11.7a8.5 8.5 0 0 1-12.4 7.5L3 20.5l1.4-5a8.5 8.5 0 1 1 16.1-3.8ZM8.4 8.2c.2-.4.4-.4.7-.4h.6c.2 0 .4.1.5.4l.8 1.8c.1.3 0 .5-.2.7l-.6.7c.7 1.3 1.8 2.3 3.1 3l.7-.7c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.5v.6c0 .3 0 .5-.4.7-.5.3-1.1.4-1.7.3-3.4-.6-6.1-3.3-6.7-6.7-.1-.6 0-1.2.3-1.5Z" />,
  email: <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm-.6 1.2L12 13l8.6-5.8" />,
};

// Everything the section needs. The texts come from the dashboard (`texts`: two heading lines, intro, form title and send
// button label), the channels from the site settings, and the field labels and toasts from the "homeContact" messages.
export function getContactProps(t, settings, { headingStart, headingAccent, intro, formTitle, submit } = {}) {
  return {
    headingStart, headingAccent, intro,
    channels: [
      { key: "whatsapp", label: t("channels.whatsapp"), value: settings.phone, href: whatsappHref(settings.whatsapp) },
      { key: "email", label: t("channels.email"), value: settings.email, href: `mailto:${settings.email}` },
    ],
    form: {
      whatsapp: settings.whatsapp,
      title: formTitle, name: t("form.name"), phone: t("form.phone"), phoneHint: t("form.phoneHint"), email: t("form.email"), details: t("form.details"), detailsHint: t("form.detailsHint"),
      submit, sending: t("form.sending"), success: t("form.success"), error: t("form.error"), close: t("form.close"),
    },
  };
}

// Every part is optional: a part with no value is simply not shown.
export default function ContactFormSection({ headingStart, headingAccent, intro, channels = [], form }) {
  const hasHeading = headingStart || headingAccent;
  const shownChannels = channels.filter((channel) => channel.value);
  return (
    <RevealSection aria-labelledby={hasHeading ? "home-contact-heading" : undefined} className="relative isolate overflow-hidden bg-white py-8 lg:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,56%)] lg:gap-12">
        <div>
          {hasHeading && (
            <h2 id="home-contact-heading" className="text-[clamp(30px,3.4vw,50px)] leading-[1.35] font-semibold">
              {headingStart && <Reveal as="span" className="block text-[#6c3d8e]">{headingStart}</Reveal>}
              {headingAccent && <Reveal as="span" delay={.2} className="block text-[#85b7bc]">{headingAccent}</Reveal>}
            </h2>
          )}
          {intro && <Reveal as="p" delay={.45} className="mt-3 max-w-[480px] text-[15px] leading-[1.8] text-[#5d5861]">{intro}</Reveal>}
          {shownChannels.length > 0 && <ul className="mt-6 space-y-4">
            {shownChannels.map((channel, index) => (
              <Reveal as="li" key={channel.key} delay={.7 + index * .15} duration={.5}>
                <a href={channel.href} target={channel.key === "whatsapp" ? "_blank" : undefined} rel={channel.key === "whatsapp" ? "noreferrer" : undefined} className="group inline-flex items-center gap-3 rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#884fb4]">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#eef7f5] transition-colors duration-300 group-hover:bg-[#85b7bc]">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="#85B7BC" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5 transition-colors duration-300 group-hover:stroke-white">{channelIcons[channel.key]}</svg>
                  </span>
                  <span>
                    <span className="block text-[13px] text-[#5d5861]">{channel.label}</span>
                    <span dir="ltr" className="mt-0.5 block text-[18px] font-bold text-[#3d3442] transition-colors duration-300 group-hover:text-[#6c3d8e] rtl:text-right">{channel.value}</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>}
          <Reveal from="fade" delay={1.3} className="mt-8 flex justify-center lg:justify-start">
            <ChatIllustration className="h-auto w-[300px] lg:w-[340px]" />
          </Reveal>
        </div>
        <div className="relative isolate pt-[2.9%] pr-[9.5%] pb-[2.9%] pl-[2.2%]">
          {/* The fragment lets the SVG stretch when the form is taller than its natural shape. */}
          <Reveal from="clipDown" duration={.9} delay={formDelay} ease={[0.65, 0, 0.35, 1]} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <img src="/home/contatc-fprm-bg.svg#svgView(preserveAspectRatio(none))" alt="" className="size-full" />
          </Reveal>
          <ContactForm delay={formDelay} labels={form} />
        </div>
      </Container>
    </RevealSection>
  );
}
