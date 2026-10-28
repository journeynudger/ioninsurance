import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactSection from "@/components/ContactSection";
import PageHeader from "@/components/PageHeader";
import { lines } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products",
  description: "Commercial property, financial lines, specialty, marine, aviation and surety insurance from ION Insurance.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader eyebrow="ION Insurance" title="Products" lede="Commercial Property, Financial Lines, Specialty, Marine, Aviation and Surety." />
      <nav aria-label="Products" className="border-b border-rule bg-white">
        <ul className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-4 sm:px-6">
          {lines.map((line) => (
            <li key={line.id}>
              <a href={`#${line.id}`} className="block rounded-full border border-rule px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-navy hover:bg-mist">
                {line.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {lines.map((line, i) => (
        <section key={line.id} id={line.id} aria-labelledby={`${line.id}-title`} className={i % 2 ? "bg-mist" : "bg-white"}>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[5fr_7fr] lg:gap-16">
            <div className={i % 2 ? "lg:order-last" : ""}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:sticky lg:top-28 lg:aspect-square">
                <Image src={line.image.src} alt={line.image.alt} fill sizes="(min-width: 1024px) 26rem, 100vw" className="object-cover" />
              </div>
            </div>
            <div>
              <p className="eyebrow text-navy">{line.name}</p>
              <h2 id={`${line.id}-title`} className="mt-3 font-serif text-3xl leading-tight text-navy-ink sm:text-4xl">{line.heading}</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">{line.intro}</p>
              <h3 className="mt-10 eyebrow text-ink">Insurance coverage</h3>
              <dl className="mt-4 divide-y divide-rule border-y border-rule">
                {line.coverage.map((c) => (
                  <div key={c.name} className="py-4">
                    <dt className="font-semibold text-navy-ink">{c.name}</dt>
                    <dd className="mt-1 leading-relaxed text-ink-soft">{c.text}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 leading-relaxed text-ink">{line.closing}</p>
              <Link href="/connect" className="mt-8 inline-block rounded-full bg-navy px-6 py-3 font-medium text-white transition-colors hover:bg-navy-deep">
                Ask about {line.name}
              </Link>
            </div>
          </div>
        </section>
      ))}
      <ContactSection />
    </>
  );
}
