import type { Metadata } from "next";
import { SiteNav } from "@/components/landing/site-nav";
import { SideRail } from "@/components/landing/side-rail";
import { ScrollProgress } from "@/components/landing/scroll-progress";
import { Hero } from "@/components/landing/hero";
import { TrustMarquee } from "@/components/landing/trust-marquee";
import { FeaturedListings } from "@/components/landing/featured-listings";
import { MobileApp } from "@/components/landing/mobile-app";
import { Ecosystem } from "@/components/landing/ecosystem";
import { Manifesto } from "@/components/landing/manifesto";
import { StatsBand } from "@/components/landing/stats-band";
import { Testimonials } from "@/components/landing/testimonials";
import { Steps, Features, Faq, FAQS, Contact } from "@/components/landing/sections";
import { SiteFooter } from "@/components/landing/site-footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nesty for Agencies | Real Estate Operations and Growth",
  description:
    "Nesty is a B2B property operations platform for agencies to publish verified inventory, manage bookings, and launch high-conversion real-estate experiences — paired with a consumer app for 3D tours and reservations.",
  alternates: { canonical: "/" },
};

/** JSON-LD structured data helps Google understand the product & organisation. */
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
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
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
      <ScrollProgress />
      <SideRail />
      <div className="md:pl-[72px]">
        <SiteNav />
        <main>
          <Hero />
          <TrustMarquee />
          <FeaturedListings />
          <MobileApp />
          <Ecosystem />
          <Features />
          <Steps />
          <Manifesto />
          <StatsBand />
          <Testimonials />
          <Faq />
          <Contact />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
