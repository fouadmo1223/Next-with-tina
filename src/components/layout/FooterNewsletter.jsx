"use client";

import { useState } from "react";
import { RollText } from "@/components/common/LetterRollLink";

// There is no mailing-list service yet, so signing up opens a pre-filled email to the team.
export default function FooterNewsletter({ email, placeholder, submit, subject }) {
  const [hovered, setHovered] = useState(false);

  const send = (event) => {
    event.preventDefault();
    const address = new FormData(event.currentTarget).get("email");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(address)}`;
  };

  return (
    <form onSubmit={send} className="mt-4 flex items-center gap-2 border-b border-white/45 pb-2.5 transition-colors focus-within:border-white">
      <input name="email" type="email" required autoComplete="email" aria-label={placeholder} placeholder={placeholder}
        className="h-10 min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-white/85 focus:outline-none" />
      <button type="submit" aria-label={submit} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={(event) => setHovered(event.currentTarget.matches(":focus-visible"))} onBlur={() => setHovered(false)}
        className="flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-[8px] border border-[#85b7bc] bg-[#85b7bc] px-3.5 text-[13px] font-bold text-white transition-colors hover:border-white hover:bg-transparent focus-visible:border-white focus-visible:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        <RollText text={submit} active={hovered} />
        <svg viewBox="0 0 24 16" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-5 ltr:-scale-x-100"><path d="M23 8H1m6-6.5L1 8l6 6.5" /></svg>
      </button>
    </form>
  );
}
