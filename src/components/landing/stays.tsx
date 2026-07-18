import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, MapPin } from "lucide-react";
import { Reveal } from "./reveal";
import { Parallax } from "./parallax";
import { DESTINATIONS } from "@/data/showcase";

/**
 * "Where you can stay in Tunisia" — the real-estate proof section. Six
 * destination cards, actual property photos, each with the neighborhood, a
 * stay count, and a from-price shown two ways (per night, per month) so the
 * visitor immediately sees Nesty covers both short and long-term rentals.
 *
 * Layout is a plain 3×2 grid on desktop, 2 columns on tablet, one column
 * stacked on mobile. Card presentation is intentionally simple: image, dark
 * gradient scrim, and typography — no heavy chrome, per the mono design system.
 */
export function Stays() {
  return (
    <section
      id="stays"
      className="relative border-t border-white/[0.06] py-24 md:py-32"
    >
      <Parallax
        speed={-0.15}
        className="pointer-events-none absolute inset-x-0 top-16 -z-10 flex justify-start"
      >
        <span
          className="aurora-glow opacity-55"
          style={{ position: "static", width: 560, height: 560 }}
        />
      </Parallax>

      <div className="mx-auto max-w-wide px-5 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal className="max-w-2xl">
            <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
              where you can stay
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-5xl">
              Six cities.
              <br />
              <span className="text-white/50">
                A thousand doors to knock on.
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/55">
              From a corniche loft in La Marsa to a whitewashed room on Djerba
              — every stay is verified by our team, priced by the night or
              by the month, and ready to tour in 3D before you commit.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <Link
              href="#product"
              className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-transparent px-4 py-2.5 text-[13px] font-semibold text-paper transition-colors hover:bg-white/[0.06]"
            >
              Browse all stays
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-14 md:grid-cols-3 md:gap-5">
          {DESTINATIONS.map((d, i) => (
            <Reveal key={d.city} delay={i * 60}>
              <DestinationCard d={d} />
            </Reveal>
          ))}
        </div>

        {/* Small vibe strip under the grid — pushes rental language further */}
        <Reveal delay={200}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-white/45">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-pill bg-paper/70" />
              per night from 95 TND
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-pill bg-paper/70" />
              per month from 1 200 TND
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-pill bg-paper/70" />
              3-month leases, semester rentals, full-year contracts
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DestinationCard({
  d,
}: {
  d: (typeof DESTINATIONS)[number];
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] transition-colors hover:border-white/20">
      {/* Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/[0.04]">
        <Image
          src={d.image}
          alt={`${d.city}, Tunisia`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          unoptimized
        />
        {/* dark scrim for legibility */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent"
        />

        {/* Top chips */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          <span className="inline-flex items-center gap-1 rounded-pill border border-white/15 bg-ink/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-paper backdrop-blur-sm">
            <MapPin className="h-2.5 w-2.5" strokeWidth={2} />
            {d.region}
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-pill border border-white/15 bg-ink/60 text-paper backdrop-blur-sm transition-colors group-hover:bg-paper group-hover:text-ink">
            <Heart className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        </div>

        {/* Bottom copy */}
        <div className="absolute inset-x-4 bottom-4">
          <p className="font-display text-[26px] font-semibold leading-tight text-paper drop-shadow-sm md:text-[30px]">
            {d.city}
          </p>
          <p className="mt-1 max-w-[85%] text-[12.5px] leading-snug text-paper/70">
            {d.vibe}
          </p>

          {/* Price + stays row */}
          <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/15 pt-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-paper/50">
                from
              </p>
              <p className="mt-0.5 text-[13.5px] font-semibold text-paper">
                {d.fromNightly} TND
                <span className="text-paper/50"> / night</span>
              </p>
              <p className="text-[11.5px] text-paper/55">
                or {d.fromMonthly.toLocaleString("fr-FR")} TND
                <span className="text-paper/40"> / month</span>
              </p>
            </div>
            <span className="rounded-pill border border-white/15 bg-ink/50 px-2.5 py-1 text-[10.5px] font-semibold text-paper backdrop-blur-sm">
              {d.stays} stays
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
