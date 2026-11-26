import { Fragment } from "react";
import Image from "next/image";

const arrowButton = "flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#e0d1ed] bg-transparent transition-colors hover:border-[#6c3d8e] disabled:cursor-default disabled:opacity-40 disabled:hover:border-[#e0d1ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#884fb4]";

// Previous and next arrows around a row of page dots. `labels` holds previous, next and one goTo label per page.
export default function Pagination({ current, count, labels, onSelect }) {
  // Phones keep the first, last and nearby dots; three small dots stand in for any run left out.
  const isDotShownOnMobile = (index) => index === 0 || index === count - 1 || Math.abs(index - current) <= 1;

  return (
    <div className="mx-auto mt-4 flex max-w-[420px] items-center justify-between gap-4">
      <button type="button" aria-label={labels.previous} disabled={current === 0} onClick={() => onSelect(current - 1)} className={arrowButton}>
        <Image src="/home/profiles-chevron-left.svg" alt="" width={20} height={20} className="size-5 rtl:rotate-180" />
      </button>
      <div className="flex items-center gap-1 md:gap-3">
        {Array.from({ length: count }, (_, index) => {
          const isCurrent = index === current;
          const shownOnMobile = isDotShownOnMobile(index);
          return (
            <Fragment key={index}>
              {shownOnMobile && index > 0 && !isDotShownOnMobile(index - 1) && (
                <span aria-hidden="true" className="flex items-center gap-0.5 md:hidden">
                  <span className="size-1 rounded-full bg-[#b9a9c6]" />
                  <span className="size-1 rounded-full bg-[#b9a9c6]" />
                  <span className="size-1 rounded-full bg-[#b9a9c6]" />
                </span>
              )}
              {isCurrent && <span aria-hidden="true" className="h-3 w-px bg-[#c9bcd3]" />}
              <button type="button" aria-label={labels.goTo[index]} aria-current={isCurrent || undefined} onClick={() => onSelect(index)}
                className={`flex size-7 cursor-pointer items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-[#884fb4] ${isCurrent ? "border-[#6c3d8e]" : "border-transparent"} ${shownOnMobile ? "" : "max-md:hidden"}`}>
                <span className={`size-2.5 rounded-full transition-colors ${isCurrent ? "bg-[#6c3d8e]" : "bg-[#d5cbdc]"}`} />
              </button>
              {isCurrent && <span aria-hidden="true" className="h-3 w-px bg-[#c9bcd3]" />}
            </Fragment>
          );
        })}
      </div>
      <button type="button" aria-label={labels.next} disabled={current === count - 1} onClick={() => onSelect(current + 1)} className={arrowButton}>
        <Image src="/home/profiles-chevron-right.svg" alt="" width={20} height={20} className="size-5 rtl:rotate-180" />
      </button>
    </div>
  );
}
