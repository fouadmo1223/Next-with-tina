import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import RowScaleItem from "@/components/animation/RowScaleItem";

// `src` and `name` come from the site settings; the white tile keeps a transparent logo readable on the purple header.
export default function Logo({ src, name, className, entranceIndex }) {
  if (!src) return null;
  const Element = entranceIndex === undefined ? Link : RowScaleItem;
  return (
    <Element
      {...(entranceIndex === undefined ? {} : { as: "link", index: entranceIndex })}
      href="/"
      className={cn("inline-flex shrink-0 transition-opacity hover:opacity-90", className)}
      aria-label={name}
    >
      <Image src={src} alt={name} width={100} height={100} className="block size-full rounded-[20px] bg-white object-contain p-[6%]" priority />
    </Element>
  );
}
