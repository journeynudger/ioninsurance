import type { Metadata } from "next";
import Image from "next/image";
import ContactSection from "@/components/ContactSection";
import PageHeader from "@/components/PageHeader";
import { about } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "ION Insurance Company's mission, approach and team.",
};

export default function AboutPage() {
  const { hero, values, valuesClosing, founder, team, groups } = about;
  return (
    <>
      <PageHeader
        eyebrow={hero.eyebrow}
        title={hero.title}
        lede={hero.lede}
        image={{ src: "/images/hero-boardroom.jpg", width: 1920, height: 1080, alt: "An empty boardroom with floor-to-ceiling windows over a city" }}
      />

      <section aria-labelledby="values-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 id="values-title" className="sr-only">What we stand for</h2>
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {values.map((v) => (
            <div key={v.kicker} className="border-t-2 border-navy pt-6">
              <p className="eyebrow text-navy">{v.kicker}</p>
              <h3 className="mt-2 font-serif text-2xl text-navy-ink">{v.title}</h3>
              <p className="mt-4 leading-relaxed text-ink-soft">{v.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-14 max-w-3xl font-serif text-xl leading-relaxed text-navy-ink sm:text-2xl">{valuesClosing}</p>
      </section>

      <section aria-labelledby="team-title" className="border-t border-rule bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 id="team-title" className="font-serif text-3xl text-navy-ink sm:text-4xl">Meet Our Team</h2>

          <article className="mt-12 grid items-center gap-8 overflow-hidden rounded-2xl border border-rule bg-white md:grid-cols-[minmax(0,18rem)_1fr]">
            <div className="relative aspect-[4/5] md:h-full md:aspect-auto md:min-h-[22rem]">
              <Image src={founder.image.src} alt={founder.image.alt} fill sizes="(min-width: 768px) 18rem, 100vw" className="object-cover object-top" />
            </div>
            <div className="p-6 sm:p-10 md:pl-2">
              <h3 className="font-serif text-3xl text-navy-ink">{founder.name}</h3>
              <p className="eyebrow mt-2 text-navy">{founder.title}</p>
              <p className="mt-5 leading-relaxed text-ink-soft">{founder.bio}</p>
            </div>
          </article>

          <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {team.map((m) => (
              <li key={m.name} className="overflow-hidden rounded-2xl border border-rule bg-white">
                <div className="relative aspect-[4/5]">
                  <Image src={m.image} alt={m.name} fill sizes="(min-width: 768px) 16rem, 50vw" className="object-cover object-top" />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-semibold leading-snug text-navy-ink">{m.name}</h3>
                  <p className="mt-1 text-sm leading-snug text-ink-soft">{m.title}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {groups.map((g) => (
              <figure key={g.name} className="overflow-hidden rounded-2xl border border-rule bg-white">
                <Image src={g.image.src} alt={g.image.alt} width={g.image.width} height={g.image.height} sizes="(min-width: 768px) 34rem, 100vw" className="aspect-[3/2] w-full object-cover" />
                <figcaption className="p-5 font-semibold text-navy-ink">{g.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
