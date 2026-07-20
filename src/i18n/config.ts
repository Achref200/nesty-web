/**
 * Locale config shared by server (request.ts, the set-locale action) and client
 * (the language toggle). Kept free of `next/headers` so it's safe to import from
 * client components. English is the default; French is a first-class option
 * because French matters for Tunisian brands.
 */
export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Cookie that carries the chosen locale (mirrors the theme-toggle pattern). */
export const LOCALE_COOKIE = "nesty-locale";

/** Short labels for the toggle button. */
export const LOCALE_LABELS: Record<Locale, string> = { en: "EN", fr: "FR" };

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "fr";
}
