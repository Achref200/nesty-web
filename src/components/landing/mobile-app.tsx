import Image from "next/image";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Box,
  Heart,
  Ruler,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDinars } from "@/lib/utils";
import { APP_FEATURES, APP_TABS, FEATURED_LISTINGS } from "@/data/showcase";
import { PhoneMockup } from "./phone-mockup";
import { Reveal } from "./reveal";

const appListing = FEATURED_LISTINGS[1];

/** In-phone app screen — a listing detail, mirroring the real Nesty app. */
function AppScreen() {
  return (
    <div className="flex h-full flex-col bg-paper">
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-3 text-[10px] font-bold text-ink">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-4 rounded-sm border border-ink/60" />
        </span>
      </div>

      {/* Hero image */}
      <div className="relative mx-3 mt-2 overflow-hidden rounded-3xl">
        <div className="relative aspect-[4/5]">
          <Image
            src={appListing.image}
            alt={appListing.title}
            fill
            sizes="260px"
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-ink/10" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
            <span className="grid h-8 w-8 place-items-center rounded-pill bg-paper/90 text-ink">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-pill bg-paper/90 text-ink">
              <Heart className="h-4 w-4" />
            </span>
          </div>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-pill bg-brand px-3.5 py-2 text-xs font-bold text-white shadow-glow">
            <Box className="h-4 w-4" /> Tour in 3D
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 px-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-bold leading-tight text-ink">
            {appListing.title}
          </p>
          <span className="flex items-center gap-0.5 text-[11px] font-bold text-ink">
            <Star className="h-3 w-3 fill-ink" />
            {appListing.rating.toFixed(1)}
          </span>
        </div>
        <p className="text-[11px] text-muted">
          {appListing.area}, {appListing.city}
        </p>
        <div className="mt-2.5 flex items-center gap-3 text-[10px] text-muted">
          <span className="inline-flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" /> {appListing.beds}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" /> {appListing.baths}
          </span>
          <span className="inline-flex items-center gap-1">
            <Ruler className="h-3.5 w-3.5" /> {appListing.sqm} m²
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-fill px-3 py-2.5">
          <div>
            <span className="text-[13px] font-extrabold text-ink">
              {formatDinars(appListing.price)}
            </span>
            <span className="text-[10px] text-muted"> / mo</span>
          </div>
          <span className="rounded-pill bg-brand px-3 py-1.5 text-[10px] font-bold text-white">
            Book a visit
          </span>
        </div>
      </div>

      {/* Bottom tab bar */}
      <div className="mt-3 flex items-center justify-around border-t border-separator bg-card px-2 py-2.5">
        {APP_TABS.map((tab, i) => (
          <span
            key={tab.label}
            className={
              i === 0
                ? "flex flex-col items-center gap-0.5 text-brand"
                : "flex flex-col items-center gap-0.5 text-muted-soft"
            }
          >
            <tab.icon className="h-4 w-4" />
            <span className="text-[8px] font-semibold">{tab.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function MobileApp() {
  return (
    <section id="app" className="relative overflow-hidden py-20">
      <div
        aria-hidden="true"
        className="aura-blob pointer-events-none right-0 top-24 h-80 w-80 opacity-60"
      />
      <div className="mx-auto grid max-w-wide items-center gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Phone */}
        <Reveal variant="left" className="relative order-2 lg:order-1">
          <div className="relative">
            <PhoneMockup className="float-slow">
              <AppScreen />
            </PhoneMockup>

            {/* Floating chips */}
            <div className="float-medium absolute -right-2 top-10 hidden rounded-2xl border border-separator bg-card/95 px-3.5 py-2.5 shadow-float backdrop-blur sm:block">
              <p className="flex items-center gap-1.5 text-xs font-bold text-ink">
                <Box className="h-3.5 w-3.5 text-brand" /> 3D tour ready
              </p>
              <p className="text-[10px] text-muted">Every room, 360°</p>
            </div>
            <div className="float-fast absolute -left-3 bottom-16 hidden rounded-2xl border border-separator bg-card/95 px-3.5 py-2.5 shadow-float backdrop-blur sm:block">
              <p className="flex items-center gap-1.5 text-xs font-bold text-ink">
                <Heart className="h-3.5 w-3.5 fill-brand text-brand" /> Saved to shortlist
              </p>
            </div>
          </div>
        </Reveal>

        {/* Copy + features */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-pill bg-brand-soft px-3 py-1.5 text-[13px] font-bold text-brand-strong shadow-card">
              <span className="h-1.5 w-1.5 rounded-pill bg-brand" />
              The other half of Nesty
            </span>
            <h2 className="mt-5 text-3xl font-bold md:text-[42px]">
              Your listings, alive in a mobile app people love.
            </h2>
            <p className="mt-4 max-w-xl text-[17px] text-muted">
              Everything an agency publishes on the web workspace lands in the
              Nesty app for seekers — where they tour homes in 3D, then book a
              visit or reserve. <span className="font-semibold text-ink">Tour before you visit.</span>
            </p>
          </Reveal>

          <div className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {APP_FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delay={(i % 2) * 70} variant="up">
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-strong">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-ink">{feature.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">
                      {feature.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={80}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <StoreBadge kind="apple" />
              <StoreBadge kind="google" />
              <span className="text-sm text-muted">Consumer app · Coming 2026</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StoreBadge({ kind }: { kind: "apple" | "google" }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-2xl bg-ink px-4 py-2.5 text-paper">
      {kind === "apple" ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
          <path d="M16.365 1.43c0 1.14-.417 2.2-1.11 2.98-.75.84-1.98 1.49-3.02 1.41-.13-1.11.44-2.28 1.09-3 .74-.82 2.03-1.44 3.04-1.39zM20.9 17.1c-.55 1.27-.81 1.83-1.52 2.95-.99 1.56-2.39 3.5-4.12 3.51-1.54.01-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.73-.02-3.06-1.78-4.05-3.34C-1.61 14.5-1.9 8.6.98 5.5c1.05-1.14 2.5-1.86 3.9-1.86 1.6 0 2.6 1 3.92 1 1.28 0 2.06-1 3.9-1 1.4 0 2.88.76 3.93 2.08-3.45 1.89-2.89 6.8.35 8.28z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
          <path d="M3.6 2.3 13 11.7l-2.6 2.6L3 6.9C2.7 6 2.9 3.9 3.6 2.3zm10.9 10.9 2.9 2.9-9.6 5.4c-1.1.6-2.3.3-3-.4l9.7-7.9zm3.9-2.2 2.7 1.5c1.1.6 1.1 2.2 0 2.8l-2.8 1.6-3.2-3.2 3.3-2.7zM4.7 21.6c-.3-.2-.5-.5-.7-.8L13.1 11 4 20.2c.1.5.3 1 .7 1.4z" />
        </svg>
      )}
      <span className="text-left leading-tight">
        <span className="block text-[9px] font-medium opacity-80">
          {kind === "apple" ? "Download on the" : "Get it on"}
        </span>
        <span className="block text-sm font-bold">
          {kind === "apple" ? "App Store" : "Google Play"}
        </span>
      </span>
    </span>
  );
}
