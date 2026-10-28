import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { terms } from "@/lib/content";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return <LegalPage page={terms} />;
}
