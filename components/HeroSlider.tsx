"use client";

import Image from "next/image";
import type { Img } from "@/lib/content";
import { useCarousel } from "./useCarousel";
import { SliderArrows, SliderDots } from "./SliderControls";
import { useParallax } from "./useParallax";

export interface Slide { title: string; text: string; image: Img }

/** The original hero advances with arrows, dots, or a swipe, not a timer. */
export default function HeroSlider({ slides, label, titleAs = "p" }: { slides: Slide[]; label: string; titleAs?: "p" | "h1" }) {
  const { ref, index, select, interaction } = useCarousel(slides.length);
  useParallax(ref, "hero");
  const many = slides.length > 1;
  const Title = titleAs;

  return (
    <section
      ref={ref}
      {...interaction}
      role={many ? "region" : undefined}
      aria-roledescription={many ? "carousel" : undefined}
      aria-label={label}
      className="on-dark ion-slider hero-slider"
    >
      {slides.map((s, i) => (
        <div
          key={s.title}
          role={many ? "group" : undefined}
          aria-roledescription={many ? "slide" : undefined}
          aria-label={many ? `${i + 1} of ${slides.length}` : undefined}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <Image src={s.image.src} alt={s.image.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
          <div className="hero-slider__caption" style={{ visibility: i === index ? "visible" : "hidden" }}>
            <Title className="hero-slider__title">{s.title}</Title>
            <p className="hero-slider__text">{s.text}</p>
          </div>
        </div>
      ))}
      {many && <>
        <SliderArrows previous={() => select(index - 1)} next={() => select(index + 1)} />
        <SliderDots titles={slides.map(s => s.title)} index={index} select={select} />
      </>}
    </section>
  );
}
