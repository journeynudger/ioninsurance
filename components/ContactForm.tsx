"use client";

import { useEffect, useRef, useState } from "react";
import { clean, LIMITS, validate, type ContactErrors, type ContactValues } from "@/lib/contact";
import { contact } from "@/lib/content";

type Status = "idle" | "sending" | "sent" | "failed";
const EMPTY: ContactValues = { first: "", last: "", email: "", message: "" };
const ORDER: (keyof ContactValues)[] = ["first", "last", "email", "message"];

export default function ContactForm({ id = "contact" }: { id?: string }) {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [tried, setTried] = useState(false);
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
  }, [status]);

  function update(name: keyof ContactValues, value: string) {
    const next = { ...values, [name]: value };
    setValues(next);
    // Once someone has tried to send, clear each message as soon as the field is fixed.
    if (tried) setErrors(validate(clean(next)));
  }

  function focusFirst(e: ContactErrors) {
    const first = ORDER.find((k) => e[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setTried(true);
    const v = clean(values);
    const e = validate(v);
    setErrors(e);
    if (Object.keys(e).length) return focusFirst(e);

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, website: honeypot.current?.value ?? "", startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: ContactErrors };
      if (res.ok && data.ok) {
        setStatus("sent");
        setValues(EMPTY);
      } else if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        focusFirst(data.errors);
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="rounded-2xl border border-rule bg-white p-8 text-lg leading-relaxed text-ink outline-none">
        <p className="font-serif text-2xl text-navy-ink">Message sent</p>
        <p className="mt-2 text-ink-soft">{contact.success}</p>
        <button type="button" onClick={() => { setStatus("idle"); setTried(false); setErrors({}); startedAt.current = Date.now(); }} className="mt-6 font-medium text-navy underline underline-offset-4 hover:text-navy-deep">
          Send another message
        </button>
      </div>
    );
  }

  const field = (name: keyof ContactValues) => ({
    id: `${id}-${name}`,
    name,
    value: values[name],
    required: true,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(name, e.target.value),
    className: `mt-2 block w-full rounded-lg border bg-white px-4 py-3 text-base text-ink shadow-sm transition-colors placeholder:text-ink-soft/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/25 ${errors[name] ? "border-error" : "border-rule"}`,
  });
  const error = (name: keyof ContactValues) =>
    errors[name] ? <p id={`${id}-${name}-error`} className="mt-1.5 text-sm text-error">{errors[name]}</p> : null;
  const label = "block text-sm font-medium text-ink";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-label={contact.title} className="grid gap-5 rounded-2xl border border-rule bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-8">
      <div>
        <label htmlFor={`${id}-first`} className={label}>{contact.fields.first}</label>
        <input {...field("first")} type="text" autoComplete="given-name" maxLength={LIMITS.name} />
        {error("first")}
      </div>
      <div>
        <label htmlFor={`${id}-last`} className={label}>{contact.fields.last}</label>
        <input {...field("last")} type="text" autoComplete="family-name" maxLength={LIMITS.name} />
        {error("last")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-email`} className={label}>{contact.fields.email}</label>
        <input {...field("email")} type="email" autoComplete="email" inputMode="email" maxLength={LIMITS.email} />
        {error("email")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className={label}>{contact.fields.message}</label>
        <textarea {...field("message")} rows={5} maxLength={LIMITS.message} />
        {error("message")}
      </div>
      {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input ref={honeypot} id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className="rounded-full bg-navy px-7 py-3 font-medium text-white transition-colors hover:bg-navy-deep disabled:cursor-wait disabled:opacity-70">
          {status === "sending" ? "Sending…" : contact.submit}
        </button>
        <p role="alert" className="text-sm text-error">
          {status === "failed" ? contact.failure : ""}
        </p>
      </div>
    </form>
  );
}
