import Image from "next/image";
import ContactSection from "@/components/ContactSection";
import LineSlider from "@/components/LineSlider";
import LineTabs from "@/components/LineTabs";
import { getTabLines, home, site } from "@/lib/content";

// Divider lines as on the live grid: vertical rules between columns, a rule above the second row.
function partnerCell(i: number) {
  const c = ["flex flex-col"];
  c.push(i % 2 ? "sm:border-l-2 sm:border-rule sm:pl-6" : "sm:pr-6");
  c.push(i % 3 === 0 ? "lg:border-l-0 lg:pl-0" : "lg:border-l-2 lg:border-rule lg:pl-[31px]");
  c.push(i % 3 === 2 ? "lg:pr-0" : "lg:pr-[31px]");
  c.push(i >= 3 ? "lg:pb-0" : "lg:pb-6");
  return c.join(" ");
}

export default function HomePage() {
  const { group, partners, faq } = home;
  return (
    <>
      <h1 className="sr-only">{site.legalName}</h1>
      <LineSlider />

      <section aria-labelledby="group-title" className="wrap grid gap-6 py-16 md:grid-cols-3 md:gap-0 md:py-[192px]">
        <h2 id="group-title" className="text-[40px] leading-none text-heading md:text-[45px]">{group.title}</h2>
        <p className="text-[20px] leading-[30px] md:col-span-2">{group.text}</p>
      </section>

      <LineTabs lines={getTabLines()} />

      <section aria-labelledby="partners-title" className="wrap pb-16 pt-20 md:pt-32">
        <h2 id="partners-title" className="pb-[10px] text-center text-[40px] leading-[1.1] text-heading md:text-[45px]">{partners.title}</h2>
        <hr className="mt-8 border-t-2 border-rule" />
        <ul className="mt-12 grid gap-y-10 sm:grid-cols-2 lg:mt-[100px] lg:grid-cols-3 lg:gap-y-0">
          {partners.featured.map((p, i) => (
            <li key={p.name} className={partnerCell(i)}>
              {i >= 3 && <hr aria-hidden="true" className="mb-6 hidden border-t-2 border-rule lg:block" />}
              <h3 className="pb-[10px] text-[20px] leading-[20px] text-ink">{p.name}</h3>
              <p className="text-[14px] leading-[23.8px]">{p.blurb}</p>
              <div className="relative mt-3 h-[100px] w-[180px]">
                <Image src={p.logo} alt={`${p.name} logo`} fill sizes="180px" className="object-contain object-left" />
              </div>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-2 self-end text-[16px] text-heading hover:underline">
                Read More<span className="sr-only"> about {p.name} (opens in a new tab)</span>
                <span aria-hidden="true" className="ml-3 inline-block">›</span>
              </a>
            </li>
          ))}
        </ul>
        <ul aria-label="More partners" className="mt-16 grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {partners.more.map((p) => (
            <li key={p.name} className="relative h-16">
              <Image src={p.logo} alt={p.name} fill sizes="160px" className="object-contain" />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq-title" className="wrap py-16 md:py-24">
        <hr className="border-t-2 border-rule" />
        <h2 id="faq-title" className="mt-4 text-[40px] leading-[1.1] text-heading md:text-[45px]">{faq.title}</h2>
        <div className="mt-6 space-y-[22px]">
          {faq.items.map((item, i) => (
            <details key={item.q} open={i === 0} className="group border-y border-line">
              <summary className="flex cursor-pointer items-start justify-between gap-6 p-5 text-[18px] leading-[1.2] text-body group-open:text-ink">
                <h3>{item.q}</h3>
                <span aria-hidden="true" className="text-[22px] leading-none text-[#999] group-open:hidden">+</span>
              </summary>
              <p className="px-5 pb-5 text-[14px] leading-[23.8px] sm:text-[15px]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <ContactSection />
    </>
  );
}
