@AGENTS.md

# ION Insurance

The ioninsuranceinc.com WordPress (Divi) site, rebuilt as a small Next.js site. Seven pages (`/`, `/products`,
`/about`, `/financials`, `/connect`, `/privacy-policy`, `/terms-and-conditions`) plus a 404. No database, no CMS:
every word lives in `content/*.json`, typed in `lib/content.ts`. To change text, edit the JSON and push.

Keys that start with `_` (`_source`, `_note`) are records only. Nothing renders them.

## Design

The design copies the live Divi site (2026-10-27): same layout, type and colors, measured from the live pages.
Only spacing, responsiveness and legibility were tuned.

- **Type:** Maison Neue Medium, the site's only font, self-hosted from its own uploads (`app/fonts/`).
  Body 14px/23.8 `#666`; headings `#474747`/`#333`; big titles 45–70px.
- **Header:** `rgba(27,27,27,.7)` bar with the white ION logo and 23px bold links. It floats over the photo on
  Home, Products and About (`OVERLAY` in `components/Header.tsx`) and sits on white elsewhere. Phones get a
  hamburger menu, as on live.
- **Hero slider** (`components/HeroSlider.tsx`): the six line photos with a caption band, 7px dots, 7s autoplay.
  It pauses on hover or focus and stays still with reduced motion. About uses one fixed slide.
- **Home:** Our Group (1/3 + 2/3), numbered line tabs over the photo (`components/LineTabs.tsx`, arrow keys
  work; order from `home.json` `tabOrder`), partner columns with rules and "Read More ›", ruled FAQ, form.
- **Products:** accordion rows (`details name="product"`, so one opens at a time). The open row is a black bar.
  `/products#marine` opens that row.
- **Form:** grey pill fields and a grey Submit pill, as on the Gravity Form; labels are screen-reader only.

Tuned on purpose, against live:
- Greys that failed WCAG AA were darkened: subtitles `#acacac` → `#767676`; footer "Company Inc."
  `#ddd` → `#8a8a8a`; copyright line `#ddd` → `#767676`; in-text links `#2ea3f2` → `#1f6fae`.
- The numbered tabs get a 30% dark wash and a text shadow so white text reads on bright photos.
- On phones, live hides the partner blurbs behind a logo carousel. Here the cards stack, so nothing is lost,
  and the six logo-only partners show as a row at every width.
- Large vertical gaps (192px between About rows, the empty space above Submit) are tightened.
- An "Or email info@ion.co.cr" line sits under each form.

## The contact form

"Connect With Us" appears on every page. The old site used Gravity Forms on WordPress (Plesk); that hosting is
being cancelled, so the form no longer touches WordPress or reCAPTCHA. It posts JSON to `app/api/contact/route.ts`:

- `lib/contact.ts` holds the rules (all four fields required, email format, length limits), shared by browser and
  server so they can't disagree.
- Spam: a hidden honeypot field and a 2-second minimum fill time. Spam gets a fake success and is never sent.
- `lib/deliver.ts` sends each message to whichever destinations are set in Vercel (see `.env.example`), with an
  8-second timeout each:
  - **`FORMS_WEBHOOK_URL`** (recommended: a Formspree form endpoint). Formspree stores every submission in its
    dashboard and emails it to the addresses set there; no DNS changes. The body is JSON (`first`, `last`, `email`,
    `message`, `form`, `submittedAt`) with `Accept: application/json`. Works with Zapier or any receiver too;
    `FORMS_WEBHOOK_SECRET` adds an HMAC-SHA256 signature.
  - `RESEND_API_KEY` + `FORMS_EMAIL_FROM` + `FORMS_EMAIL_TO`: direct email (Reply-To is the visitor). Needs the
    sending domain verified in Resend (DNS records).
- **With no destination set, every message returns 503 and the visitor sees "Your message didn't send … email us
  at info@ion.co.cr".** The form never pretends. `FORMS_DRY_RUN=1` accepts messages without sending; local only.
