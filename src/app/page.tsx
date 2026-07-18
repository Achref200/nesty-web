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

export const metadata: Metadata = {
  title: "Nesty — Rent your next place in Tunisia.",
  description:
    "Nesty is a calm rental platform for Tunisia. Villas by the sea, apartments in the medina, rooms for a semester — every stay verified, every home tourable in 3D, priced by the night or by the month.",
  alternates: { canonical: "/" },
};

/**
 * JSON-LD structured data — kept lean now that the landing is minimalist. No
 * FAQ schema (there is no FAQ section anymore); just Organization, WebSite,
 * SoftwareApplication, MobileApplication and Service.
 */
function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.name,
        url: site.url,
        description: site.description,
        logo: `${site.url}/icon`,
        areaServed: "Tunisia",
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
        name: site.name,
        url: site.url,
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        name: `${site.name} Agency Workspace`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "TND" },
        description: site.description,
      },
      {
        "@type": "MobileApplication",
        name: `${site.name} App`,
        operatingSystem: "Android, iOS",
        applicationCategory: "LifestyleApplication",
        description:
          "Tour homes in 3D, book a visit, or reserve your dates — the Nesty app for renters in Tunisia.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "TND" },
      },
      {
        "@type": "Service",
        name: "Nesty Agency Platform",
        provider: { "@type": "Organization", name: site.name },
        areaServed: "Tunisia",
        serviceType: "Real estate listing operations and booking workflow",
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
