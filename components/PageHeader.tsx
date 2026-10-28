import Image from "next/image";
import type { Img } from "@/lib/content";

export default function PageHeader({ eyebrow, title, lede, image }: { eyebrow: string; title: string; lede?: string; image?: Img }) {
  return (
    <section className="border-b border-rule bg-mist">
      <div className={`mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 ${image ? "lg:grid-cols-[1.1fr_1fr]" : ""}`}>
        <div>
          <p className="eyebrow text-navy">{eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.08] text-navy-ink sm:text-5xl lg:text-6xl">{title}</h1>
          {lede && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">{lede}</p>}
        </div>
        {image && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1024px) 34rem, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
