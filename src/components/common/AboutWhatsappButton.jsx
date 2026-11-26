import GradientLink from "@/components/common/GradientLink";

const icon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.4 7.5L3 20.5l1.4-5a8.5 8.5 0 1 1 16.1-3.8Z" /><path d="M8.4 8.2c.2-.4.4-.4.7-.4h.6c.2 0 .4.1.5.4l.8 1.8c.1.3 0 .5-.2.7l-.6.7c.7 1.3 1.8 2.3 3.1 3l.7-.7c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.5v.6c0 .3 0 .5-.4.7-.5.3-1.1.4-1.7.3-3.4-.6-6.1-3.3-6.7-6.7-.1-.6 0-1.2.3-1.5Z" /></svg>;

// Outside links (WhatsApp) open in a new tab.
export default function AboutWhatsappButton({ href, children }) {
  const external = /^https?:\/\//.test(href);
  return <GradientLink href={href} className="mt-7" icon={icon} {...(external && { target: "_blank", rel: "noreferrer" })}>{children}</GradientLink>;
}
