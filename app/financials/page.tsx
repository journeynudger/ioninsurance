import type { Metadata } from "next";
import Image from "next/image";
import ContactSection from "@/components/ContactSection";
import PageHeader from "@/components/PageHeader";
import { financials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Financials",
  description: "ION Insurance Company annual and management reports.",
};

export default function FinancialsPage() {
  return (
    <>
      <PageHeader eyebrow="Financials" title={financials.title} lede="Annual and management reports of ION Insurance Company, Inc." />
      <section aria-labelledby="reports-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 id="reports-title" className="sr-only">Reports</h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {financials.reports.map((r) => (
            <li key={r.title} className="flex flex-col overflow-hidden rounded-2xl border border-rule bg-white sm:flex-row md:flex-col lg:flex-row">
              <div className="relative aspect-[3/2] sm:aspect-auto sm:w-48 sm:shrink-0 md:aspect-[3/2] md:w-auto lg:aspect-auto lg:w-48">
                <Image src={r.image.src} alt={r.image.alt} fill sizes="(min-width: 1024px) 12rem, (min-width: 768px) 50vw, (min-width: 640px) 12rem, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="eyebrow text-ink-soft">ION Insurance Inc.</p>
                <h3 className="mt-2 font-serif text-2xl text-navy-ink">{r.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{r.text}</p>
                <a href={r.pdf} className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-navy px-5 py-2.5 font-medium text-white transition-colors hover:bg-navy-deep">
                  Full report <span className="text-sm font-normal text-white/80">PDF · {r.pages} pages · {r.size}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <ContactSection />
    </>
  );
}
