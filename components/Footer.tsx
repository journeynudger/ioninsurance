import Link from "next/link";
import { site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="dark-band bg-navy-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl">{site.legalName}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
            Reinsurance, insurance, and insurance-based risk mitigation.
          </p>
        </div>
        <div>
          <h2 className="eyebrow text-white/75">Pages</h2>
          <ul className="mt-3 space-y-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow text-white/75">Contact</h2>
          <p className="mt-3">
            <a href={`mailto:${site.email}`} className="break-all hover:underline">{site.email}</a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-6 text-sm text-white/75 sm:px-6">
          <span>© {new Date().getFullYear()} {site.legalName}</span>
          <Link href="/terms-and-conditions" className="hover:underline">Terms &amp; Conditions</Link>
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
