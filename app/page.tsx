import PartnerGrid from "@/components/PartnerGrid";
import ContactSection from "@/components/ContactSection";
import LineSlider from "@/components/LineSlider";
import InsuranceSlider from "@/components/InsuranceSlider";
import PartnerSlider from "@/components/PartnerSlider";
import { getTabLines, home, site } from "@/lib/content";

export default function HomePage() {
  const { group, partners, faq } = home;
  return (
    <>
      <h1 className="sr-only">{site.legalName}</h1>
      <LineSlider />

      <section aria-labelledby="group-title" className="wrap grid gap-6 py-16 min-[981px]:grid-cols-3 min-[981px]:gap-0 min-[981px]:py-[192px]">
        <h2 id="group-title" className="text-[40px] leading-none text-heading min-[981px]:text-[45px]">{group.title}</h2>
        <p className="text-[20px] leading-[30px] min-[981px]:col-span-2">{group.text}</p>
      </section>

      <InsuranceSlider lines={getTabLines()} />

      <section aria-labelledby="partners-title" className="wrap pb-16 pt-20 min-[981px]:pt-32">
        <h2 id="partners-title" className="pb-[10px] text-center text-[40px] leading-[1.1] text-heading min-[981px]:text-[45px]">{partners.title}</h2>
        <hr className="mt-8 border-t-2 border-rule" />
        <PartnerGrid partners={partners.featured} />
        <PartnerSlider partners={[...partners.more, partners.featured[0], partners.featured[2], partners.featured[1], ...partners.featured.slice(3)]} />
      </section>

      <section aria-labelledby="faq-title" className="wrap py-16 min-[981px]:py-24">
        <hr className="border-t-2 border-rule" />
        <h2 id="faq-title" className="mt-4 text-[40px] leading-[1.1] text-heading min-[981px]:text-[45px]">{faq.title}</h2>
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
