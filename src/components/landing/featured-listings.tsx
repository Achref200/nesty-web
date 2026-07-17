import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FEATURED_LISTINGS } from "@/data/showcase";
import { PropertyCard } from "./property-card";
import { Reveal } from "./reveal";

const FILTERS = ["All", "Short term", "Long term", "Villas", "Offices", "Sea view"];
const CITIES = ["Tunis", "La Marsa", "Gammarth"];

const ROW_ONE = FEATURED_LISTINGS.slice(0, 5);
const ROW_TWO = FEATURED_LISTINGS.slice(5);

function Row({
  items,
  reverse = false,
}: {
  items: typeof FEATURED_LISTINGS;
  reverse?: boolean;
}) {
  const track = [...items, ...items];
  return (
    <div className="marquee-mask rail-pause overflow-hidden">
      <div className={reverse ? "rail-track-rev gap-5 pr-5" : "rail-track gap-5 pr-5"}>
        {track.map((listing, i) => (
          <div key={`${listing.id}-${i}`} className="w-[300px] shrink-0 sm:w-[330px]">
            <PropertyCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The showcase centerpiece — a browsable "live inventory" that drifts on its own
 * so the section feels alive without stacking a tall grid. Hover to pause.
 */
export function FeaturedListings() {
  return (
    <section id="listings" className="relative overflow-hidden py-20">
      <div className="mx-auto mb-8 max-w-wide px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-brand">
                Live inventory
              </span>
              <h2 className="mt-3 max-w-xl text-3xl font-bold md:text-[42px]">
                Real homes, published by real agencies.
              </h2>
              <p className="mt-3 max-w-xl text-[17px] text-muted">
                A living preview of what your team publishes on Nesty — verified,
                media-rich, and ready to tour.
              </p>
            </div>
            <Button asChild variant="outline" className="hidden shrink-0 sm:inline-flex">
              <a href="mailto:hello@nesty.tn?subject=Nesty%20Agency%20Access">
                Publish your inventory <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </Reveal>

        {/* Presentation-only search + filter bar. */}
        <Reveal delay={80}>
          <div className="mt-8 rounded-3xl border border-separator bg-card p-3 shadow-card">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex flex-1 items-center gap-2.5 rounded-2xl bg-fill px-4 py-3">
                <Search className="h-4 w-4 text-muted" />
                <span className="text-sm text-muted">
                  Search by city, neighborhood, or agency…
                </span>
              </div>
              <div className="flex items-center gap-2">
                {CITIES.map((city) => (
                  <span
                    key={city}
                    className="hidden rounded-pill bg-fill px-3 py-2 text-xs font-semibold text-ink-soft lg:inline-flex"
                  >
                    {city}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1.5 rounded-2xl bg-ink px-4 py-3 text-sm font-bold text-paper">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 px-1">
              {FILTERS.map((f, i) => (
                <span
                  key={f}
                  className={
                    i === 0
                      ? "rounded-pill bg-brand px-3.5 py-1.5 text-xs font-bold text-white"
                      : "rounded-pill border border-separator px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand-strong"
                  }
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Auto-scrolling rows */}
      <div className="space-y-5">
        <Row items={ROW_ONE} />
        <Row items={ROW_TWO} reverse />
      </div>
    </section>
  );
}
