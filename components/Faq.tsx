"use client";

import { useState } from "react";

export default function Faq({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return <section aria-labelledby="faq-title" className="wrap faq-section">
    <h2 id="faq-title">{title}</h2>
    <div className="faq-list">
      {items.map((item, index) => {
        const open = expanded === index;
        return <div className="faq-item" key={item.q} data-open={open}>
          <h3>
            <button className="faq-question" id={`faq-question-${index}`} aria-expanded={open} aria-controls={`faq-answer-${index}`} onClick={() => setExpanded(open ? null : index)}>
              <span>{item.q}</span>
              <svg className="faq-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14" /><path className="faq-icon__vertical" d="M12 5v14" />
              </svg>
            </button>
          </h3>
          <div className="faq-answer" id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} aria-hidden={!open} inert={!open}>
            <div className="faq-answer__clip"><p>{item.a}</p></div>
          </div>
        </div>;
      })}
    </div>
  </section>;
}
