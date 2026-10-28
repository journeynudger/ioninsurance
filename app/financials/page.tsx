import type { Metadata } from "next";
import Image from "next/image";
import ContactSection from "@/components/ContactSection";
import { financials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Financials",
  description: "ION Insurance Company annual and management reports.",
};

export default function FinancialsPage() {
  return (
    <>
      <section className="mx-auto w-[min(1024px,88%)] pt-14 md:pt-[91px]">
        <h1 className="text-[42px] leading-[1.05] text-heading md:px-16 md:text-[70px] md:leading-[70px]">{financials.title}</h1>
        <ul className="mt-12 space-y-12 md:mt-[118px] md:space-y-[64px]">
          {financials.reports.map((r, i) => (
            <li key={r.title} className="grid items-start gap-8 bg-panel p-6 sm:p-10 md:grid-cols-2 md:gap-[50px] md:p-16">
              <Image
                src={r.image.src}
                alt={r.image.alt}
                width={r.image.width}
                height={r.image.height}
                sizes="(min-width: 768px) 423px, 80vw"
                className={`aspect-square w-full object-cover ${i % 2 ? "md:order-last" : ""}`}
              />
              <div>
                <h2 className="pb-[10px] text-[30px] leading-none text-ink md:text-[35px]">ION Insurance Inc.</h2>
                <p className="pb-[10px] text-[24px] leading-none text-[#7a7a7a] md:text-[30px]">{r.title}</p>
                <p className="mt-4 text-[17px] leading-[1.45] md:text-[20px] md:leading-[24px]">{r.text}</p>
                <a href={r.pdf} className="mt-6 inline-block rounded-[25px] border border-heading bg-panel px-5 py-[6px] text-[20px] leading-[34px] text-heading transition-colors hover:bg-heading hover:text-white">
                  Full Report<span className="sr-only">: {r.title} (PDF, {r.pages} pages, {r.size})</span>
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
