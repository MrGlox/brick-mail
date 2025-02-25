import { createCookie } from "react-router"; // or cloudflare/deno

export const cookieConsent = createCookie("_cookie-consent", {
  path: "/",
  sameSite: "lax",
  maxAge: 604_800, // one week
});
