/**
 * Single source of truth for site-wide SEO metadata. Keep the canonical URL in
 * one place so sitemap, robots, OpenGraph and JSON-LD all stay consistent.
 */
export const site = {
  name: "Nesty",
  title: "Nesty — B2B Property Experience Platform",
  description:
    "Nesty helps real-estate teams publish premium listings, manage requests and reservations, and launch a conversion-focused property experience across web and mobile.",
  url: "https://nesty.tn",
  locale: "en_TN",
  tagline: "Real estate operations, finally in one calm place.",
  keywords: [
    "Nesty",
    "PropTech Tunisia",
    "real estate CRM Tunisia",
    "agency listing management",
    "B2B real estate software",
    "real estate operating system",
    "location Tunisie",
    "real estate Tunisia",
    "3D property tour",
    "property booking workflow",
    "agency dashboard",
    "immobilier Tunisie",
    "listing management software",
    "real estate agency platform",
  ],
  nav: [
    { href: "/#stays", label: "Stays" },
    { href: "/#how", label: "How it works" },
    { href: "/#product", label: "Product" },
    { href: "/#features", label: "Features" },
  ],
} as const;

export type SiteConfig = typeof site;
