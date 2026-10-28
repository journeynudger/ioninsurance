// Menu, slider, tabs, FAQ and products accordion. Run against `next start -p 3141`.
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
// slider dots
await p.getByRole("button", { name: "Show slide 4: Marine Insurance" }).click();
await p.waitForTimeout(800);
ok((await p.locator('[aria-roledescription="slide"][aria-hidden="false"]').innerText()).includes("Marine Insurance"), "slider dot shows chosen slide");
// autoplay advances (after hover leaves)
await p.mouse.move(640, 1500);
await p.getByRole("button", { name: "Show slide 1: Commercial Property" }).click();
await p.mouse.move(5, 1500); await p.evaluate(() => document.activeElement.blur());
await p.waitForTimeout(7600);
ok((await p.locator('[aria-roledescription="slide"][aria-hidden="false"]').innerText()).includes("Financial Lines"), "slider autoplays to the next slide");
// tabs click + arrows
await p.getByRole("tab", { name: "03 Aviation" }).click();
ok((await p.locator("#line-panel").innerText()).startsWith("The sky is the ultimate frontier"), "tab click swaps the paragraph");
await p.keyboard.press("ArrowDown");
ok((await p.getByRole("tab", { selected: true }).innerText()).includes("04 Financial Lines") && (await p.evaluate(() => document.activeElement.textContent)).includes("Financial Lines"), "arrow key moves tab and focus");
// FAQ
ok(await p.locator("details").first().evaluate((d) => d.open), "first FAQ open by default");
await p.getByText("What sets ION Insurance apart from other insurers?").click();
ok(await p.getByText("What sets ION Insurance apart from other insurers is our specialized focus").isVisible(), "FAQ opens on click");
// reduced motion: no autoplay
const rm = await b.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
await rm.goto(B + "/", { waitUntil: "networkidle" }); await rm.mouse.move(5, 1500); await rm.waitForTimeout(7600);
ok((await rm.locator('[aria-roledescription="slide"][aria-hidden="false"]').innerText()).includes("Commercial Property"), "reduced motion: slider stays put");
await rm.close();
// products accordion
await p.goto(B + "/products", { waitUntil: "networkidle" });
ok((await p.locator("details[open]").count()) === 0, "products all closed at first");
await p.getByRole("heading", { name: "Marine", exact: true }).click();
ok(await p.getByText("Hull Insurance:", { exact: true }).isVisible(), "row opens");
await p.getByRole("heading", { name: "Aviation", exact: true }).click();
ok((await p.locator("details[open]").count()) === 1 && await p.getByText("Ground Risk Hull Insurance:").isVisible(), "only one row open at a time");
await p.waitForTimeout(400);
const bg = await p.locator("details[open] > summary").evaluate((e) => getComputedStyle(e).backgroundColor);
ok(bg === "rgb(0, 0, 0)", "open row is the black bar");
await p.goto(B + "/products#surety", { waitUntil: "networkidle" }); await p.waitForTimeout(300);
ok(await p.locator("details#surety").evaluate((d) => d.open), "/products#surety opens Surety");
// all pdf links 200
await p.goto(B + "/financials", { waitUntil: "networkidle" });
const pdfs = await p.locator('a[href$=".pdf"]').evaluateAll((as) => as.map((a) => a.href));
const st = await Promise.all(pdfs.map((u) => fetch(u, { method: "HEAD" }).then((r) => r.status + " " + r.headers.get("content-type"))));
ok(pdfs.length === 4 && st.every((s) => s === "200 application/pdf"), "4 Full Report links serve PDFs");
await b.close();
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
