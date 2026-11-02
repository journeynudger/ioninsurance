"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Partner } from "@/lib/content";
import { useCarousel } from "./useCarousel";
import { SliderPause } from "./SliderControls";

export default function PartnerSlider({ partners }: { partners: Partner[] }) {
  const pages = Array.from({ length: Math.ceil(partners.length / 3) }, (_, i) => partners.slice(i * 3, i * 3 + 3));
  const { ref, index, select, paused, setPaused, interaction } = useCarousel(pages.length, 5000);
  const track = useRef<HTMLDivElement>(null);
  const scrolling = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const left = index * (element.clientWidth + 15);
    if (Math.abs(element.scrollLeft - left) > 1) element.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    let width = element.clientWidth;
    const observer = new ResizeObserver(() => {
      if (element.clientWidth === width) return;
      width = element.clientWidth;
      element.scrollTo({ left: index * (width + 15), behavior: "instant" });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [index]);

  useEffect(() => () => { if (scrolling.current) clearTimeout(scrolling.current); }, []);

  return <section ref={ref} className="partner-slider" aria-label="Partner logos" aria-roledescription="carousel" onMouseEnter={interaction.onMouseEnter} onMouseLeave={interaction.onMouseLeave} onFocus={interaction.onFocus} onBlur={interaction.onBlur}>
    <div ref={track} className="partner-slider__track" onScroll={() => {
      if (scrolling.current) clearTimeout(scrolling.current);
      scrolling.current = setTimeout(() => {
        if (track.current) select(Math.round(track.current.scrollLeft / (track.current.clientWidth + 15)));
      }, 150);
    }}>
      {pages.map((page, i) => <div key={page[0].name} className="partner-slider__page" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${pages.length}`}>
        {page.map(partner => <div key={partner.name} className="partner-slider__logo"><Image src={partner.logo} alt={partner.name} fill sizes="(max-width: 980px) 25vw, 330px" className="object-contain" /></div>)}
      </div>)}
    </div>
    <div className="partner-slider__dots">
      {pages.map((page, i) => <button key={page[0].name} type="button" onClick={() => select(i)} aria-label={`Show partners ${i * 3 + 1} to ${Math.min(i * 3 + 3, partners.length)}`} aria-current={index === i ? "true" : undefined}><span /></button>)}
    </div>
    <SliderPause paused={paused} toggle={() => setPaused(!paused)} />
  </section>;
}
