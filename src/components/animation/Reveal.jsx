"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const RevealContext = createContext({ visible: true, reduced: false });
const defaultEase = [0.16, 1, 0.3, 1];
const imageWaitLimit = 6000;
const hidden = {
  blur: { opacity: 0, filter: "blur(12px)" },
  blurUp: { opacity: 0, y: 28, filter: "blur(12px)" },
  fade: { opacity: 0 },
  fadeUp: { opacity: 0, y: 18 },
  clipRight: { clipPath: "inset(0 100% 0 0)" },
  clipUp: { clipPath: "inset(100% 0% 0% 0%)" },
  clipDown: { clipPath: "inset(0% 0% 100% 0%)" },
  clipLeft: { clipPath: "inset(0% 0% 0% 100%)" },
};
const shown = {
  blur: { opacity: 1, filter: "blur(0px)" },
  blurUp: { opacity: 1, y: 0, filter: "blur(0px)" },
  fade: { opacity: 1 },
  fadeUp: { opacity: 1, y: 0 },
  clipRight: { clipPath: "inset(0 0% 0 0)" },
  clipUp: { clipPath: "inset(0% 0% 0% 0%)" },
  clipDown: { clipPath: "inset(0% 0% 0% 0%)" },
  clipLeft: { clipPath: "inset(0% 0% 0% 0%)" },
};

export const useReveal = () => useContext(RevealContext);

// `mobileDelay` replaces `delay` below the lg breakpoint, for sequences that only make sense on desktop.
export function useActiveDelay(delay, mobileDelay) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (mobileDelay !== undefined) setIsMobile(window.matchMedia("(max-width: 1023px)").matches);
  }, [mobileDelay]);

  return isMobile && mobileDelay !== undefined ? mobileDelay : delay;
}

// Lets a server-rendered section start its children's entrance when it scrolls into view.
export function RevealSection({ as: Tag = "section", amount = .2, children, ...props }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount });
  const reduced = useReducedMotion();
  return (
    <Tag ref={ref} {...props}>
      <RevealContext.Provider value={{ visible: inView || reduced, reduced }}>{children}</RevealContext.Provider>
    </Tag>
  );
}

// `waitForImage` holds the entrance until the image inside has loaded, so a clip reveal never finishes on an empty box.
export function Reveal({ as = "div", from = "blur", delay = 0, mobileDelay, duration = .6, ease = defaultEase, waitForImage, children, ...props }) {
  const { visible, reduced } = useReveal();
  const Element = motion[as];
  const ref = useRef(null);
  const [imageReady, setImageReady] = useState(!waitForImage);
  const activeDelay = useActiveDelay(delay, mobileDelay);

  useEffect(() => {
    if (!waitForImage || !visible) return;
    const image = ref.current?.querySelector("img");
    if (!image) return setImageReady(true);
    // A closed clip counts as off-screen, so a lazy image would never start loading on its own.
    image.loading = "eager";
    let cancelled = false;
    const ready = () => { if (!cancelled) setImageReady(true); };
    const decode = () => image.decode().then(ready, ready);
    const fallback = setTimeout(ready, imageWaitLimit);
    if (image.complete) decode();
    else {
      image.addEventListener("load", decode, { once: true });
      image.addEventListener("error", ready, { once: true });
    }
    return () => {
      cancelled = true;
      clearTimeout(fallback);
      image.removeEventListener("load", decode);
      image.removeEventListener("error", ready);
    };
  }, [waitForImage, visible]);

  return (
    <Element {...props} ref={ref}
      initial={reduced ? false : hidden[from]}
      animate={visible && (imageReady || reduced) ? shown[from] : undefined}
      transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : activeDelay, ease }}
    >
      {children}
    </Element>
  );
}
