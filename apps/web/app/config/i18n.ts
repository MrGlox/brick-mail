import { serverOnly$ } from "vite-env-only/macros";

import adminEN from "../../public/locales/en/admin.json";
import alertsEN from "../../public/locales/en/alerts.json";
import authEN from "../../public/locales/en/auth.json";
import commonEN from "../../public/locales/en/common.json";
import dashboardEN from "../../public/locales/en/dashboard.json";
import notificationsEN from "../../public/locales/en/notifications.json";
import showcaseEN from "../../public/locales/en/showcase.json";
import validationsEN from "../../public/locales/en/validations.json";

import adminFR from "../../public/locales/fr/admin.json";
import alertsFR from "../../public/locales/fr/alerts.json";
import authFR from "../../public/locales/fr/auth.json";
import commonFR from "../../public/locales/fr/common.json";
import dashboardFR from "../../public/locales/fr/dashboard.json";
import notificationsFR from "../../public/locales/fr/notifications.json";
import showcaseFR from "../../public/locales/fr/showcase.json";
import validationsFR from "../../public/locales/fr/validations.json";

// This is the list of languages your application supports, the last one is your
// fallback language
export const supportedLngs = ["en", "fr"];

// This is the language you want to use in case
// the user language is not in the supportedLngs
export const fallbackLng = "en";

// The default namespace of i18next is "translation", but you can customize it
export const defaultNS = "common";

export const resources = serverOnly$({
  en: {
    admin: adminEN,
    alerts: alertsEN,
    auth: authEN,
    common: commonEN,
    dashboard: dashboardEN,
    notifications: notificationsEN,
    showcase: showcaseEN,
    validations: validationsEN,
  },
  fr: {
    admin: adminFR,
    alerts: alertsFR,
    auth: authFR,
    common: commonFR,
    dashboard: dashboardFR,
    notifications: notificationsFR,
    showcase: showcaseFR,
    validations: validationsFR,
  },
});

export const resourcesList = [
  "admin",
  "alerts",
  "auth",
  "common",
  "dashboard",
  "notifications",
  "showcase",
  "validations",
];
