"use client";

import Image from "next/image";
import type { Partner } from "@/lib/content";
import { useCarousel } from "./useCarousel";
import { PartnerArrows } from "./SliderControls";

export default function PartnerGrid({ partners }: { partners: Partner[] }) {
  const pages = Array.from({ length: Math.ceil(partners.length / 6) }, (_, i) => partners.slice(i * 6, i * 6 + 6));
  const { ref, index, select, interaction } = useCarousel(pages.length);

  return <section ref={ref} className="partner-carousel" aria-label="Our partners" aria-roledescription="carousel" {...interaction}>
    <div className="partner-carousel__viewport">
      <div className="partner-carousel__track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {pages.map((page, pageIndex) => <div key={page[0].name} className="partner-grid" role="group" aria-roledescription="slide" aria-label={`${pageIndex + 1} of ${pages.length}`} aria-hidden={index !== pageIndex} inert={index !== pageIndex}>
          {page.map(partner => <article key={partner.name} className="partner-card">
            <h3>{partner.name}</h3>
            <p>{partner.blurb}</p>
            <div className="partner-card__logo">
              <Image src={partner.logo} alt={`${partner.name} logo`} width={partner.logoWidth} height={partner.logoHeight} sizes={`${partner.displayWidth}px`} style={{ width: partner.displayWidth, height: "auto" }} />
            </div>
            <a href={partner.url} target="_blank" rel="noopener noreferrer">
              Read More<span className="sr-only"> about {partner.name} (opens in a new tab)</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </a>
          </article>)}
        </div>)}
      </div>
    </div>
    <PartnerArrows previous={() => select(index - 1)} next={() => select(index + 1)} />
  </section>;
}
