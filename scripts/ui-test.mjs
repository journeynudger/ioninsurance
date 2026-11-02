// Menu, sliders, FAQ and products accordion. Run against `next start -p 3141`.
import { chromium } from "playwright-core";
let pass = 0, fail = 0;
const ok = (c, n) => { if (c) pass++; else fail++; console.log(`${c ? "PASS" : "FAIL"} ${n}`); };
const B = "http://localhost:3141";
const b = await chromium.launch();
// mobile menu
let p = await b.newPage({ viewport: { width: 375, height: 812 } });
await p.goto(B + "/", { waitUntil: "networkidle" });
ok(!(await p.locator("#mobile-nav").isVisible()), "mobile nav hidden at first");
await p.getByRole("button", { name: "Menu" }).click();
ok(await p.locator("#mobile-nav").isVisible(), "hamburger opens nav");
ok((await p.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded")) === "true", "aria-expanded true");
await p.keyboard.press("Escape");
ok(!(await p.locator("#mobile-nav").isVisible()), "Escape closes nav");
await p.getByRole("button", { name: "Menu" }).click();
await p.locator("#mobile-nav").getByRole("link", { name: "Financials" }).click();
await p.waitForURL("**/financials");
ok(!(await p.locator("#mobile-nav").isVisible()), "nav closes after navigating");
await p.close();
// desktop: nav visible, hamburger hidden
p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto(B + "/", { waitUntil: "networkidle" });
ok(await p.getByRole("navigation", { name: "Main" }).first().isVisible() && !(await p.getByRole("button", { name: "Menu" }).isVisible()), "desktop shows links, no hamburger");
// Hero is manual; the lower insurance section gives each product ten seconds.
const hero = p.getByRole("region", { name: "Our lines of insurance", exact: true });
const insurance = p.getByRole("region", { name: "Lines of insurance", exact: true });
await hero.getByRole("button", { name: "Show slide 4: Marine Insurance" }).click();
ok((await hero.locator('[aria-roledescription="slide"][aria-hidden="false"]').innerText()).includes("Marine Insurance"), "hero dot shows chosen slide");
await hero.getByRole("button", { name: "Next slide", exact: true }).click();
ok((await hero.locator('[aria-roledescription="slide"][aria-hidden="false"]').innerText()).includes("Aviation Insurance"), "hero next arrow advances");
await hero.getByRole("button", { name: "Previous slide", exact: true }).click();
ok((await hero.locator('[aria-roledescription="slide"][aria-hidden="false"]').innerText()).includes("Marine Insurance"), "hero previous arrow returns");
await p.waitForTimeout(7600);
ok((await hero.locator('[aria-roledescription="slide"][aria-hidden="false"]').innerText()).includes("Marine Insurance"), "hero stays on the reader's selection");
await insurance.getByRole("button", { name: "Show slide 3: Aviation", exact: true }).click();
ok((await insurance.locator('[aria-hidden="false"] p').innerText()).startsWith("The sky is the ultimate frontier"), "insurance dot swaps photo, selection and copy");
await insurance.getByRole("button", { name: "Show slide 3: Aviation", exact: true }).press("ArrowRight");
ok((await insurance.locator('[aria-hidden="false"]').getAttribute("aria-label")).includes("Financial Lines"), "arrow key advances insurance carousel");
await insurance.scrollIntoViewIfNeeded();
await p.mouse.move(1, 1);
await p.evaluate(() => document.activeElement.blur());
const before = await insurance.locator('[aria-hidden="false"]').getAttribute("aria-label");
await p.waitForTimeout(10400);
ok((await insurance.locator('[aria-hidden="false"]').getAttribute("aria-label")) !== before, "insurance carousel advances automatically");
const partners = p.getByRole("region", { name: "Partner logos", exact: true });
await p.setViewportSize({ width: 390, height: 844 });
await partners.getByRole("button", { name: "Show partners 7 to 9" }).click();
await p.waitForTimeout(900);
ok((await partners.locator(".partner-slider__track").evaluate(el => Math.round(el.scrollLeft / (el.clientWidth + 15)))) === 2, "partner dots navigate three-logo pages");
await p.setViewportSize({ width: 1280, height: 900 });
// FAQ
ok(await p.locator("#faq-question-0").getAttribute("aria-expanded") === "true", "first FAQ open by default");
await p.getByText("What sets ION Insurance apart from other insurers?").click();
ok(await p.getByText("What sets ION Insurance apart from other insurers is our specialized focus").isVisible(), "FAQ opens on click");
// Reduced motion disables the lower carousel's automatic progression.
const rm = await b.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
await rm.goto(B + "/", { waitUntil: "networkidle" });
const rmInsurance = rm.getByRole("region", { name: "Lines of insurance", exact: true });
await rmInsurance.scrollIntoViewIfNeeded();
await rm.mouse.move(1, 1); await rm.waitForTimeout(10400);
ok((await rmInsurance.locator('[aria-hidden="false"]').getAttribute("aria-label")).includes("Commercial Property"), "reduced motion: automatic carousel stays put");
await rm.close();
// products accordion
await p.goto(B + "/products", { waitUntil: "networkidle" });
ok((await p.locator('.product-toggle[aria-expanded="true"]').count()) === 0, "products all closed at first");
await p.getByRole("heading", { name: "Marine", exact: true }).click();
ok(await p.getByText("Hull Insurance:", { exact: true }).isVisible(), "row opens");
await p.getByRole("heading", { name: "Aviation", exact: true }).click();
ok((await p.locator('.product-toggle[aria-expanded="true"]').count()) === 1 && await p.getByText("Ground Risk Hull Insurance:").isVisible(), "only one row open at a time");
await p.waitForTimeout(400);
const bg = await p.locator('.product-toggle[aria-expanded="true"]').evaluate((e) => getComputedStyle(e).backgroundColor);
ok(bg === "rgb(244, 244, 244)", "open row uses a light neutral background");
await p.goto(B + "/products#surety", { waitUntil: "networkidle" }); await p.waitForTimeout(300);
ok(await p.locator("#surety-button").getAttribute("aria-expanded") === "true", "/products#surety opens Surety");
// all pdf links 200
await p.goto(B + "/financials", { waitUntil: "networkidle" });
const pdfs = await p.locator('a[href$=".pdf"]').evaluateAll((as) => as.map((a) => a.href));
const st = await Promise.all(pdfs.map((u) => fetch(u, { method: "HEAD" }).then((r) => r.status + " " + r.headers.get("content-type"))));
ok(pdfs.length === 4 && st.every((s) => s === "200 application/pdf"), "4 Full Report links serve PDFs");
await b.close();
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
