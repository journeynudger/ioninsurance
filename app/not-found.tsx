import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap py-24 text-center md:py-32">
      <h1 className="text-[45px] leading-none text-heading md:text-[70px]">Page not found</h1>
      <p className="mt-6 text-[18px] md:text-[20px]">That page doesn’t exist, or it has moved.</p>
      <Link href="/" className="mt-10 inline-block rounded-[25px] bg-button px-[60px] py-3 text-[17px] font-bold tracking-[0.5px] text-heading hover:bg-[#cfcfcf]">
        Go to the home page
      </Link>
    </section>
  );
}
