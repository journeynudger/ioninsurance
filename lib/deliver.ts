import crypto from "node:crypto";
import type { ContactValues } from "@/lib/contact";

/**
 * Where a contact message goes. Each destination is switched on by environment variables
 * (see .env.example); a message counts as sent when at least one destination accepts it.
 *
 *   email    RESEND_API_KEY + FORMS_EMAIL_FROM + FORMS_EMAIL_TO   (Reply-To is the sender)
 *   webhook  FORMS_WEBHOOK_URL (+ FORMS_WEBHOOK_SECRET signs the body, HMAC-SHA256)
 *   airtable AIRTABLE_TOKEN + AIRTABLE_BASE_ID + AIRTABLE_TABLE   (one row per message)
 */

export interface Delivery { destination: "email" | "webhook" | "airtable"; ok: boolean; detail?: string }

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function deliverByEmail(v: ContactValues): Promise<Delivery | null> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.FORMS_EMAIL_FROM;
  const to = process.env.FORMS_EMAIL_TO?.split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || !from || !to?.length) return null;
  const name = `${v.first} ${v.last}`;
  const text = `Name: ${name}\nEmail: ${v.email}\n\n${v.message}\n`;
  const html = `<p><strong>Name:</strong> ${esc(name)}<br><strong>Email:</strong> ${esc(v.email)}</p><p style="white-space:pre-wrap">${esc(v.message)}</p>`;
  try {
    const res = await fetch(process.env.RESEND_API_URL || "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, reply_to: v.email, subject: `Website enquiry from ${name}`, text, html }),
      signal: AbortSignal.timeout(8_000),
    });
    return { destination: "email", ok: res.ok, detail: `HTTP ${res.status}` };
  } catch (err) {
    return { destination: "email", ok: false, detail: (err as Error).message };
  }
}

export async function deliverToWebhook(v: ContactValues): Promise<Delivery | null> {
  const url = process.env.FORMS_WEBHOOK_URL;
  if (!url) return null;
  const body = JSON.stringify({ form: "contact", submittedAt: new Date().toISOString(), ...v });
  // Accept JSON so form services such as Formspree answer with a status instead of a redirect page.
  const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
  const secret = process.env.FORMS_WEBHOOK_SECRET;
  if (secret) headers["X-Signature"] = "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex");
  try {
    const res = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(8_000) });
    return { destination: "webhook", ok: res.ok, detail: `HTTP ${res.status}` };
  } catch (err) {
    return { destination: "webhook", ok: false, detail: (err as Error).message };
  }
}

export async function deliverToAirtable(v: ContactValues): Promise<Delivery | null> {
  const token = process.env.AIRTABLE_TOKEN;
  const base = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE;
  if (!token || !base || !table) return null;
  const api = process.env.AIRTABLE_API_URL || "https://api.airtable.com/v0";
  // Column names must match the table exactly; typecast lets "Submitted at" be a date or a text field.
  const fields = { "First name": v.first, "Last name": v.last, Email: v.email, Message: v.message, "Submitted at": new Date().toISOString() };
  try {
    const res = await fetch(`${api}/${encodeURIComponent(base)}/${encodeURIComponent(table)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
      signal: AbortSignal.timeout(8_000),
    });
    // Airtable explains a rejected row (e.g. UNKNOWN_FIELD_NAME) in the body; keep it for the logs.
    const detail = res.ok ? `HTTP ${res.status}` : `HTTP ${res.status} ${(await res.text().catch(() => "")).slice(0, 200)}`;
    return { destination: "airtable", ok: res.ok, detail };
  } catch (err) {
    return { destination: "airtable", ok: false, detail: (err as Error).message };
  }
}
