import Image from "next/image";
import type { Partner } from "@/lib/content";

export default function PartnerGrid({ partners }: { partners: Partner[] }) {
  return <div className="partner-grid">
    {partners.map(partner => <article key={partner.name} className="partner-card">
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
  </div>;
}
