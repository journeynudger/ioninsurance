import ContactSection from "@/components/ContactSection";
import PageHeader from "@/components/PageHeader";
import type { LegalPage as Legal } from "@/lib/content";

export default function LegalPage({ page }: { page: Legal }) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={page.title} lede={page.lede} />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        {page.sections.map((s) => (
          <section key={s.title} className="mt-10 first:mt-0">
            <h2 className="font-serif text-2xl text-navy-ink">{s.title}</h2>
            {s.paragraphs?.map((p) => <p key={p} className="mt-3 leading-relaxed text-ink-soft">{p}</p>)}
            {s.items && (
              <dl className="mt-3 space-y-3">
                {s.items.map((it) => (
                  <div key={it.term}>
                    <dt className="font-semibold text-ink">{it.term}</dt>
                    <dd className="leading-relaxed text-ink-soft">{it.text}</dd>
                  </div>
                ))}
              </dl>
            )}
            {s.list && (
              <ul className="mt-3 list-disc space-y-1.5 pl-6 leading-relaxed text-ink-soft marker:text-navy">
                {s.list.map((li) => <li key={li}>{li}</li>)}
              </ul>
            )}
          </section>
        ))}
      </article>
      <ContactSection />
    </>
  );
}
