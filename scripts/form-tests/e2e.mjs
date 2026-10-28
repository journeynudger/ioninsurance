import fs from "node:fs";

import { chromium } from "playwright-core";
const LOG = process.argv[2], OUT = process.argv[3];
let pass = 0, fail = 0;
const ok = (c, n, x = "") => { if (c) pass++; else fail++; console.log(`${c ? "PASS" : "FAIL"} ${n} ${c ? "" : x}`); };
const hooks = () => fs.readFileSync(LOG, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse).filter((x) => x.url === "/hook");
const b = await chromium.launch();

for (const [w, path] of [[375, "/connect"], [1280, "/connect"], [1280, "/"], [1280, "/products"]]) {
  fs.writeFileSync(LOG, "");
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto("http://localhost:3142" + path, { waitUntil: "networkidle" });
  const f = p.locator('form[aria-label="Connect With Us"]');
  const tag = `${w} ${path}`;
  // empty submit
  await f.getByRole("button", { name: "Submit" }).click();
  ok(await f.locator('[aria-invalid="true"]').count() === 4, `${tag} empty submit marks 4 fields invalid`);
  ok(await p.evaluate(() => document.activeElement?.getAttribute("name")) === "first", `${tag} focus moves to first error`);
  ok(await f.getByText("Enter your first name.").isVisible(), `${tag} error text visible`);
  const desc = await f.locator('[name="email"]').getAttribute("aria-describedby");
  ok(desc && (await p.locator("#" + desc).count()) === 1, `${tag} error linked by aria-describedby`);
  // fix as you type
  await f.getByLabel("First name").fill("Grace");
  ok(await f.locator('[name="first"]').getAttribute("aria-invalid") === null, `${tag} error clears once fixed`);
  await f.getByLabel("Last name").fill("Hopper");
  await f.getByLabel("Email").fill("grace@");
  await f.getByRole("button", { name: "Submit" }).click();
  ok(await f.getByText("Enter an email address like name@example.com.").isVisible(), `${tag} bad email caught in browser`);
  ok(hooks().length === 0, `${tag} nothing sent while invalid`);
  await f.getByLabel("Email").fill("grace@example.com");
  await f.getByLabel(/type of insurance/).fill("Aviation hull and liability.");
  await p.waitForTimeout(2100); // a person takes longer than the 2s trap
  // double click should send once
  const btn = f.getByRole("button", { name: "Submit" });
  await btn.dblclick();
  await p.getByText("Message sent").waitFor({ timeout: 10_000 });
  ok(await p.getByText("Thanks for contacting us!").isVisible(), `${tag} success message shown`);
  ok(await p.evaluate(() => document.activeElement?.getAttribute("role")) === "status", `${tag} focus moves to confirmation`);
  await p.waitForTimeout(500);
  const h = hooks();
  ok(h.length === 1 && JSON.parse(h[0].body).message === "Aviation hull and liability.", `${tag} exactly one delivery with the message`, h.length);
  if (w === 375 && path === "/connect") await p.screenshot({ path: `${OUT}/form-sent-375.png` });
  // send another resets
  await p.getByRole("button", { name: "Send another message" }).click();
  ok(await f.getByLabel("First name").inputValue() === "", `${tag} send-another gives an empty form`);
  await p.close();
}

// keyboard only + failure path on the failing server
{
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto("http://localhost:3143/connect", { waitUntil: "networkidle" });
  const f = p.locator("form");
  await f.getByLabel("First name").focus();
  await p.keyboard.type("Alan"); await p.keyboard.press("Tab");
  await p.keyboard.type("Turing"); await p.keyboard.press("Tab");
  await p.keyboard.type("alan@example.com"); await p.keyboard.press("Tab");
  await p.keyboard.type("Surety bonds."); await p.keyboard.press("Tab");
  ok(await p.evaluate(() => document.activeElement?.textContent) === "Submit", "tab order reaches submit, skipping honeypot");
  await p.waitForTimeout(2100);
  await p.keyboard.press("Enter");
  await p.getByText("didn’t send").waitFor({ timeout: 15_000 });
  ok(await f.getByRole("alert").innerText().then((t) => t.includes("info@ion.co.cr")), "delivery failure shows the email fallback");
  ok(await f.getByLabel("First name").inputValue() === "Alan" && await f.getByLabel(/type of insurance/).inputValue() === "Surety bonds.", "values kept after a failure");
  await p.screenshot({ path: `${OUT}/form-failed-1280.png` });
  await p.close();
}

// network down: the request itself fails
{
  const p = await b.newPage({ viewport: { width: 375, height: 900 } });
  await p.goto("http://localhost:3142/connect", { waitUntil: "networkidle" });
  await p.route("**/api/contact", (r) => r.abort());
  const f = p.locator("form");
  await f.getByLabel("First name").fill("Kat"); await f.getByLabel("Last name").fill("Johnson");
  await f.getByLabel("Email").fill("kat@example.com"); await f.getByLabel(/type of insurance/).fill("Specialty.");
  await p.waitForTimeout(2100);
  await f.getByRole("button", { name: "Submit" }).click();
  await p.getByText("didn’t send").waitFor({ timeout: 5_000 });
  ok(true, "offline submit shows the failure message");
  ok(await f.getByRole("button", { name: "Submit" }).isEnabled(), "button re-enabled to retry");
  await p.unroute("**/api/contact");
  fs.writeFileSync(LOG, "");
  await f.getByRole("button", { name: "Submit" }).click();
  await p.getByText("Message sent").waitFor({ timeout: 10_000 });
  ok(hooks().length === 1, "retry after reconnect delivers once");
  await p.close();
}

// browser bot filling the honeypot gets a fake success and nothing is sent
{
  fs.writeFileSync(LOG, "");
  const p = await b.newPage();
  await p.goto("http://localhost:3142/connect", { waitUntil: "networkidle" });
  const f = p.locator("form");
  await p.fill('[name="website"]', "spam"); await f.getByLabel("First name").fill("Bot"); await f.getByLabel("Last name").fill("Bot");
  await f.getByLabel("Email").fill("bot@example.com"); await f.getByLabel(/type of insurance/).fill("buy now");
  await p.waitForTimeout(2100);
  await f.getByRole("button", { name: "Submit" }).click();
  await p.getByText("Message sent").waitFor();
  ok(hooks().length === 0, "honeypot bot sees success, nothing delivered");
  await p.close();
}
await b.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
