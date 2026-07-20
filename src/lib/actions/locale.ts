"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, isLocale, type Locale } from "@/i18n/config";

/**
 * Persists the visitor's language choice in a year-long cookie. The client
 * toggle calls this, then `router.refresh()` re-renders server components in
 * the new locale. Mirrors how the theme toggle stores its preference.
 */
export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return;
  cookies().set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
