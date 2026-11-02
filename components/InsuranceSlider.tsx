"use client";

import Image from "next/image";
import type { Line } from "@/lib/content";
import { useCarousel } from "./useCarousel";
import { SliderArrows, SliderDots, SliderPause } from "./SliderControls";
import { useParallax } from "./useParallax";

/** Original six-slide, five-second insurance carousel. The grid reserves every slide's height. */
export default function InsuranceSlider({ lines }: { lines: Line[] }) {
  const { ref, index, select, paused, setPaused, interaction } = useCarousel(lines.length, 5000);
  useParallax(ref);

  return <section ref={ref} {...interaction} className="on-dark ion-slider insurance-slider" aria-label="Lines of insurance" aria-roledescription="carousel">
    {lines.map((line, slide) => <div key={line.id} className="insurance-slider__photo" data-active={slide === index}>
      <Image src={line.slide.image.src} alt="" fill sizes="100vw" className="object-cover" />
    </div>)}
    <div className="insurance-slider__slides">
      {lines.map((line, slide) => <div key={line.id} role="group" aria-roledescription="slide" aria-label={`${slide + 1} of ${lines.length}: ${line.name}`} aria-hidden={slide !== index} inert={slide !== index} className="insurance-slider__slide" data-active={slide === index}>
        <div className="insurance-slider__copy">
          <div className="insurance-slider__list">
            <ol>
              {lines.map((item, i) => <li key={item.id}>
                <button type="button" onClick={() => select(i)} aria-current={i === slide ? "true" : undefined}>{String(i + 1).padStart(2, "0")} {item.name}</button>
              </li>)}
            </ol>
          </div>
          <p>{line.summary}</p>
        </div>
      </div>)}
    </div>
    <SliderArrows previous={() => select(index - 1)} next={() => select(index + 1)} />
    <SliderDots titles={lines.map(line => line.name)} index={index} select={select} />
    <SliderPause paused={paused} toggle={() => setPaused(!paused)} />
  </section>;
}
