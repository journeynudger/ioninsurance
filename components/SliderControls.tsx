"use client";

export function SliderArrows({ previous, next }: { previous: () => void; next: () => void }) {
  return <>
    <button type="button" className="slider-arrow slider-arrow--previous" aria-label="Previous slide" onClick={previous}>
      <svg viewBox="0 0 48 48" aria-hidden="true"><path d="m29 12-12 12 12 12" /></svg>
    </button>
    <button type="button" className="slider-arrow slider-arrow--next" aria-label="Next slide" onClick={next}>
      <svg viewBox="0 0 48 48" aria-hidden="true"><path d="m19 12 12 12-12 12" /></svg>
    </button>
  </>;
}

export function SliderDots({ titles, index, select }: { titles: string[]; index: number; select: (index: number) => void }) {
  return <div className="slider-dots">
    {titles.map((title, i) => <button key={title} type="button" onClick={() => select(i)} aria-label={`Show slide ${i + 1}: ${title}`} aria-current={i === index ? "true" : undefined}><span /></button>)}
  </div>;
}

export function SliderPause({ paused, toggle }: { paused: boolean; toggle: () => void }) {
  return <button type="button" className="slider-pause" aria-label={paused ? "Start automatic slides" : "Pause automatic slides"} onClick={toggle}>
    <svg viewBox="0 0 24 24" aria-hidden="true">{paused ? <path d="m9 6 9 6-9 6Z" /> : <path d="M8 6h3v12H8zm5 0h3v12h-3z" />}</svg>
  </button>;
}
