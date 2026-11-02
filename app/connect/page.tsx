import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Connect",
  description: "Contact ION Insurance Company to request a quote or ask a question.",
};

export default function ConnectPage() {
  return (
    <section className="wrap py-14 min-[981px]:py-20">
      <div className="mx-auto max-w-[640px]">
        <h1 className="mb-8 text-[56px] leading-none text-ink min-[981px]:text-[80px]">Contact</h1>
        <ContactForm id="connect" />
        <p className="mt-4 text-center text-[14px]">
          Or email <a href={`mailto:${site.email}`} className="text-heading underline underline-offset-2">{site.email}</a>
        </p>
      </div>
    </section>
  );
}
