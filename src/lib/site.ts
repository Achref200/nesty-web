/**
 * Single source of truth for site-wide SEO metadata. Keep the canonical URL in
 * one place so sitemap, robots, OpenGraph and JSON-LD all stay consistent.
 */
/**
 * Deploy URL — used for canonical, OpenGraph and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in production to the real domain (e.g. https://nesty.tn).
 * Vercel preview builds fall back to their auto-generated URL so canonical never
 * points at a domain that isn't actually serving the page.
 */
const inferredUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "https://nesty.tn";

export const site = {
  name: "Nesty",
  // ~57 chars — fits SERP title (~60 char cutoff), leads with the visible copy.
  title: "Nesty — Rent your next place in Tunisia",
  // ~154 chars — fits SERP description cutoff (~155–160). Consumer-first;
  // still mentions verified agencies so B2B keywords stay on the page.
  description:
    "Rent villas, apartments and rooms across Tunisia. Every stay verified by partner agencies, tourable in 3D, priced by the night or the month.",
  url: inferredUrl,
  locale: "en_TN",
  tagline: "Every stay verified. Every home tourable in 3D.",
  keywords: [
    "Nesty",
    "rent in Tunisia",
    "location Tunisie",
    "villas Tunisia",
    "apartments Tunis",
    "short term rental Tunisia",
    "long term rental Tunisia",
    "3D property tour",
    "verified rentals Tunisia",
    "Sidi Bou Said rental",
    "La Marsa rental",
    "Djerba rental",
    "PropTech Tunisia",
    "agency listing platform",
  ],
  nav: [
    { href: "/#stays", label: "Stays" },
    { href: "/#how", label: "How it works" },
    { href: "/#product", label: "Product" },
    { href: "/#features", label: "Features" },
  ],
} as const;

export type SiteConfig = typeof site;
