import Image from "next/image";
import { cn } from "@/lib/utils";
import RowScaleItem from "@/components/animation/RowScaleItem";

const DRAWN_ICONS = ["facebook", "x", "instagram", "linkedin"];

// Known platforms keep their drawn icons; any other platform uses the icon uploaded in the dashboard.
function SocialIcon({ icon, image }) {
  if (!DRAWN_ICONS.includes(icon) && image) {
    return <Image src={image} alt="" width={16} height={16} className="object-contain" />;
  }
  if (icon === "facebook") {
    return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.8 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H8v3.2h2.4V21h3.4Z" /></svg>;
  }
  if (icon === "x") {
    return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 3H21l-6.6 7.5L22 21h-6l-4.7-6.5L5.6 21H3.5l7-8L3 3h6.2l4.2 5.9L18.9 3Zm-1 16.2h1.2L8.4 4.7H7.1l10.8 14.5Z" /></svg>;
  }
  if (icon === "instagram") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.2 8.5H2.4V21h2.8V8.5ZM3.8 2.8a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM21 13.8c0-3.3-1.8-5.1-4.3-5.1a3.8 3.8 0 0 0-3.4 1.9V8.5h-2.8V21h2.8v-6.5c0-1.7.8-2.8 2.3-2.8 1.6 0 2.4 1.1 2.4 2.8V21H21v-7.2Z" /></svg>;
}

export default function SocialLinks({ links = [], className, entranceIndex }) {
  if (!links.length) return null;
  const Element = entranceIndex === undefined ? "a" : RowScaleItem;
  return (
    <div className={cn("flex items-center gap-3", className)} aria-label="Social media">
      {links.map(({ name, icon, url, image }, index) => (
        <Element {...(entranceIndex === undefined ? {} : { as: "a", index: entranceIndex + index })} key={`${icon}-${url}`} href={url} target="_blank" rel="noopener noreferrer" aria-label={name} className="inline-flex size-5 items-center justify-center transition-opacity hover:opacity-70 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current">
          <span key="label" className="sr-only">{name}</span>
          <span key="icon" className="size-4 [&_svg]:size-full"><SocialIcon icon={icon} image={image} /></span>
        </Element>
      ))}
    </div>
  );
}
