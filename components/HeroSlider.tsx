"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Img } from "@/lib/content";

export interface Slide { title: string; text: string; image: Img }

const INTERVAL = 7000;

/** The live site's full-bleed photo slider: caption on a dark band, dots below. */
export default function HeroSlider({ slides, label, titleAs = "p" }: { slides: Slide[]; label: string; titleAs?: "p" | "h1" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const many = slides.length > 1;
  const Title = titleAs;

  useEffect(() => {
    if (!many || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => window.clearTimeout(t);
  }, [index, paused, many, slides.length]);

  return (
    <section
      aria-roledescription={many ? "carousel" : undefined}
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="on-dark relative h-[80svh] min-h-[480px] overflow-hidden bg-[#1b1b1b] md:h-svh md:max-h-[1100px] md:min-h-[600px]"
    >
      {slides.map((s, i) => (
        <div
          key={s.title}
          aria-roledescription={many ? "slide" : undefined}
          aria-label={many ? `${i + 1} of ${slides.length}` : undefined}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <Image src={s.image.src} alt={s.image.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[3px] bg-bar px-[30px] pb-[46px] pt-[30px] text-white md:pb-[48px]">
            <Title className="text-[40px] font-medium leading-none md:text-[50px]">{s.title}</Title>
            <p className="mt-[10px] max-w-[1220px] text-[14px] leading-[1.7] sm:text-[18px] sm:leading-[23.8px]">{s.text}</p>
          </div>
        </div>
      ))}
      {many && (
        <div className="absolute inset-x-0 bottom-[22px] flex justify-center gap-[10px]">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}: ${s.title}`}
              aria-current={i === index ? "true" : undefined}
              className="relative size-[7px] rounded-full bg-white/50 before:absolute before:-inset-[9px] before:content-[''] aria-[current=true]:bg-white"
            />
          ))}
        </div>
      )}
    </section>
  );
}
