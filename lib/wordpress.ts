import type { ContactValues } from "@/lib/contact";

/** Preserve the existing Gravity Forms entry, notifications and reCAPTCHA checks. */
export async function submitToWordPress(values: ContactValues, captcha: string) {
  const origin = process.env.WORDPRESS_ORIGIN?.replace(/\/$/, "");
  if (!origin) return null;
  if (!captcha && process.env.FORMS_MODE !== "validate") {
    return { ok: false, status: 422, message: "Please complete the CAPTCHA before sending." };
  }
  const validation = process.env.FORMS_MODE === "validate";
  try {
    const response = await fetch(`${origin}/wp-json/gf/v2/forms/1/submissions${validation ? "/validation" : ""}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input_1_3: values.first, input_1_6: values.last,
        input_2: values.email, input_3: values.message,
        "g-recaptcha-response": captcha,
      }),
      signal: AbortSignal.timeout(15_000),
      redirect: "error",
    });
    const data = await response.json().catch(() => null);
    if (response.ok && data?.is_valid === true) return { ok: true, status: 200, validation };
    if (data?.is_valid === false) return { ok: false, status: 422, message: "Please check your details and complete the CAPTCHA again." };
    return { ok: false, status: 502, message: "Your message didn't send. Please try again or email info@ion.co.cr." };
  } catch {
    return { ok: false, status: 502, message: "Your message didn't send. Please try again or email info@ion.co.cr." };
  }
}
