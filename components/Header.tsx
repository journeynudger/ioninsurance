"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/content";

// Pages that open with a full-bleed photo: the bar floats over it, as on the live site.
const OVERLAY = ["/", "/products", "/about"];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const overlay = OVERLAY.includes(pathname);

  useEffect(() => {
    const menu = dialog.current;
    const desktop = window.matchMedia("(min-width: 981px)");
    const closeOnDesktop = () => { if (desktop.matches) menu?.close(); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const closeMenu = () => dialog.current?.close();

  return (
    <header className={`on-dark z-40 w-full bg-bar ${overlay ? "absolute inset-x-0 top-0" : "relative"}`}>
      <div className="flex h-[96px] items-center justify-between px-6 min-[981px]:h-[101px] min-[981px]:px-[26px]">
        <Link href="/" aria-label={`${site.legalName}, home`} className="header-brand block">
          <Image src="/images/ion-logo-white.png" alt="" width={500} height={200} priority className="h-[60px] w-auto min-[981px]:h-[81px]" />
        </Link>
        <nav aria-label="Main" className="site-navigation hidden min-[981px]:block">
          <ul className="flex gap-[22px]">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block py-[31px] text-[23px] font-normal leading-[14px] text-white decoration-1 underline-offset-[10px] hover:underline aria-[current=page]:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => { dialog.current?.showModal(); setOpen(true); }}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-haspopup="dialog"
          className="grid size-11 items-center justify-items-end text-white min-[981px]:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Menu"}</span>
          <svg aria-hidden="true" width="24" height="20" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0 3h24M0 10h24M0 17h24" />
          </svg>
        </button>
      </div>
      <dialog ref={dialog} id="mobile-nav" className="mobile-menu" aria-label="Main menu" tabIndex={-1} autoFocus onClose={() => setOpen(false)}>
        <div className="mobile-menu__bar">
          <Link href="/" onClick={closeMenu} aria-label={`${site.legalName}, home`} className="header-brand">
            <Image src="/images/ion-logo-white.png" alt="" width={500} height={200} className="h-[60px] w-auto brightness-0" />
          </Link>
          <button type="button" onClick={closeMenu} className="mobile-menu__close">
            Close
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <nav aria-label="Main" className="site-navigation">
          <ul>
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={closeMenu} aria-current={pathname === item.href ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </header>
  );
}
