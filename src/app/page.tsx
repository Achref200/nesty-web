import type { Metadata } from "next";
import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Stays } from "@/components/landing/stays";
import { Pillars } from "@/components/landing/pillars";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Product } from "@/components/landing/product";
import { Features } from "@/components/landing/features";
import { Numbers } from "@/components/landing/numbers";
import { Voice } from "@/components/landing/voice";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { site } from "@/lib/site";
import { TESTIMONIALS, DESTINATIONS } from "@/data/showcase";

// Title stays consumer-first to match the visible H1. Description reuses the
// single source in site.ts, so OG/Twitter and the SERP snippet all agree.
export const metadata: Metadata = {
  title: "Nesty — Rent your next place in Tunisia",
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: "Nesty — Rent your next place in Tunisia",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Nesty — Rent your next place in Tunisia",
    description: site.description,
  },
};

/**
 * JSON-LD structured data. Landing is a rental platform now, so the graph
 * leads with RealEstateAgent + a light Product/Offer per Tunisian city
 * (rich-result eligible), plus a Review node per testimonial and an
 * AggregateRating rolled up from PLATFORM_STATS-adjacent proof.
 */
function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "RealEstateAgent"],
        "@id": `${site.url}/#org`,
        name: site.name,
        url: site.url,
        description: site.description,
        logo: `${site.url}/icon`,
        areaServed: { "@type": "Country", name: "Tunisia" },
        contactPoint: {
          "@type": "ContactPoint",
          email: "hello@nesty.tn",
          contactType: "sales",
          areaServed: "TN",
          availableLanguage: ["en", "fr", "ar"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#site`,
        name: site.name,
        url: site.url,
        inLanguage: "en",
      },
      // A light Product/Offer per destination — enough for Google to render
      // "from X TND" snippets without pretending to be a full booking engine.
      ...DESTINATIONS.map((d) => ({
        "@type": "Product",
        name: `Rentals in ${d.city}, Tunisia`,
        description: d.vibe,
        image: d.image,
        brand: { "@id": `${site.url}/#org` },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "TND",
          lowPrice: d.fromNightly,
          highPrice: d.fromMonthly,
          offerCount: d.stays,
          availability: "https://schema.org/InStock",
          areaServed: d.city,
        },
      })),
      // Testimonials become Reviews of the RealEstateAgent.
      ...TESTIMONIALS.map((t) => ({
        "@type": "Review",
        itemReviewed: { "@id": `${site.url}/#org` },
        author: { "@type": "Person", name: t.name },
        reviewBody: t.quote,
        reviewRating: {
          "@type": "Rating",
          ratingValue: 5,
          bestRating: 5,
        },
      })),
      {
        "@type": "SoftwareApplication",
        name: `${site.name} Agency Workspace`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "TND" },
        description:
          "Web workspace where partner agencies list, verify and manage rentals across Tunisia.",
      },
      {
        "@type": "MobileApplication",
        name: `${site.name} App`,
        operatingSystem: "Android, iOS",
        applicationCategory: "LifestyleApplication",
        description:
          "Tour homes in 3D, book a stay by the night or request a monthly lease — the Nesty app for renters in Tunisia.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "TND" },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <StructuredData />
      {/* Dark scope wrapper — paints the whole landing on ink and flips the
          text-selection style. All child components assume this dark canvas. */}
      <div className="dark-scope min-h-screen bg-ink text-paper">
        <Nav />
        <main>
          <Hero />
          <Stays />
          <Pillars />
          <HowItWorks />
          <Product />
          <Features />
          <Numbers />
          <Voice />
          <Cta />
        </main>
        <Footer />
      </div>
    </>
  );
}
