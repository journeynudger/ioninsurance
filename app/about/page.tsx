import type { Metadata } from "next";
import Image from "next/image";
import ContactSection from "@/components/ContactSection";
import HeroSlider from "@/components/HeroSlider";
import { about } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "ION Insurance Company's mission, approach and team.",
};

export default function AboutPage() {
  const { hero, values, valuesClosing, founder, team, groups } = about;
  return (
    <>
      <HeroSlider
        label="About ION Insurance"
        titleAs="h1"
        slides={[{ title: hero.title, text: hero.lede, image: { src: "/images/slides/surety.jpg", width: 1920, height: 1080, alt: "An empty boardroom with floor-to-ceiling windows over a city" } }]}
      />

      <section aria-labelledby="about-title" className="wrap py-16 md:pb-24 md:pt-[192px]">
        <div className="space-y-14 md:space-y-24">
          {values.map((v, i) => (
            <div key={v.kicker} className="grid gap-5 md:grid-cols-3 md:gap-0">
              <div>
                {i === 0 && <h2 id="about-title" className="pb-[10px] text-[45px] leading-none text-heading md:text-[70px]">About</h2>}
                <h3 className="pb-[10px] text-[24px] leading-[1] text-ink">{v.kicker}</h3>
                <p className="text-[21px] leading-[1] text-muted">{v.title}</p>
              </div>
              <div className="space-y-5 text-[18px] leading-[1.6] md:col-span-2 md:pl-0 md:text-[20px] md:leading-[30px]">
                <p>{v.text}</p>
                {i === values.length - 1 && <p>{valuesClosing}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="team-title" className="wrap pb-16 md:pb-24">
        <h2 id="team-title" className="pb-[10px] text-[45px] leading-none text-ink md:text-[70px]">Meet Our Team</h2>
        <article className="mt-10 grid items-center gap-8 md:grid-cols-[376px_1fr] md:gap-14">
          <Image src={founder.image.src} alt={founder.image.alt} width={founder.image.width} height={founder.image.height} sizes="(min-width: 768px) 376px, 80vw" className="aspect-[2/3] w-full object-cover" />
          <div>
            <h3 className="pb-[10px] text-[30px] leading-[30px] text-ink">{founder.name}</h3>
            <p className="pb-[10px] text-[22px] leading-[22px] text-muted">{founder.title}</p>
            <p className="text-[16px] leading-[1.5] md:text-[18px] md:leading-[23.8px]">{founder.bio}</p>
          </div>
        </article>

        <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-[56px] md:gap-y-14">
          {team.map((m) => (
            <li key={m.name}>
              <Image src={m.image} alt={m.name} width={533} height={800} sizes="(min-width: 768px) 214px, 40vw" className="aspect-[2/3] w-full object-cover" />
              <h3 className="mt-4 text-[18px] leading-tight text-ink">{m.name}</h3>
              <p className="mt-1 text-[15px] leading-tight text-muted">{m.title}</p>
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-12 md:grid-cols-2 md:gap-[56px]">
          {groups.map((g) => (
            <figure key={g.name}>
              <figcaption className="mb-5 text-center text-[20px] leading-tight text-ink">{g.name}</figcaption>
              <Image src={g.image.src} alt={g.image.alt} width={g.image.width} height={g.image.height} sizes="(min-width: 768px) 484px, 80vw" className="aspect-[3/2] w-full object-cover" />
            </figure>
          ))}
        </div>
      </section>
      <ContactSection />
    </>
  );
}
