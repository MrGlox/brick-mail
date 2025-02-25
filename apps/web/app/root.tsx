import {
  ActionFunctionArgs,
  Links,
  type LinksFunction,
  type LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  isRouteErrorResponse,
  replace,
  useLoaderData,
  useRouteError,
} from "react-router";

import clsx from "clsx";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import { getToast } from "remix-toast";
import { Toaster, toast as notify } from "sonner";
import { z } from "zod";

import { type RemixService } from "../../server";

import { resourcesList } from "~/config/i18n";
import { customErrorMap } from "~/config/zod";

import { CookieBanner } from "~/containers/cookie-banner";
import { NotFoundError } from "~/containers/errors/not-found-error";

import i18next, { i18nCookie } from "~/modules/i18n.server";

import { getOptionalUser } from "~/server/auth.server";
import { cookieConsent } from "~/server/session/cookie-consent.server";
import { themeSessionResolver } from "~/server/session/theme.server";

import fontStylesheetUrl from "~/styles/fonts.css?url";
import globalsStylesheetUrl from "~/styles/globals.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: fontStylesheetUrl },
  { rel: "stylesheet", href: globalsStylesheetUrl },
];

export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  i18n: resourcesList,
};

export { meta } from "~/config/meta";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { getTheme } = await themeSessionResolver(request);
  const { toast, headers } = await getToast(request);

  const t = await i18next.getFixedT(request, "common");

  const locale = await i18next.getLocale(request);
  const user = await getOptionalUser({ context });

  const cookieHeader = request.headers.get("Cookie");
  const { showBanner, cookieConsent: cookieConsentValue } =
    (await cookieConsent.parse(cookieHeader)) || {
      showBanner: true,
    };

  return data(
    {
      // Global
      locale,
      user,
      showBanner,
      cookieConsent: cookieConsentValue,
      theme: getTheme() || "dark",
      toast,
      // Translated meta tags
      title: t("title", { website: process.env.APP_NAME }),
      description: t("description"),
    },
    {
      headers,
    }
  );
};

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");

  const locale = await i18next.getLocale(request);
  const cookie = (await cookieConsent.parse(cookieHeader)) || {};

  const bodyParams = await request.formData();

  if (bodyParams.get("cookieConsent") === "rejected") {
    cookie.cookieConsent = false;
    cookie.showBanner = false;

    return replace((bodyParams.get("currentRoute") as string) || "/", {
      headers: {
        "Set-Cookie": await cookieConsent.serialize(cookie),
      },
    });
  }

  cookie.cookieConsent = true;
  cookie.showBanner = false;

  return replace((bodyParams.get("currentRoute") as string) || "/", {
    headers: [
      ["Set-Cookie", await cookieConsent.serialize(cookie)],
      ["Set-Cookie", await i18nCookie.serialize(locale)],
    ],
  });
}

declare module "react-router" {
  interface AppLoadContext {
    remixService: RemixService;
    user: unknown;
  }
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider
      specifiedTheme={data.theme as Theme}
      themeAction="/actions/set-theme"
    >
      <AppRoot />
    </ThemeProvider>
  );
}

export function AppRoot() {
  const { showBanner, toast, ...data } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  const [theme] = useTheme();

  useEffect(() => {
    if (!toast) return;

    notify[toast?.type || "info"](toast?.message, {
      description: toast?.description,
    });
  }, [toast]);

  z.setErrorMap(customErrorMap);

  return (
    <html
      lang={i18n.language}
      data-theme={theme ?? ""}
      dir={i18n.dir()}
      className={clsx(theme, "min-h-screen")}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col">
        <Outlet />
        {showBanner && <CookieBanner />}
        <ScrollRestoration />
        <Toaster theme={theme ?? "dark"} richColors position="top-right" />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError() as Error & { data?: string };
  const { i18n } = useTranslation();

  const isProduction = process.env.NODE_ENV === "production";
  console.error("error", error);

  if (isRouteErrorResponse(error) && isProduction) {
    return (
      <html lang={i18n.language} dir={i18n.dir()} className="min-h-screen">
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          <section className="container relative min-h-screen flex-col items-center justify-center grid">
            <NotFoundError />
          </section>
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang={i18n.language} dir={i18n.dir()} className="min-h-screen">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container relative min-h-screen flex-col items-center justify-center p-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/20">
            <h1 className="mb-4 text-2xl font-bold text-red-700 dark:text-red-400">
              Application Error
            </h1>
            <div className="mb-4">
              <p className="font-medium text-red-600 dark:text-red-300">
                {error?.message || ""}
              </p>
            </div>
            <div className="mt-4">
              <p className="mb-2 font-medium text-red-600 dark:text-red-300">
                Stack trace:
              </p>
              <pre className="overflow-x-auto rounded bg-red-100 p-4 font-mono text-sm text-red-800 dark:bg-red-900/40 dark:text-red-200">
                {error?.stack || error?.data}
              </pre>
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
