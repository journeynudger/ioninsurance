"use client";

import { useEffect, type RefObject } from "react";

/** Frame-rate-independent easing, active only while a visible section is moving. */
export function useParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 980px)");
    let frame = 0;
    let current = 0;
    let target = 0;
    let previousTime = 0;
    let initialized = false;
    const paint = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      current += (target - current) * (1 - Math.exp(-elapsed / 85));
      if (Math.abs(target - current) < 0.05) current = target;
      element.style.setProperty("--image-shift", `${current.toFixed(2)}px`);
      frame = current === target ? 0 : requestAnimationFrame(paint);
    };
    const update = () => {
      if (motion.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        initialized = false;
        element.style.removeProperty("--image-shift");
        return;
      }
      const bounds = element.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
      target = (progress - 0.5) * bounds.height * 0.24;
      if (!initialized) { current = target; initialized = true; }
      if (!frame) { previousTime = 0; frame = requestAnimationFrame(paint); }
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    motion.addEventListener("change", update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      motion.removeEventListener("change", update);
      element.style.removeProperty("--image-shift");
    };
  }, [ref]);
}
