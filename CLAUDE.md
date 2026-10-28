@AGENTS.md

# ION Insurance

The ioninsuranceinc.com WordPress (Divi) site, rebuilt as a small Next.js site. Seven pages (`/`, `/products`,
`/about`, `/financials`, `/connect`, `/privacy-policy`, `/terms-and-conditions`) plus a 404. No database, no CMS:
every word lives in `content/*.json`, typed in `lib/content.ts`. To change text, edit the JSON and push.

Keys that start with `_` (`_source`, `_note`) are records only. Nothing renders them.

## Design

Navy `#2d3171` and charcoal `#343434` come from the ION logo files. Source Serif 4 for headings, Inter for
body (next/font). The header uses the column mark from the logo (`public/images/ion-column.jpg`) with "ION /
Insurance Company, Inc." as live text. Every text-on-color pair passes WCAG AA (checked by the sweep).

## The contact form

"Connect With Us" appears on every page, as it did on the old site (where it was Gravity Forms form 1 with
reCAPTCHA). It posts JSON to `app/api/contact/route.ts`:

- `lib/contact.ts` holds the rules (all four fields required, email format, length limits). The browser and
  the server use the same file, so they can't disagree.
- Spam: a hidden honeypot field and a 2-second minimum fill time. Spam gets a fake success and is never sent.
- `lib/deliver.ts` sends each message to whichever destinations are configured (see `.env.example`):
  email through Resend (Reply-To is the visitor) and/or a JSON webhook signed with HMAC-SHA256.
  Each destination times out after 8 seconds.
- **With no destination configured, every message returns 503 and the visitor sees "Your message didn't
  send … email us at info@ion.co.cr".** The form never pretends. Set the env vars before going live.
  `FORMS_DRY_RUN=1` accepts messages without sending them; use it only locally.

Not bridged to the old Gravity Forms on purpose: its reCAPTCHA key only works on ioninsuranceinc.com, and
once DNS moves, WordPress would need its own hostname.

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
9. **reCAPTCHA:** the new form uses a honeypot and a timing check instead. Add Cloudflare Turnstile or
   reCAPTCHA if spam gets through.

## Checks

`npm run typecheck`, `npm run lint`, `npm run build`. A Playwright sweep (in the session scratchpad, not the
repo) checks overflow, clipping, contrast, headings and alt text at 8 widths. The form has an API test suite
and a browser end-to-end suite, run against a local mock of Resend and the webhook: `npm run build && npm run test:form` (86 checks; needs ports 3141-3146 and 4999 free).
