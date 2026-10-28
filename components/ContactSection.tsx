import ContactForm from "@/components/ContactForm";
import { contact, site } from "@/lib/content";

export default function ContactSection() {
  return (
    <section aria-labelledby="connect-title" className="py-16 md:py-24">
      <div className="mx-auto w-[min(512px,80%)]">
        <h2 id="connect-title" className="mb-8 text-center text-[40px] leading-[1.1] text-heading md:text-[45px]">{contact.title}</h2>
        <ContactForm />
        <p className="mt-4 text-center text-[14px]">
          Or email <a href={`mailto:${site.email}`} className="text-heading underline underline-offset-2">{site.email}</a>
        </p>
      </div>
    </section>
  );
}
