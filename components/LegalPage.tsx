import Link from "next/link";
import ContactSection from "@/components/ContactSection";
import type { LegalPage as Legal } from "@/lib/content";

// Live URLs in the text become links.
function linkify(text: string) {
  return text.split(/(https:\/\/ioninsuranceinc\.com)/).map((part, i) =>
    part.startsWith("https://") ? (
      <Link key={i} href="/" className="text-link underline-offset-2 hover:underline">{part}</Link>
    ) : (
      part
    ),
  );
}

export default function LegalPage({ page }: { page: Legal }) {
  return (
    <>
      <article className="wrap pt-14 text-[16px] leading-[23.8px] md:pt-[78px]">
        <h1 className="pb-[10px] text-[40px] font-bold leading-none text-ink md:text-[50px]">{page.title}</h1>
        <p className="mt-10 font-bold">{page.lede}</p>
        {page.sections.map((s) => (
          <section key={s.title} className="mt-4">
            <h2 className="inline font-bold">{s.title}</h2>{" "}
            {s.paragraphs?.map((p, i) => (
              <p key={p} className={i === 0 ? "inline" : "mt-4"}>{linkify(p)}</p>
            ))}
            {s.items && (
              <ul className="mt-3 list-disc space-y-0 pl-4 leading-[26px]">
                {s.items.map((it) => (
                  <li key={it.term}>
                    <strong>{it.term}:</strong> {it.text}
                  </li>
                ))}
              </ul>
            )}
            {s.list && (
              <ul className="mt-3 list-disc pl-4 leading-[26px]">
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
