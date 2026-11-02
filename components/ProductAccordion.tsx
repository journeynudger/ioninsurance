"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

type ProductPanel = { id: string; title: string; content: ReactNode };

export default function ProductAccordion({ items }: { items: ProductPanel[] }) {
  const [active, setActive] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openFromHash = () => {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      if (Array.from(root.current?.querySelectorAll(".product-panel") ?? []).some(panel => panel.id === id)) setActive(id);
    };
    const frame = requestAnimationFrame(openFromHash);
    window.addEventListener("hashchange", openFromHash);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("hashchange", openFromHash); };
  }, []);

  useLayoutEffect(() => {
    if (!active) return;
    const panel = document.getElementById(active);
    if (!panel) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = window.scrollY;
    let frame = 0;
    let started: number | undefined;
    // Follow the selected heading while the previous panel collapses above it.
    // Measuring each frame avoids landing at the old, expanded panel's position.
    const align = (time: number) => {
      started ??= time;
      const progress = reduced ? 1 : Math.min(1, (time - started) / 550);
      const target = Math.max(0, window.scrollY + panel.getBoundingClientRect().top - 24);
      const eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo({ top: start + (target - start) * eased, behavior: "instant" });
      if (progress < 1) frame = requestAnimationFrame(align);
    };
    const cancel = () => cancelAnimationFrame(frame);
    frame = requestAnimationFrame(align);
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", cancel);
    return () => {
      cancel();
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
    };
  }, [active]);

  return <div ref={root} className="product-accordion">
    {items.map(item => {
      const open = active === item.id;
      return <section key={item.id} id={item.id} className="product-panel" data-open={open} aria-labelledby={`${item.id}-button`}>
        <h2>
          <button id={`${item.id}-button`} className="product-toggle" aria-expanded={open} aria-controls={`${item.id}-content`} onClick={() => setActive(open ? null : item.id)}>
            <span>{item.title}</span>
            <span className="product-toggle__icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 9 6 6 6-6" /></svg></span>
          </button>
        </h2>
        <div id={`${item.id}-content`} className="product-panel__body" role="region" aria-labelledby={`${item.id}-button`} aria-hidden={!open} inert={!open}>
          <div className="product-panel__clip">{item.content}</div>
        </div>
      </section>;
    })}
  </div>;
}
