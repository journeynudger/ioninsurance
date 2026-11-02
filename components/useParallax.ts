"use client";

import { useEffect, type RefObject } from "react";

/** Move the image separately from the text; keep touch and reduced-motion reading still. */
export function useParallax(ref: RefObject<HTMLElement | null>, hero = false) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 980px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (motion.matches) {
        element.style.removeProperty("--image-shift");
        element.style.removeProperty("--image-position");
        return;
      }
      const bounds = element.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      if (hero) element.style.setProperty("--image-shift", `${Math.max(0, -bounds.top * 0.22)}px`);
      else {
        const progress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height);
        element.style.setProperty("--image-shift", `${(Math.max(0, Math.min(1, progress)) - 0.5) * bounds.height * 0.24}px`);
      }
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    motion.addEventListener("change", requestUpdate);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      motion.removeEventListener("change", requestUpdate);
    };
  }, [ref, hero]);
}
