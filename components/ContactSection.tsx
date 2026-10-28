import ContactForm from "@/components/ContactForm";
import { contact, site } from "@/lib/content";

export default function ContactSection() {
  return (
    <section aria-labelledby="connect-title" className="border-t border-rule bg-mist">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 id="connect-title" className="font-serif text-3xl text-navy-ink sm:text-4xl">{contact.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{contact.lede}</p>
          <p className="mt-6 text-ink-soft">
            Prefer email?{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-navy underline underline-offset-4 hover:text-navy-deep">{site.email}</a>
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
