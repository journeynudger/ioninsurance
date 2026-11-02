import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Connect",
  description: "Contact ION Insurance Company to request a quote or ask a question.",
};

export default function ConnectPage() {
  return (
    <section className="wrap grid items-start gap-10 py-14 min-[981px]:grid-cols-[1fr_592px] min-[981px]:gap-[50px] min-[981px]:py-[50px]">
      <div className="flex justify-center min-[981px]:pt-4">
        <Image src="/images/ion-logo-stacked.jpg" alt="ION Insurance logo with a column above" width={700} height={767} priority className="w-[200px] min-[981px]:w-[300px]" />
      </div>
      <div>
        <h1 className="mb-8 text-[56px] leading-none text-ink min-[981px]:text-[80px]">Contact</h1>
        <ContactForm id="connect" />
        <p className="mt-4 text-center text-[14px]">
          Or email <a href={`mailto:${site.email}`} className="text-heading underline underline-offset-2">{site.email}</a>
        </p>
      </div>
    </section>
  );
}
