import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactSection from "@/components/ContactSection";
import LineSlider from "@/components/LineSlider";
import OpenFromHash from "@/components/OpenFromHash";
import { lines } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products",
  description: "Commercial property, financial lines, specialty, marine, aviation and surety insurance from ION Insurance.",
};

export default function ProductsPage() {
  return (
    <>
      <LineSlider />
      <OpenFromHash />
      <section className="wrap pt-16 md:pt-20">
        <h1 className="text-[45px] leading-none text-heading md:pl-[67px] md:text-[70px]">Products</h1>
        <div className="mt-10 border-b-[3px] border-[#444] md:mt-14">
          {lines.map((line) => (
            <details key={line.id} id={line.id} name="product" className="group scroll-mt-4 border-t-[3px] border-[#444]">
              <summary className="flex cursor-pointer items-center gap-4 px-[25px] py-[21px] text-[20px] leading-tight text-black transition-colors hover:bg-[#f2f2f2] group-open:bg-black group-open:text-white group-open:hover:bg-black">
                <h2>{line.name}</h2>
                <span aria-hidden="true" className="text-[22px] font-light leading-none group-open:hidden">+</span>
                <span aria-hidden="true" className="hidden text-[18px] leading-none group-open:inline">×</span>
              </summary>
              <div className="pb-12 pt-6">
                <h3 className="pb-[10px] text-[26px] leading-[1.1] text-ink md:text-[30px] md:leading-[30px]">{line.heading}</h3>
                <p className="text-[18px] leading-[26px] md:text-[20px]">{line.intro}</p>
                <h4 className="mt-6 pb-[10px] text-[24px] leading-none text-[#696666]">Insurance Coverage</h4>
                <ul className="list-disc space-y-0 pl-[18px] text-[16px] leading-[26px] md:text-[18px]">
                  {line.coverage.map((c) => (
                    <li key={c.name}>
                      <strong className="font-bold text-ink">{c.name}:</strong> {c.text}
                    </li>
                  ))}
                </ul>
                <div className="mt-12 grid gap-8 md:grid-cols-2">
                  <div className="relative aspect-square">
                    <Image src={line.image.src} alt={line.image.alt} fill sizes="(min-width: 768px) 497px, 80vw" className="object-cover" />
                  </div>
                  <div>
                    <p className="pb-[10px] text-[26px] leading-[1.1] text-ink md:text-[30px] md:leading-[30px]">{line.name}</p>
                    <p className="pb-[10px] text-[24px] leading-none text-[#696666]">Insurance Coverage</p>
                    <p className="text-[18px] leading-[26px] md:text-[20px]">{line.closing}</p>
                    <Link href="/connect" className="mt-3 inline-block text-[16px] text-ink hover:underline">
                      Connect<span className="sr-only"> about {line.name}</span> <span aria-hidden="true" className="ml-3">›</span>
                    </Link>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
      <ContactSection />
    </>
  );
}
