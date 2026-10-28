"use client";

import Image from "next/image";
import { useState } from "react";
import type { Line } from "@/lib/content";

/** Home page's numbered list: the chosen line grows and its paragraph shows, over its photo. */
export default function LineTabs({ lines }: { lines: Line[] }) {
  const [index, setIndex] = useState(0);
  const active = lines[index];
  return (
    <section aria-label="Lines of insurance" className="on-dark relative isolate overflow-hidden bg-[#1b1b1b] text-white">
      {lines.map((l, i) => (
        <Image
          key={l.id}
          src={l.slide.image.src}
          alt=""
          fill
          sizes="100vw"
          className={`-z-20 object-cover transition-opacity duration-700 motion-reduce:transition-none ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-black/30" />
      <div className="mx-auto flex min-h-[604px] w-[min(935px,80%)] flex-col justify-center py-24 [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
        <div
          className="mx-auto w-full sm:w-fit sm:min-w-[441px] sm:whitespace-nowrap"
          role="tablist"
          aria-label="Lines of insurance"
          onKeyDown={(e) => {
            const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
            if (!step) return;
            e.preventDefault();
            const next = (index + step + lines.length) % lines.length;
            setIndex(next);
            document.getElementById(`line-tab-${lines[next].id}`)?.focus();
          }}
        >
          {lines.map((l, i) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              id={`line-tab-${l.id}`}
              aria-selected={i === index}
              tabIndex={i === index ? 0 : -1}
              aria-controls="line-panel"
              onClick={() => setIndex(i)}
              className={`block w-full text-left transition-[font-size] duration-300 hover:underline motion-reduce:transition-none ${i === index ? "text-[32px] leading-[1.2] sm:text-[40px]" : "text-[20px] leading-[24px]"}`}
            >
              {String(i + 1).padStart(2, "0")} {l.name}
            </button>
          ))}
        </div>
        <p id="line-panel" role="tabpanel" aria-labelledby={`line-tab-${active.id}`} className="mt-6 text-[18px] leading-[1.6] sm:text-[20px] sm:leading-[30px]">
          {active.summary}
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-[22px] flex justify-center gap-[10px]" aria-hidden="true">
        {lines.map((l, i) => (
          <span key={l.id} className={`size-[7px] rounded-full ${i === index ? "bg-white" : "bg-white/50"}`} />
        ))}
      </div>
    </section>
  );
}
