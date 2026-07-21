import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { SpaceProvider } from "@/components/landing/space-context";
import { SpaceTabs } from "@/components/landing/space-tabs";
import { SpaceSwitch } from "@/components/landing/space-switch";
import { SeekerSpace } from "@/components/landing/seeker/seeker-space";
import { HostSpace } from "@/components/landing/host/host-space";
import { AssistantWidget } from "@/components/assistant/assistant-widget";
import { site } from "@/lib/site";
import { assistantConfig } from "@/lib/assistant/config";
import { getPublicListings, getListingFacets } from "@/lib/queries";
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
async function StructuredData() {
  const tFaq = await getTranslations("faq");
  const faqItems = tFaq.raw("items") as { q: string; a: string }[];
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
          email: site.email,
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
      // FAQPage — the strongest AEO surface. Built from the same catalog the
      // visible accordion renders, so answers Google/AI engines extract always
      // match what a human reads on the page (and localize with it).
      {
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
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

export default async function HomePage() {
  const [listings, facets] = await Promise.all([
    getPublicListings({ pageSize: 12 }),
    getListingFacets(),
  ]);
  const initialSpace =
    cookies().get("nesty-space")?.value === "seeker" ? "seeker" : "agency";
  return (
    <>
      <StructuredData />
      {/* Dark scope wrapper — paints the whole landing on ink and flips the
          text-selection style. `landing-theme` enables the light/dark tokens;
          child components read the flipped colour tokens automatically. */}
      <div
        id="nesty-landing"
        suppressHydrationWarning
        className="landing-theme dark-scope min-h-screen bg-ink text-paper"
      >
        {/* Apply the saved theme before paint to avoid a flash of the wrong mode. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(localStorage.getItem('nesty-landing-theme')==='light'){document.getElementById('nesty-landing').classList.add('theme-light');}}catch(e){}})();",
          }}
        />
        <SpaceProvider initial={initialSpace}>
          <LandingHeader />
          <SpaceTabs />
          <SpaceSwitch
            agency={<HostSpace />}
            seeker={<SeekerSpace initial={listings} facets={facets} />}
          />
          <Footer />
        </SpaceProvider>
        {assistantConfig.enabled && <AssistantWidget surface="landing" />}
      </div>
    </>
  );
}
