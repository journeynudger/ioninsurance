"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { site } from "@/lib/content";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="relative z-40 md:sticky md:top-0 border-b border-rule bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 px-4 sm:px-6 md:h-20 md:flex-nowrap">
        <div className="flex h-16 items-center md:h-auto md:mr-auto">
          <Logo />
        </div>
        <nav aria-label="Main" className="-mx-1 flex w-full items-center justify-between pb-2.5 text-[15px] md:w-auto md:justify-end md:gap-8 md:pb-0">
          {site.nav.map((item) => {
            const current = pathname === item.href;
            const cta = item.href === "/connect";
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={
                  cta
                    ? `rounded-full px-4 py-2 font-medium transition-colors ${current ? "bg-navy-deep text-white" : "bg-navy text-white hover:bg-navy-deep"}`
                    : `px-1 py-2 decoration-2 underline-offset-8 transition-colors hover:text-navy ${current ? "font-medium text-navy underline" : "text-ink-soft"}`
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
