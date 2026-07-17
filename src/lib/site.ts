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
  tagline: "Turn listings into signed opportunities.",
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
    { href: "/#listings", label: "Listings" },
    { href: "/#app", label: "Mobile app" },
    { href: "/#platform", label: "Platform" },
    { href: "/#why", label: "Why Nesty" },
    { href: "/#stories", label: "Stories" },
    { href: "/#faq", label: "FAQ" },
  ],
} as const;

export type SiteConfig = typeof site;
