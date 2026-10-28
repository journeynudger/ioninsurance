import HeroSlider from "@/components/HeroSlider";
import { lines } from "@/lib/content";

export default function LineSlider() {
  return <HeroSlider label="Our lines of insurance" slides={lines.map((l) => ({ title: l.slide.title, text: l.tagline, image: l.slide.image }))} />;
}
