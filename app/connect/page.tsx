import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { contact, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Connect",
  description: "Contact ION Insurance Company to request a quote or ask a question.",
};

export default function ConnectPage() {
  return (
    <section className="bg-mist">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="eyebrow text-navy">Connect</p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.08] text-navy-ink sm:text-5xl">Contact</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{contact.lede}</p>
          <h2 className="eyebrow mt-10 text-ink">Email</h2>
          <p className="mt-2">
            <a href={`mailto:${site.email}`} className="text-lg font-medium text-navy underline underline-offset-4 hover:text-navy-deep">{site.email}</a>
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
