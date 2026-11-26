// A post's date with a small calendar icon. `date` is { label, iso } (see blogDate in lib/blogs); nothing shows without it.
export default function PostDate({ date, className = "" }) {
  if (!date?.label) return null;
  return (
    <time dateTime={date.iso} className={`inline-flex items-center gap-1.5 text-[13px] leading-none font-normal text-[#8a8290] ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-[15px] shrink-0" stroke="#85b7bc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
      </svg>
      {date.label}
    </time>
  );
}
