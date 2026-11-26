"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { unstable_catchError as catchError } from "next/error";
import SectionErrorSource from "./SectionErrorSource";

function SectionError({ error, retry }) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section role="alert" className="bg-white px-4 py-10 text-center">
      <p className="text-[15px] leading-[1.8] text-[#5d5861]">{t("error")}</p>
      <button type="button" onClick={retry} className="mt-3 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[11px] border border-[#6c3d8e] px-6 text-[14px] font-bold text-[#6c3d8e] transition-colors hover:bg-[#6c3d8e] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#884fb4]">{t("retry")}</button>
      {process.env.NODE_ENV === "development" && <SectionErrorSource error={error} />}
    </section>
  );
}

// Keeps a section that fails in the browser from taking the rest of the page down with it.
export default catchError((props, { error, unstable_retry }) => <SectionError error={error} retry={() => unstable_retry()} />);
