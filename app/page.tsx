import PartnerGrid from "@/components/PartnerGrid";
import ContactSection from "@/components/ContactSection";
import LineSlider from "@/components/LineSlider";
import InsuranceSlider from "@/components/InsuranceSlider";
import PartnerSlider from "@/components/PartnerSlider";
import Faq from "@/components/Faq";
import GroupIntro from "@/components/GroupIntro";
import { getTabLines, home, site } from "@/lib/content";

export default function HomePage() {
  const { group, partners, faq } = home;
  return (
    <>
      <h1 className="sr-only">{site.legalName}</h1>
      <LineSlider />

      <div className="group-scene">
        <GroupIntro {...group} />
        <InsuranceSlider lines={getTabLines()} />
      </div>

      <section aria-labelledby="partners-title" className="wrap pb-16 pt-20 min-[981px]:pt-32">
        <h2 id="partners-title" className="pb-[10px] text-center text-[40px] leading-[1.1] text-heading min-[981px]:text-[45px]">{partners.title}</h2>
        <hr className="mt-8 border-t border-rule" />
        <PartnerGrid partners={[...partners.featured, ...partners.more]} />
        <PartnerSlider partners={[...partners.more, partners.featured[0], partners.featured[2], partners.featured[1], ...partners.featured.slice(3)]} />
      </section>

      <Faq {...faq} />

      <ContactSection />
    </>
  );
}
