import siteData from "@/content/site.json";
import homeData from "@/content/home.json";
import productsData from "@/content/products.json";
import aboutData from "@/content/about.json";
import financialsData from "@/content/financials.json";
import legalData from "@/content/legal.json";
import contactData from "@/content/contact.json";

export interface Img { src: string; width: number; height: number; alt: string }

export interface Site {
  name: string;
  legalName: string;
  description: string;
  email: string;
  nav: { label: string; href: string }[];
}

export interface Partner { name: string; logo: string; url?: string; blurb?: string }
export interface Home {
  group: { title: string; text: string };
  tabOrder: string[];
  partners: { title: string; featured: Partner[]; more: Partner[] };
  faq: { title: string; items: { q: string; a: string }[] };
}

export interface Line {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  heading: string;
  intro: string;
  coverage: { name: string; text: string }[];
  closing: string;
  image: Img;
  slide: { title: string; image: Img };
}

export interface About {
  hero: { eyebrow: string; title: string; lede: string };
  values: { kicker: string; title: string; text: string }[];
  valuesClosing: string;
  founder: { name: string; title: string; bio: string; image: Img };
  team: { name: string; title: string; image: string }[];
  groups: { name: string; image: Img }[];
}

export interface Report { title: string; text: string; pdf: string; pages: number; size: string; image: Img }

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  items?: { term: string; text: string }[];
  list?: string[];
}
export interface LegalPage { title: string; lede: string; sections: LegalSection[] }

export interface Contact {
  title: string;
  fields: { first: string; last: string; email: string; message: string };
  placeholders: { first: string; last: string; email: string; message: string };
  submit: string;
  success: string;
  failure: string;
}

// `satisfies` makes a misspelled or missing key fail the type check.
export const site: Site = siteData satisfies Site;
export const home: Home = homeData satisfies Home;
export const lines: Line[] = productsData.lines satisfies Line[];

// The home page's numbered tabs use their own order. An unknown id fails the build.
export function getTabLines(): Line[] {
  return home.tabOrder.map((id) => {
    const line = lines.find((l) => l.id === id);
    if (!line) throw new Error(`home.json tabOrder names unknown line "${id}"`);
    return line;
  });
}
export const about: About = aboutData satisfies About;
export const financials: { title: string; reports: Report[] } = financialsData satisfies { title: string; reports: Report[] };
export const privacy: LegalPage = legalData.privacy satisfies LegalPage;
export const terms: LegalPage = legalData.terms satisfies LegalPage;
export const contact: Contact = contactData satisfies Contact;
