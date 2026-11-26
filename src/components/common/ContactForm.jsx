"use client";

import { useState } from "react";
import { Reveal } from "@/components/animation/Reveal";
import GradientSubmitButton from "@/components/common/GradientSubmitButton";
import Toast from "@/components/common/Toast";
import { whatsappHref } from "@/lib/utils";

const fieldClass = "mt-1.5 block w-full rounded-[10px] border border-transparent bg-[#f3edf7] px-4 text-[15px] text-[#2f2835] transition-colors focus:border-[#6c3d8e] focus:bg-white focus:outline-none";

// Sends the enquiry over WhatsApp: submitting opens a chat with the site's WhatsApp number (Site settings in the Tina
// dashboard) with the visitor's details already written in. There is no server or API involved.
export default function ContactForm({ delay, labels }) {
  const [pending, setPending] = useState(false);
  const [toast, setToast] = useState(null);
  const step = (index) => delay + .55 + index * .12;

  const send = (event) => {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name) => String(data.get(name) ?? "").trim();
    const message = [
      `${labels.name}: ${value("name")}`,
      `${labels.phone}: ${value("phone")}`,
      `${labels.email}: ${value("email")}`,
      "",
      value("details"),
    ].join("\n");
    const href = whatsappHref(labels.whatsapp, message);
    if (!href) {
      setToast({ tone: "error", message: labels.error });
      return;
    }
    setPending(true);
    window.open(href, "_blank", "noopener,noreferrer");
    setPending(false);
    form.reset();
    setToast({ tone: "success", message: labels.success });
  };

  return (
    <form onSubmit={send} className="px-8 pb-8 pt-14 sm:p-8">
      {labels.title && <Reveal as="h3" delay={step(0)} duration={.5} className="text-center text-[19px] leading-[1.4] sm:text-[22px] font-bold text-[#6c3d8e] lg:text-[26px]">{labels.title}</Reveal>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Reveal delay={step(1)} duration={.5}>
          <label className="block text-[13px] font-medium text-[#3d3442]">{labels.name}
            <input name="name" required minLength={2} maxLength={120} autoComplete="name" className={`${fieldClass} h-12`} />
          </label>
        </Reveal>
        <Reveal delay={step(2)} duration={.5}>
          <label className="block text-[13px] font-medium text-[#3d3442]">{labels.phone}
            <input name="phone" type="tel" required inputMode="tel" autoComplete="tel" dir="ltr" pattern="[+0-9 ]{9,16}" title={labels.phoneHint} className={`${fieldClass} h-12 rtl:text-right`} />
          </label>
        </Reveal>
      </div>
      <Reveal delay={step(3)} duration={.5} className="mt-4">
        <label className="block text-[13px] font-medium text-[#3d3442]">{labels.email}
          <input name="email" type="email" required maxLength={200} autoComplete="email" dir="ltr" className={`${fieldClass} h-12 rtl:text-right`} />
        </label>
      </Reveal>
      <Reveal delay={step(4)} duration={.5} className="mt-4">
        <label className="block text-[13px] font-medium text-[#3d3442]">{labels.details}
          <textarea name="details" required minLength={10} maxLength={5000} title={labels.detailsHint} rows={5} className={`${fieldClass} resize-none py-3 leading-[1.7]`} />
        </label>
      </Reveal>
      {labels.submit && (
        <Reveal delay={step(5)} duration={.5} className="mt-5">
          <GradientSubmitButton label={labels.submit} pending={pending} pendingLabel={labels.sending} />
        </Reveal>
      )}
      <Toast message={toast?.message} tone={toast?.tone} closeLabel={labels.close} onClose={() => setToast(null)} />
    </form>
  );
}
