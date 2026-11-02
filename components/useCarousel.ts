"use client";

import { useEffect, useRef, useState, type FocusEvent, type PointerEvent, type KeyboardEvent } from "react";

export function useCarousel(count: number, interval = 0) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  const select = (next: number) => setIndex((next + count) % count);

  useEffect(() => {
    const element = ref.current;
    if (!element || !interval || count < 2 || hovered || focused || paused) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.2 });
    observer.observe(element);
    const timer = window.setInterval(() => {
      if (visible && !document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setIndex((current) => (current + 1) % count);
      }
    }, interval);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, [count, interval, hovered, focused, paused, index]);

  return {
    ref, index, select, paused, setPaused,
    interaction: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus: () => setFocused(true),
      onBlur: (event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        select(index + (event.key === "ArrowRight" ? 1 : -1));
      },
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType === "touch") pointer.current = { x: event.clientX, y: event.clientY };
      },
      onPointerCancel: () => { pointer.current = null; },
      onPointerUp: (event: PointerEvent<HTMLElement>) => {
        const start = pointer.current;
        pointer.current = null;
        if (!start) return;
        const dx = event.clientX - start.x;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(event.clientY - start.y) * 1.5) select(index + (dx < 0 ? 1 : -1));
      },
    },
  };
}
