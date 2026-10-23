import type { Metadata } from "next";
import { cookies } from "next/headers";
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
 * JSON-LD describes the Nesty organization and apps. It intentionally avoids
 * property offers because the page has no verified live inventory to publish.
 */
async function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
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
      {
        "@type": "SoftwareApplication",
        name: `${site.name} Agency Workspace`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "Web workspace where agencies manage rental listings and stay or visit requests.",
      },
      {
        "@type": "MobileApplication",
        name: `${site.name} App`,
        operatingSystem: "Android, iOS",
        applicationCategory: "LifestyleApplication",
        description:
          "Browse published rental listings and send a stay or visit request through Nesty.",
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