- Env vars are read at request time: change them in Vercel and redeploy.

## Where the content came from

| File | Source |
|------|--------|
| `content/site.json` | Live header and footer. Email `info@ion.co.cr` from the home-page FAQ. The site lists no phone or address. |
| `content/home.json` | Home page. Hero = the "Our Group" paragraph. Partner blurbs exactly as shown (the live site cuts some off with "..."). 12 partner logos: 6 with blurbs and links, 6 logo-only from the "Our partners" carousel. FAQ verbatim except one fix: "you can our contact form and fill out the online quote" → "you can use our contact form and tell us your specific insurance needs". |
| `content/products.json` | `/products` (six lines: heading, intro, coverage list, closing) and the home page's six tabs (`summary`) and slider captions (`tagline`). Verbatim; dropped stray icon-font "L" characters. |
| `content/about.json` | `/about`: mission and values, founder bio, 8 team members (names and titles exactly as listed), US and American Samoa team photos. |
| `content/financials.json` | `/financials`: four reports, text verbatim. PDFs are the four files the live page links, renamed in `public/reports/`; old PDF URLs 308 to them. |
| `content/legal.json` | `/privacy-policy` and `/terms-and-conditions`, verbatim. |
| `content/contact.json` | Form labels from the Gravity Form. Success text is Gravity Forms' default confirmation. |
| `public/images/*` | WordPress uploads, resized. The full raw pull (80 files: 75 images, 5 PDFs, plus page HTML and extracted text) is in `~/Downloads/Projects/ioninsurance-raw`, outside the repo. |

Not carried over: the six-slide hero slider (its captions are now the line cards), the unlinked
`Ion-Insurance-Gp-draft.pdf` upload, and unused media-library images (old client tiles, placeholders).

## Open questions for ION

1. **Email domain:** the only contact on the site is `info@ion.co.cr` (a Costa Rica domain). Is it the right
   public address, and who should receive website messages? Same address, or another?
2. **Phone and address:** the site shows neither. The annual reports mention Pago Pago, American Samoa and
   San Jose, Costa Rica. Should either appear on the site? Send the exact wording.
3. **Regulatory details:** the reports say ION was incorporated in American Samoa on 2016-02-02, holds a
   Certificate of Authority from the American Samoa Insurance Commissioner, and NAIC company code 15936.
   None of this is on the site today. Add it (e.g. in the footer)?
4. **CBC Insurance:** its card links to protectionre.com and its logo reads "CBC Partnership". Which name and
   link are right?
5. **Partner blurbs:** CBC, Amwins and Ensurance end mid-sentence ("..."). Send full approved text, or shorten.
6. **Products vs FAQ:** the FAQ lists "Corporate" and "Liability" lines; the products page has Financial Lines
   and no Corporate line. Keep the FAQ as written?
7. **Privacy policy:** it mentions a "Revised" date at the top (none is shown) and newsletter sign-ups (the
   site has none). Send the revised date and confirm the newsletter wording.
8. **Team:** is the team list current? The U.S. team photo's file is named "Louisiana". Should the photo be
   labelled "Louisiana"?
9. **Font licence:** the site uses Maison Neue Medium (© Timo Gaessner / 123buero), served from ION's own
   uploads. Confirm ION's licence covers web use on the new host.
10. **Form inbox:** who should receive website messages, and who gets the Formspree (or Resend) login?

## Checks

`npm run typecheck`, `npm run lint`, `npm run build`. A Playwright sweep (in the session scratchpad, not the
repo) checks overflow, clipping, contrast, headings and alt text at 8 widths. `npm run test:ui` (with
`next start -p 3141` running) checks the menu, slider, tabs, FAQ and products accordion (19 checks). The form has an API test suite
and a browser end-to-end suite, run against a local mock of Resend and the webhook: `npm run test:form` (builds first) (86 checks; needs ports 3141-3146 and 4999 free).
