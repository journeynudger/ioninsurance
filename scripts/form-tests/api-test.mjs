import fs from "node:fs";
import crypto from "node:crypto";
const LOG = process.argv[2];
const good = { first: "Ada", last: "Lovelace", email: "ada@example.com", message: "Marine hull cover for two vessels." };
const old = () => Date.now() - 10_000;
let pass = 0, fail = 0;
const ok = (cond, name, extra = "") => { if (cond) pass++; else fail++; console.log(`${cond ? "PASS" : "FAIL"} ${name} ${cond ? "" : extra}`); };
const post = async (port, body, headers = { "content-type": "application/json" }) => {
  const t = Date.now();
  const r = await fetch(`http://localhost:${port}/api/contact`, { method: "POST", headers, body: typeof body === "string" ? body : JSON.stringify(body) });
  return { status: r.status, json: await r.json().catch(() => null), ms: Date.now() - t, cache: r.headers.get("cache-control") };
};
const lines = () => fs.readFileSync(LOG, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
const reset = () => fs.writeFileSync(LOG, "");

// 1. happy path: both destinations get it, correctly shaped
reset();
let r = await post(3142, { ...good, startedAt: old(), website: "" });
ok(r.status === 200 && r.json.ok === true, "valid message → 200 ok", JSON.stringify(r));
ok(r.cache === "no-store", "response not cacheable");
let L = lines();
const email = L.find((x) => x.url === "/resend"), hook = L.find((x) => x.url === "/hook");
ok(email && hook && L.length === 2, "exactly one email + one webhook", L.length);
const e = JSON.parse(email.body);
ok(e.reply_to === "ada@example.com" && e.to.join() === "a@example.com,b@example.com" && e.from === "ION <forms@example.com>", "email to/from/reply_to");
ok(e.subject === "Website enquiry from Ada Lovelace" && e.text.includes("Marine hull cover for two vessels."), "email subject + body");
ok(email.headers.authorization === "Bearer test", "Resend auth header");
const sig = "sha256=" + crypto.createHmac("sha256", "s3cret").update(hook.body).digest("hex");
ok(hook.headers["x-signature"] === sig, "webhook HMAC signature verifies");
const h = JSON.parse(hook.body);
ok(h.first === "Ada" && h.last === "Lovelace" && h.email === "ada@example.com" && h.message === good.message && !("website" in h) && !("startedAt" in h), "webhook payload clean");

// 2. HTML injection is escaped in the email
reset();
await post(3142, { ...good, first: "<script>x</script>", message: `<img src=x onerror=alert(1)> & "q"`, startedAt: old() });
const em = lines().map((x) => JSON.parse(x.body)).find((b) => b.html);
ok(em && !em.html.includes("<script>") && !em.html.includes("<img") && em.html.includes("&#60;script&#62;"), "HTML escaped in email", em?.html);

// 3. whitespace trimmed
reset();
await post(3142, { first: "  Ada ", last: " L ", email: " ada@example.com ", message: "  hi  ", startedAt: old() });
ok(JSON.parse(lines().find((x) => x.url === "/hook").body).first === "Ada", "values trimmed");

// 4. validation
for (const [name, patch, field] of [
  ["missing first", { first: "" }, "first"], ["missing last", { last: "   " }, "last"], ["missing email", { email: "" }, "email"],
  ["bad email", { email: "ada@" }, "email"], ["bad email 2", { email: "ada example.com" }, "email"], ["missing message", { message: "" }, "message"],
  ["first too long", { first: "a".repeat(101) }, "first"], ["message too long", { message: "m".repeat(5001) }, "message"],
  ["non-string fields", { first: 42, email: ["a@b.co"] }, "first"],
]) {
  reset();
  r = await post(3142, { ...good, ...patch, startedAt: old() });
  ok(r.status === 422 && r.json.errors?.[field] && lines().length === 0, `${name} → 422 on ${field}, nothing sent`, JSON.stringify(r.json));
}
r = await post(3142, { startedAt: old() });
ok(r.status === 422 && Object.keys(r.json.errors).length === 4, "empty form → 4 errors");

// 5. spam traps: look successful, deliver nothing
reset();
r = await post(3142, { ...good, website: "http://spam.example", startedAt: old() });
ok(r.status === 200 && r.json.ok && lines().length === 0, "honeypot filled → 200, nothing sent");
r = await post(3142, { ...good, startedAt: Date.now() - 300 });
ok(r.status === 200 && lines().length === 0, "submitted in 0.3s → 200, nothing sent");
r = await post(3142, { ...good });
ok(r.status === 200 && lines().length === 0, "no startedAt (scripted post) → 200, nothing sent");

// 6. malformed requests
r = await post(3142, "first=Ada", { "content-type": "application/x-www-form-urlencoded" });
ok(r.status === 415, "form-encoded → 415");
r = await post(3142, "{not json", { "content-type": "application/json" });
ok(r.status === 400, "malformed JSON → 400");
r = await post(3142, JSON.stringify({ ...good, message: "x".repeat(30_000), startedAt: old() }));
ok(r.status === 413, "30 KB body → 413");
r = await post(3142, "null");
ok(r.status === 400, "JSON null → 400", r.status);
r = await post(3142, "[]");
ok(r.status === 400, "JSON array → 400", r.status);
const g = await fetch("http://localhost:3142/api/contact");
ok(g.status === 405, "GET → 405", g.status);

// 7. delivery failures are reported honestly
reset();
r = await post(3143, { ...good, startedAt: old() });
ok(r.status === 503 && r.json.ok === false, "both destinations fail → 503", JSON.stringify(r));
r = await post(3144, { ...good, startedAt: old() });
ok(r.status === 200 && r.json.ok, "webhook fails, email ok → 200");
r = await post(3141, { ...good, startedAt: old() });
ok(r.status === 503, "no destination configured → 503 (never pretends)");
r = await post(3146, { ...good, startedAt: old() });
ok(r.status === 200 && r.json.dryRun === true, "FORMS_DRY_RUN=1 → 200 dryRun");
r = await post(3145, { ...good, startedAt: old() });
ok(r.status === 200 && r.ms >= 7_000 && r.ms < 12_000, `hanging webhook times out, email still lands (${r.ms} ms)`);

// 8. Airtable: one row per message, right columns, failure reported
reset();
r = await post(3147, { ...good, startedAt: old() });
L = lines();
ok(r.status === 200 && r.json.ok && L.length === 1, "Airtable only → 200, one request", JSON.stringify(r));
ok(L[0]?.url === "/airtable/appTEST/Website%20Messages" && L[0].headers.authorization === "Bearer pat-test", "Airtable URL + token", L[0]?.url);
const at = JSON.parse(L[0]?.body ?? "{}");
const f = at.records?.[0]?.fields ?? {};
ok(at.typecast === true && at.records.length === 1 && f["First name"] === "Ada" && f["Last name"] === "Lovelace" && f.Email === "ada@example.com" && f.Message === good.message && !Number.isNaN(Date.parse(f["Submitted at"])), "Airtable row fields", JSON.stringify(at));
r = await post(3148, { ...good, startedAt: old() });
ok(r.status === 503 && r.json.ok === false, "Airtable rejects → 503 (never pretends)", JSON.stringify(r));

// 9. concurrency: 20 parallel valid posts → 20 emails, no loss/dupes
reset();
const rs = await Promise.all(Array.from({ length: 20 }, (_, i) => post(3142, { ...good, message: `msg ${i}`, startedAt: old() })));
const got = lines().filter((x) => x.url === "/hook").map((x) => JSON.parse(x.body).message).sort();
ok(rs.every((x) => x.status === 200) && got.length === 20 && new Set(got).size === 20, "20 concurrent → 20 distinct deliveries", got.length);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
