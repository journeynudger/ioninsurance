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
  const [notice, setNotice] = useState("");

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
    setNotice("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, website: honeypot.current?.value ?? "", startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: ContactErrors; message?: string };
      if (res.ok && data.ok) {
        setStatus("sent");
        setValues(EMPTY);
      } else if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        focusFirst(data.errors);
      } else {
        setNotice(data.message ?? "");
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="rounded-[25px] bg-field px-8 py-10 text-center outline-none">
        <p className="text-[24px] leading-tight text-ink">Message sent</p>
        <p className="mt-3 text-[18px] leading-[1.5]">{contact.success}</p>
        <button type="button" onClick={() => { setStatus("idle"); setTried(false); setErrors({}); setNotice(""); startedAt.current = Date.now(); }} className="mt-5 text-[16px] text-heading underline underline-offset-4">
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
    placeholder: contact.placeholders[name],
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(name, e.target.value),
    className: "field",
  });
  const error = (name: keyof ContactValues) =>
    errors[name] ? <p id={`${id}-${name}-error`} className="mt-1 px-5 text-[14px] leading-snug text-error">{errors[name]}</p> : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-label={contact.title} className="grid gap-x-3 gap-y-[14px] sm:grid-cols-2">
      <div>
        <label htmlFor={`${id}-first`} className="sr-only">{contact.fields.first}</label>
        <input {...field("first")} type="text" autoComplete="given-name" maxLength={LIMITS.name} />
        {error("first")}
      </div>
      <div>
        <label htmlFor={`${id}-last`} className="sr-only">{contact.fields.last}</label>
        <input {...field("last")} type="text" autoComplete="family-name" maxLength={LIMITS.name} />
        {error("last")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-email`} className="sr-only">{contact.fields.email}</label>
        <input {...field("email")} type="email" autoComplete="email" inputMode="email" maxLength={LIMITS.email} />
        {error("email")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className="sr-only">{contact.fields.message}</label>
        <textarea {...field("message")} rows={7} maxLength={LIMITS.message} className="field min-h-[190px]" />
        {error("message")}
      </div>
      {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input ref={honeypot} id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div className="mt-6 flex flex-col items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className="rounded-[25px] bg-button px-[60px] py-3 text-[17px] font-bold leading-[17px] tracking-[0.5px] text-heading transition-colors hover:bg-[#cfcfcf] disabled:cursor-wait disabled:opacity-70">
          {status === "sending" ? "Sending…" : contact.submit}
        </button>
        <p role="alert" className="text-center text-[14px] leading-snug text-error">
          {notice || (status === "failed" ? contact.failure : "")}
        </p>
      </div>
    </form>
  );
}
