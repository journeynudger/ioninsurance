import { NextResponse } from "next/server";
import { clean, validate } from "@/lib/contact";
import { deliverByEmail, deliverToWebhook } from "@/lib/deliver";

/** POST /api/contact: the "Connect With Us" form. Validates, then hands the message to lib/deliver.ts. */

const MAX_BODY = 20_000;
const MIN_FILL_MS = 2_000;

function reply(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return reply({ ok: false, message: "Send JSON." }, 415);
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY) return reply({ ok: false, message: "That message is too long." }, 413);
  let input: Record<string, unknown>;
  try {
    input = JSON.parse(raw);
  } catch {
    return reply({ ok: false, message: "Malformed request." }, 400);
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return reply({ ok: false, message: "Malformed request." }, 400);
  }

  // A filled honeypot, or a form sent faster than a person can type: look successful, send nothing.
  const startedAt = typeof input.startedAt === "number" ? input.startedAt : 0;
  if (input.website || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    console.info("[contact] dropped as spam", input.website ? "(honeypot)" : "(timing)");
    return reply({ ok: true });
  }

  const values = clean(input);
  const errors = validate(values);
  if (Object.keys(errors).length) return reply({ ok: false, errors }, 422);

  const deliveries = (await Promise.all([deliverByEmail(values), deliverToWebhook(values)])).filter((d) => d !== null);
  for (const d of deliveries) console[d.ok ? "info" : "error"](`[contact] ${d.destination}: ${d.ok ? "ok" : "FAILED"} ${d.detail ?? ""}`);

  if (deliveries.some((d) => d.ok)) return reply({ ok: true });
  if (!deliveries.length && process.env.FORMS_DRY_RUN === "1") {
    console.info("[contact] dry run: valid, delivered nowhere");
    return reply({ ok: true, dryRun: true });
  }
  // Nothing accepted it. Say so rather than pretend; the visitor can email instead.
  console.error(`[contact] NOT DELIVERED (${deliveries.length ? "all destinations failed" : "no destination configured"})`);
  return reply({ ok: false }, 503);
}
