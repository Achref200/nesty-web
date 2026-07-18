import Image from "next/image";
import {
  Box,
  MapPin,
  Star,
  ShieldCheck,
  Compass,
  Heart,
  CalendarCheck,
  Search,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "./reveal";
import { Parallax } from "./parallax";
import { Phone } from "./phone";
import { FEATURED_LISTINGS } from "@/data/showcase";

/**
 * Closing showcase — the cinematic finale. One immersive property shot rendered
 * twice: inside a desktop browser frame (the agency/renter web experience) and
 * inside an iPhone frame that overlaps it on large screens and stacks cleanly
 * below on mobile. A soft aurora drifts up behind on parallax, the phone drifts
 * against the scroll for depth. Mobile-first: everything reflows to a single
 * centered column on small screens (most of our visitors are on phones).
 */
export function Showcase() {
  const hero = FEATURED_LISTINGS[0];
  const secondary = FEATURED_LISTINGS[4] ?? FEATURED_LISTINGS[1];

  return (
    <section
      id="showcase"
      className="relative overflow-hidden border-t border-white/[0.06] py-24 md:py-32"
    >
      {/* Aurora glow drifting up behind the devices */}
      <Parallax
        speed={-0.35}
        className="pointer-events-none absolute inset-x-0 -bottom-40 -z-10 flex justify-center"
      >
        <span
          className="aurora-glow"
          style={{ position: "static", width: 760, height: 760 }}
        />
      </Parallax>

      <div className="mx-auto max-w-wide px-5 md:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
            one platform · every screen
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-5xl">
            The same beautiful home,
            <br />
            <span className="text-white/50">on the web and in your pocket.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/55">
            Agencies publish once. Renters explore everywhere — a full-screen 3D
            tour on desktop, the exact same stay a thumb-swipe away on mobile.
          </p>
        </Reveal>

        {/* Device stage — kept dark in both themes so the mockups read as
            product screenshots regardless of the page background. */}
        <div className="keep-dark relative mx-auto mt-14 max-w-5xl lg:mt-20 lg:pb-16 lg:pr-20">
          {/* Desktop browser frame */}
          <Reveal variant="scale">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-ink shadow-[0_60px_120px_-50px_rgba(0,0,0,0.9)] md:rounded-3xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-pill bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-pill bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-pill bg-white/15" />
                <div className="ml-3 hidden min-w-0 flex-1 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] sm:flex">
                  <ShieldCheck className="h-3 w-3 shrink-0 text-white/50" strokeWidth={2} />
                  <span className="truncate text-white/40">
                    nesty.tn<span className="text-white/70">/stays/corniche-sea-view-loft</span>
                  </span>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 rounded-pill border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  <Box className="h-2.5 w-2.5" strokeWidth={2} /> 3D tour
                </span>
              </div>

              {/* Immersive hero */}
              <div className="relative aspect-[16/10] w-full bg-white/[0.05] sm:aspect-[16/9]">
                <Image
                  src={hero.image}
                  alt={`${hero.title} in ${hero.city} — full-screen 3D tour on Nesty web`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  priority={false}
                  unoptimized
                />
                {/* Legibility gradient */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25"
                />

                {/* Top badges */}
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-pill bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-paper backdrop-blur-sm">
                    <Box className="h-3 w-3" strokeWidth={2} /> Immersive 3D tour
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-pill bg-paper/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-ink backdrop-blur-sm">
                    verified
                  </span>
                </div>

                {/* Orbit hint */}
                <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 place-items-center sm:grid">
                  <span className="grid h-14 w-14 place-items-center rounded-pill border border-white/40 bg-black/30 text-paper backdrop-blur-sm">
                    <Compass className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                </div>

                {/* Floating glass info card */}
                <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0 rounded-2xl border border-white/15 bg-black/35 p-3 backdrop-blur-md sm:p-4">
                    <p className="truncate font-display text-base font-semibold text-paper md:text-lg">
                      {hero.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[12px] text-paper/80">
                      <MapPin className="h-3 w-3" strokeWidth={1.8} />
                      {hero.city} · {hero.area}
                      <span className="text-paper/40">·</span>
                      <Star className="h-3 w-3 fill-current" />
                      {hero.rating}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-pill bg-black/40 px-3 py-2 text-[13px] font-bold text-paper backdrop-blur-sm">
                      180 TND
                      <span className="ml-0.5 text-[10px] font-medium text-paper/60">/night</span>
                    </span>
                    <button className="inline-flex items-center gap-1.5 rounded-pill bg-paper px-4 py-2 text-[13px] font-semibold text-ink">
                      Book stay
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* iPhone frame — overlaps on large screens, stacks below on mobile */}
          <div className="mt-8 flex justify-center lg:absolute lg:-bottom-4 lg:right-0 lg:mt-0 lg:block">
            <Parallax speed={0.18}>
              <Reveal delay={140} variant="up">
                <Phone className="w-[220px] sm:w-[240px] lg:w-[248px]">
                  {/* Full-bleed listing */}
                  <div className="relative h-full w-full">
                    <Image
                      src={secondary.image}
                      alt={`${secondary.title} in ${secondary.city} — the same stay on the Nesty mobile app`}
                      fill
                      sizes="248px"
                      className="object-cover"
                      unoptimized
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"
                    />

                    {/* Status bar */}
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-2.5 text-[10px] font-semibold text-paper/85">
                      <span>9:41</span>
                      <span className="inline-block h-2 w-3 rounded-[1px] border border-paper/60" />
                    </div>

                    {/* 3D badge */}
                    <span className="absolute left-3 top-8 inline-flex items-center gap-1 rounded-pill bg-black/50 px-2 py-0.5 text-[9px] font-semibold text-paper backdrop-blur-sm">
                      <Box className="h-2.5 w-2.5" strokeWidth={2} /> 3D tour
                    </span>
                    <span className="absolute right-3 top-8 grid h-6 w-6 place-items-center rounded-pill bg-black/50 text-paper backdrop-blur-sm">
                      <Heart className="h-3 w-3" strokeWidth={2} />
                    </span>

                    {/* Bottom detail sheet */}
                    <div className="absolute inset-x-0 bottom-0 px-3 pb-14 pt-4">
                      <p className="truncate text-[13px] font-semibold text-paper drop-shadow">
                        {secondary.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-[10.5px] text-paper/80">
                        <MapPin className="h-2.5 w-2.5" strokeWidth={1.8} />
                        {secondary.city} · {secondary.area}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="rounded-pill bg-paper px-2 py-1 text-[11px] font-bold text-ink">
                          140 TND
                          <span className="ml-0.5 text-[8.5px] font-medium text-ink/60">/night</span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-pill bg-black/45 px-2.5 py-1 text-[10px] font-semibold text-paper backdrop-blur-sm">
                          <Star className="h-2.5 w-2.5 fill-current" /> {secondary.rating}
                        </span>
                      </div>
                    </div>

                    {/* Tab bar */}
                    <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.08] bg-ink/95 px-5 py-2.5 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        {[Compass, Heart, CalendarCheck, Search].map((I, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <I
                              className={`h-4 w-4 ${i === 0 ? "text-paper" : "text-white/35"}`}
                              strokeWidth={1.8}
                            />
                            <span
                              className={
                                "h-1 w-1 rounded-pill " +
                                (i === 0 ? "bg-paper" : "bg-transparent")
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Phone>
              </Reveal>
            </Parallax>
          </div>
        </div>

        {/* Caption */}
        <Reveal delay={120} className="mx-auto mt-14 max-w-md text-center lg:mt-24">
          <p className="text-[13px] font-medium text-white/60">
            <span className="text-paper">Published once</span> · rendered
            beautifully on every device your renters actually use.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
