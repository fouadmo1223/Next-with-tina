"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const CvsBrowser = dynamic(() => import("@/components/common/CvsBrowser"), {
  ssr: false,
  loading: () => <Placeholder kind="cvs" />,
});
const ProfessionTabs = dynamic(() => import("./ProfessionTabs"), {
  ssr: false,
  loading: () => <Placeholder kind="professions" />,
});

function Placeholder({ kind }) {
  return <div aria-hidden="true" className={kind === "cvs" ? "mt-10 h-[750px] rounded-[20px] bg-white/30 lg:h-[650px]" : "mt-10 h-[1000px] rounded-[20px] bg-[#f1f8f7] lg:h-[650px]"} />;
}

// Start loading before the widget enters view; keep it mounted once loaded.
function NearViewport({ kind, children }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "800px 0px" });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{ready ? children : <Placeholder kind={kind} />}</div>;
}

export function LazyCvsBrowser(props) {
  return <NearViewport kind="cvs"><CvsBrowser {...props} /></NearViewport>;
}

export function LazyProfessionTabs(props) {
  return <NearViewport kind="professions"><ProfessionTabs {...props} /></NearViewport>;
}
