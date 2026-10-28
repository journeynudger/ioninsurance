import crypto from "node:crypto";
import type { ContactValues } from "@/lib/contact";

/**
 * Where a contact message goes. Each destination is switched on by environment variables
 * (see .env.example); a message counts as sent when at least one destination accepts it.
 *
 *   email    RESEND_API_KEY + FORMS_EMAIL_FROM + FORMS_EMAIL_TO   (Reply-To is the sender)
 *   webhook  FORMS_WEBHOOK_URL (+ FORMS_WEBHOOK_SECRET signs the body, HMAC-SHA256)
 */

export interface Delivery { destination: "email" | "webhook"; ok: boolean; detail?: string }

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
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.FORMS_WEBHOOK_SECRET;
  if (secret) headers["X-Signature"] = "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex");
  try {
    const res = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(8_000) });
    return { destination: "webhook", ok: res.ok, detail: `HTTP ${res.status}` };
  } catch (err) {
    return { destination: "webhook", ok: false, detail: (err as Error).message };
  }
}
