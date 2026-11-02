"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import type { Line } from "@/lib/content";
import { useCarousel } from "./useCarousel";
import { SliderArrows, SliderDots, SliderPause } from "./SliderControls";
import { useParallax } from "./useParallax";

/** A full reading interval per product; the summary grid reserves the tallest slide. */
export default function InsuranceSlider({ lines }: { lines: Line[] }) {
  const { ref, index, select, paused, setPaused, interaction } = useCarousel(lines.length, 10000);
  const list = useRef<HTMLOListElement>(null);
  useParallax(ref);

  useLayoutEffect(() => {
    const element = list.current;
    if (!element) return;
    const alignDot = () => {
      const button = element.querySelector<HTMLButtonElement>('[aria-current="true"]');
      if (button) element.style.setProperty("--active-offset", `${button.offsetTop + button.offsetHeight / 2}px`);
    };
    alignDot();
    const observer = new ResizeObserver(alignDot);
    observer.observe(element);
    return () => observer.disconnect();
  }, [index]);

  return <section ref={ref} {...interaction} className="on-dark ion-slider insurance-slider" aria-label="Lines of insurance" aria-roledescription="carousel">
    {lines.map((line, slide) => <div key={line.id} className="insurance-slider__photo" data-active={slide === index}>
      <Image src={line.slide.image.src} alt="" fill sizes="100vw" className="object-cover" />
    </div>)}
    <div className="insurance-slider__copy">
      <div className="insurance-slider__list">
        <ol ref={list}>
          {lines.map((item, i) => <li key={item.id}>
            <button type="button" onClick={() => select(i)} aria-current={i === index ? "true" : undefined}>
              <span>{String(i + 1).padStart(2, "0")}</span><span>{item.name}</span>
            </button>
          </li>)}
        </ol>
      </div>
      <div className="insurance-slider__slides">
        {lines.map((line, slide) => <div key={line.id} role="group" aria-roledescription="slide" aria-label={`${slide + 1} of ${lines.length}: ${line.name}`} aria-hidden={slide !== index} inert={slide !== index} className="insurance-slider__slide" data-active={slide === index}>
          <p>{line.summary}</p>
        </div>)}
      </div>
    </div>
    <SliderArrows previous={() => select(index - 1)} next={() => select(index + 1)} />
    <SliderDots titles={lines.map(line => line.name)} index={index} select={select} />
    <SliderPause paused={paused} toggle={() => setPaused(!paused)} />
  </section>;
}
