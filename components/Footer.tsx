import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white pb-8 pt-7">
      <div className="px-[8%] md:px-16">
        <p className="text-[25px] font-semibold uppercase leading-[24px] text-heading">
          ION Insurance
          <br />
          <span className="text-[#8a8a8a]">Company Inc.</span>
        </p>
      </div>
      <p className="mt-3 px-[8%] text-center text-[14px] leading-6 text-[#767676]">
        <Link href="/terms-and-conditions" className="text-heading hover:underline">Terms &amp; Conditions</Link> and{" "}
        <Link href="/privacy-policy" className="text-heading hover:underline">Privacy Policy</Link> © Copyrights ION Insurance Company, Inc.{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}
