"use client";

import { useEffect, useRef } from "react";
import { useParallax } from "./useParallax";

export default function GroupIntro({ title, text }: { title: string; text: string }) {
  const ref = useRef<HTMLElement>(null);
  useParallax(ref, "group");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.querySelectorAll(".group-intro__reveal").forEach((child, index) => {
        animations.push(child.animate([
          { opacity: 0, transform: "translateY(24px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 900, delay: index * 110, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" }));
      });
      observer.disconnect();
    }, { threshold: 0.15 });
    const stop = () => { if (motion.matches) { observer.disconnect(); animations.forEach(animation => animation.cancel()); } };
    observer.observe(element);
    motion.addEventListener("change", stop);
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); motion.removeEventListener("change", stop); };
  }, []);

  return <section ref={ref} aria-labelledby="group-title" className="wrap group-intro grid gap-6 py-16 min-[981px]:grid-cols-3 min-[981px]:gap-0 min-[981px]:py-[192px]">
    <div className="group-intro__title"><h2 id="group-title" className="group-intro__reveal text-[40px] leading-none text-heading min-[981px]:text-[45px]">{title}</h2></div>
    <div className="group-intro__text min-[981px]:col-span-2"><p className="group-intro__reveal text-[20px] leading-[30px]">{text}</p></div>
  </section>;
}
