import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...site.nav.map((n) => n.href), "/privacy-policy", "/terms-and-conditions"];
  return paths.map((p) => ({ url: `https://ioninsuranceinc.com${p === "/" ? "" : p}` }));
}
