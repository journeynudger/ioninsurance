// The contact form's rules, shared by the browser and the route handler so they can't disagree.

export interface ContactValues { first: string; last: string; email: string; message: string }
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export const LIMITS = { name: 100, email: 254, message: 5000 } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function clean(input: unknown): ContactValues {
  const o = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  return { first: s(o.first), last: s(o.last), email: s(o.email), message: s(o.message) };
}

export function validate(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};
  if (!v.first) e.first = "Enter your first name.";
  else if (v.first.length > LIMITS.name) e.first = `Keep it under ${LIMITS.name} characters.`;
  if (!v.last) e.last = "Enter your last name.";
  else if (v.last.length > LIMITS.name) e.last = `Keep it under ${LIMITS.name} characters.`;
  if (!v.email) e.email = "Enter your email address.";
  else if (v.email.length > LIMITS.email || !EMAIL.test(v.email)) e.email = "Enter an email address like name@example.com.";
  if (!v.message) e.message = "Tell us what type of insurance you're looking for.";
  else if (v.message.length > LIMITS.message) e.message = `Keep it under ${LIMITS.message} characters.`;
  return e;
}
