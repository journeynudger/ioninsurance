import Image from "next/image";
import Link from "next/link";
import ContactSection from "@/components/ContactSection";
import { home, lines } from "@/lib/content";

export default function HomePage() {
  const { hero, linesIntro, partners, faq } = home;
  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-ink text-white dark-band">
        <Image src="/images/hero-sky.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-ink via-navy-ink/85 to-navy-ink/30" />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <p className="eyebrow text-sky">{hero.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.08] sm:text-6xl lg:text-7xl">{hero.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">{hero.lede}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/products" className="rounded-full bg-white px-6 py-3 font-medium text-navy-ink transition-colors hover:bg-sky">Explore our products</Link>
            <Link href="/connect" className="rounded-full border border-white/60 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10">Request a quote</Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="lines-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <h2 id="lines-title" className="font-serif text-3xl text-navy-ink sm:text-4xl">{linesIntro.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{linesIntro.lede}</p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lines.map((line, i) => (
            <li key={line.id}>
              <Link href={`/products#${line.id}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-white transition-shadow hover:shadow-lg">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image src={line.image.src} alt={line.image.alt} fill sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow text-ink-soft">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 font-serif text-2xl text-navy-ink">{line.name}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{line.summary}</p>
                  <span className="mt-5 font-medium text-navy group-hover:underline group-hover:underline-offset-4">
                    {line.name} coverage <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="partners-title" className="border-t border-rule bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 id="partners-title" className="font-serif text-3xl text-navy-ink sm:text-4xl">{partners.title}</h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners.featured.map((p) => (
              <li key={p.name} className="flex flex-col rounded-2xl border border-rule bg-white p-6">
                <div className="relative h-16">
                  <Image src={p.logo} alt="" fill sizes="12rem" className="object-contain object-left" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-navy-ink">{p.name}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">{p.blurb}</p>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-5 font-medium text-navy hover:underline hover:underline-offset-4">
                  Visit {p.name}
                  <span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
          <ul aria-label="More partners" className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {partners.more.map((p) => (
              <li key={p.name} className="flex h-24 items-center justify-center rounded-xl border border-rule bg-white px-4">
                <div className="relative h-14 w-full">
                  <Image src={p.logo} alt={p.name} fill sizes="10rem" className="object-contain" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 id="faq-title" className="font-serif text-3xl text-navy-ink sm:text-4xl">{faq.title}</h2>
        <div className="mt-10 divide-y divide-rule border-y border-rule">
          {faq.items.map((item) => (
            <details key={item.q} className="group py-2">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 text-lg font-medium text-navy-ink [&::-webkit-details-marker]:hidden">
                <h3>{item.q}</h3>
                <span aria-hidden="true" className="mt-0.5 text-2xl leading-none text-navy transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-5 pr-10 leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <ContactSection />
    </>
  );
}
