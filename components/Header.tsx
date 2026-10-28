"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/content";

// Pages that open with a full-bleed photo: the bar floats over it, as on the live site.
const OVERLAY = ["/", "/products", "/about"];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const overlay = OVERLAY.includes(pathname);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`on-dark z-40 w-full bg-bar ${overlay ? "absolute inset-x-0 top-0" : "relative"}`}>
      <div className="flex h-[68px] items-center justify-between px-2 md:h-[101px] md:px-[26px]">
        <Link href="/" aria-label={`${site.legalName}, home`} className="block">
          <Image src="/images/ion-logo-white.png" alt="" width={500} height={200} priority className="h-[60px] w-auto md:h-[81px]" />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-[22px]">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block py-[31px] text-[23px] font-bold leading-[14px] text-white decoration-2 underline-offset-[10px] hover:underline aria-[current=page]:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="grid size-11 place-items-center text-white md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Menu"}</span>
          <svg aria-hidden="true" width="26" height="20" viewBox="0 0 26 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {open ? <path d="M5 2l16 16M21 2L5 18" /> : <path d="M2 3h22M2 10h22M2 17h22" />}
          </svg>
        </button>
      </div>
      <nav id="mobile-nav" aria-label="Main" hidden={!open} className="border-t border-white/15 md:hidden">
        <ul className="px-[8%] py-3">
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)} aria-current={pathname === item.href ? "page" : undefined} className="block py-3 text-xl font-bold text-white aria-[current=page]:underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
