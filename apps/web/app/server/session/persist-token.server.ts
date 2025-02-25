import { createCookie } from "react-router"; // or cloudflare/deno

export const persistToken = createCookie("_persist-token", {
  path: "/",
  sameSite: "lax",
  maxAge: 60,
});
