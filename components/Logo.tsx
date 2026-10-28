import Image from "next/image";
import Link from "next/link";

// The column mark from the ION logo, with the wordmark as live text.
export default function Logo() {
  return (
    <Link href="/" className="mr-auto flex items-center gap-2.5 text-navy" aria-label="ION Insurance Company, Inc., home">
      <Image src="/images/ion-column.jpg" alt="" width={225} height={225} className="size-9 sm:size-11" priority />
      <span className="flex items-baseline gap-2 leading-none">
        <span className="font-serif text-[1.65rem] font-medium tracking-[0.06em] sm:text-[1.9rem]">ION</span>
        <span className="font-serif text-[0.7rem] uppercase leading-[1.15] tracking-[0.14em] sm:text-xs">
          Insurance
          <br />
          Company, Inc.
        </span>
      </span>
    </Link>
  );
}
