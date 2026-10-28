"use client";

type CaptchaApi = {
  ready(callback: () => void): void;
  render(element: HTMLElement, options: object): number;
  getResponse(id: number): string;
  reset(id: number): void;
};
const api = () => (window as unknown as { grecaptcha?: CaptchaApi }).grecaptcha;
let loading: Promise<void> | undefined;

export async function mountCaptcha(element: HTMLElement) {
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => reject(new Error("CAPTCHA unavailable")), 15_000);
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.onload = () => api()?.ready(() => { window.clearTimeout(timeout); resolve(); });
    script.onerror = () => { window.clearTimeout(timeout); loading = undefined; reject(new Error("CAPTCHA unavailable")); };
    document.head.appendChild(script);
  });
  await loading;
  const id = api()!.render(element, { sitekey: "6Lfu9IAtAAAAACRKjWIFdA_up30HmuKGir4azjE4", size: element.clientWidth < 304 ? "compact" : "normal" });
  return { token: () => api()!.getResponse(id), reset: () => api()!.reset(id) };
}
