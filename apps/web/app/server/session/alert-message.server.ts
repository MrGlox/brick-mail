import { createCookie } from "react-router"; // or cloudflare/deno

export const alertMessage = createCookie("alertMessage", {
  maxAge: 5,
});

export const alertMessageHelper = async (request) => {
  const cookieHeader = request.headers.get("Cookie");
  const message = await alertMessage.parse(cookieHeader);

  return {
    message,
    headers: [
      ["Set-Cookie", await alertMessage.serialize("", { maxAge: 0 })],
    ] as [string, string][],
  };
};

export const alertMessageGenerator = async (message, type) => {
  return ["Set-Cookie", await alertMessage.serialize([message, type])] as [
    string,
    string,
  ];
};
