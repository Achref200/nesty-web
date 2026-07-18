import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  Users,
  Search,
  BedDouble,
  Home,
  Building2,
  Palmtree,
  Landmark,
  Waves,
  Warehouse,
  KeyRound,
} from "lucide-react";
import { Parallax } from "./parallax";
import { PROPERTY_CATEGORIES } from "@/data/showcase";
import { agencyAccessMailto } from "@/lib/site";

/**
 * Hero — the room the whole page walks into.
 *
 * Two big real-estate signals up front:
 *
 *   • a Where / Check-in / Check-out / Guests search bar (Airbnb-familiar,
 *     Nesty-dark). It's a visual — the actual booking flow lives in the app —
 *     but it anchors the page as "a place to rent a home".
 *   • a horizontal property-type rail (villas, apartments, rooms, riads…),
 *     so a first-time visitor knows in half a second what Nesty carries.
 *
 * The copy names both audiences and both stay-types (short & long-term).
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate grain overflow-hidden pb-8 pt-20 md:pb-12 md:pt-28"
    >
      {/* fading grid */}
      <div
        aria-hidden="true"
        className="dark-grid pointer-events-none absolute inset-0 -z-10"
      />
      {/* aurora — biggest parallax speed, feels like it lives behind the room */}
      <Parallax
        speed={-0.35}
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 flex justify-center"
      >
        <span
          className="aurora-glow"
          style={{ position: "static", width: 760, height: 760 }}
        />
      </Parallax>

      <div className="mx-auto flex max-w-content flex-col items-center px-5 text-center md:px-8">
        {/* Eyebrow */}
        <Parallax speed={0.05}>
          <span className="inline-flex items-center gap-2 rounded-pill border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium tracking-wide text-white/70 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-pill bg-paper/60 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-pill bg-paper" />
            </span>
            rentals in 9 tunisian cities · short &amp; long-term
          </span>
        </Parallax>

        {/* Headline — human, opinionated, two rhythms */}
        <h1 className="mt-8 font-display text-[2.3rem] font-semibold leading-[1.02] tracking-tight sm:text-[3.4rem] md:text-[5.25rem]">
          <span className="block text-paper">Find your next place</span>
          <span className="block">
            <span className="headline-shimmer">in Tunisia.</span>
          </span>
        </h1>

        {/* Subhead — names both audiences, both stay types */}
        <p className="mx-auto mt-7 max-w-2xl text-[15.5px] leading-relaxed text-white/60 md:text-lg md:leading-relaxed">
          Villas by the sea, apartments in the medina, rooms for a semester
          abroad. Nesty is a calm rental platform for Tunisia — tour every home
          in 3D before you visit, book by the night or sign a full-year lease.
        </p>

        {/* SEARCH BAR — the single strongest real-estate cue */}
        <SearchBar />

        {/* CTAs (secondary — the search bar is the primary action) */}
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <a
            href={agencyAccessMailto}
            className="group inline-flex items-center justify-center gap-2 rounded-pill border border-white/15 bg-transparent px-5 py-3 text-[13.5px] font-semibold text-paper transition-colors hover:bg-white/[0.06]"
          >
            <KeyRound className="h-3.5 w-3.5" strokeWidth={2} />
            List your agency&rsquo;s inventory
          </a>
          <Link
            href="#how"
            className="inline-flex items-center justify-center gap-2 rounded-pill bg-transparent px-4 py-3 text-[13.5px] font-semibold text-white/70 transition-colors hover:text-paper"
          >
            See how it works
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Category rail — Airbnb-style, in Nesty voice */}
      <CategoryRail />

      {/* Floating "live listing" chips — foreground parallax on desktop */}
      <Parallax
        speed={0.55}
        className="pointer-events-none absolute right-4 top-[26%] hidden lg:block lg:right-10"
      >
        <FloatingListingChip
          city="Sidi Bou Saïd"
          title="Blue &amp; White Garden Villa"
          price="6 400 TND"
          per="/month"
          tag="just verified"
        />
      </Parallax>
      <Parallax
        speed={0.4}
        className="pointer-events-none absolute left-4 top-[42%] hidden lg:block lg:left-10"
      >
        <FloatingListingChip
          city="La Marsa · Corniche"
          title="Sea-View Loft"
          price="180 TND"
          per="/night"
          tag="3D tour ready"
          reverse
        />
      </Parallax>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────── *
 *  Search bar — visual only, links to #stays
 * ────────────────────────────────────────────────────────────────── */
function SearchBar() {
  return (
    <div role="search" aria-label="Find a stay in Tunisia" className="mt-10 w-full max-w-3xl">
      {/* Desktop pill — visible ≥md; the mobile stacked card below is
          display:none at this breakpoint and vice-versa, so screen readers
          only ever announce one of these two search widgets. */}
      <div className="hidden items-stretch overflow-hidden rounded-pill border border-white/12 bg-ink/70 p-1.5 text-left shadow-[0_28px_60px_-24px_rgba(0,0,0,0.7)] backdrop-blur-md md:flex">
        <SearchField
          icon={MapPin}
          label="Where"
          value="La Marsa, Tunis"
        />
        <Divider />
        <SearchField
          icon={CalendarDays}
          label="Check-in"
          value="Aug 12"
        />
        <Divider />
        <SearchField
          icon={CalendarDays}
          label="Check-out"
          value="Aug 20"
        />
        <Divider />
        <SearchField
          icon={Users}
          label="Guests"
          value="2 · 1 room"
        />
        <a
          href="#stays"
          aria-label="Explore stays"
          className="ml-2 inline-flex items-center gap-2 rounded-pill bg-paper px-5 text-[13px] font-semibold text-ink transition-transform hover:-translate-y-px"
        >
          <Search className="h-4 w-4" strokeWidth={2.2} />
          Explore
        </a>
      </div>

      {/* Mobile stacked card */}
      <div className="rounded-3xl border border-white/12 bg-ink/70 p-3 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.7)] backdrop-blur-md md:hidden">
        <div className="grid grid-cols-1 divide-y divide-white/[0.08] text-left">
          <MobileField icon={MapPin} label="Where" value="La Marsa, Tunis" />
          <div className="grid grid-cols-2 divide-x divide-white/[0.08]">
            <MobileField icon={CalendarDays} label="Check-in" value="Aug 12" compact />
            <MobileField icon={CalendarDays} label="Check-out" value="Aug 20" compact />
          </div>
          <MobileField icon={Users} label="Guests" value="2 guests · 1 room" />
        </div>
        <a
          href="#stays"
          className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-paper py-3 text-[13.5px] font-semibold text-ink"
        >
          <Search className="h-4 w-4" strokeWidth={2.2} /> Explore stays
        </a>
      </div>

      {/* Micro trust line */}
      <p className="mt-4 text-center text-[11.5px] uppercase tracking-[0.16em] text-white/40">
        1,200+ verified stays · 40+ agencies · no phantom listings
      </p>
    </div>
  );
}

function SearchField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <button
      type="button"
      className="group flex flex-1 items-center gap-3 rounded-pill px-4 py-2.5 text-left transition-colors hover:bg-white/[0.05]"
    >
      <Icon className="h-4 w-4 shrink-0 text-white/50 transition-colors group-hover:text-paper" strokeWidth={1.8} />
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-[13px] font-medium text-paper">
          {value}
        </span>
      </span>
    </button>
  );
}

function MobileField({
  icon: Icon,
  label,
  value,
  compact = false,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        "flex items-center gap-3 px-3 py-3 " + (compact ? "min-w-0" : "")
      }
    >
      <Icon className="h-4 w-4 shrink-0 text-white/50" strokeWidth={1.8} />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
          {label}
        </p>
        <p className="mt-0.5 truncate text-[12.5px] font-medium text-paper">
          {value}
        </p>
      </div>
    </div>
  );
}

function Divider() {
  return <span aria-hidden="true" className="my-2 w-px bg-white/10" />;
}

/* ────────────────────────────────────────────────────────────────── *
 *  Category rail — thin, monochrome, horizontally scrollable
 * ────────────────────────────────────────────────────────────────── */

const CATEGORY_ICONS: Record<string, typeof MapPin> = {
  all: Home,
  villa: Home,
  apartment: Building2,
  room: BedDouble,
  studio: Warehouse,
  beachfront: Waves,
  riad: Landmark,
  long: Palmtree,
};

function CategoryRail() {
  return (
    <div className="relative mt-16 border-y border-white/[0.06] bg-ink/60 backdrop-blur-sm">
      {/* edge fade masks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent"
      />
      <ul className="mx-auto flex max-w-wide gap-8 overflow-x-auto px-6 py-4 md:justify-center md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PROPERTY_CATEGORIES.map((c, i) => {
          const Icon = CATEGORY_ICONS[c.key] ?? Home;
          const active = i === 0;
          return (
            <li key={c.key} className="shrink-0">
              <Link
                href="#stays"
                title={c.hint}
                aria-label={`See ${c.label.toLowerCase()} in Tunisia`}
                className={
                  "group inline-flex flex-col items-center gap-1.5 border-b-2 pb-1 pt-0.5 text-[11.5px] font-medium tracking-wide transition-colors " +
                  (active
                    ? "border-paper text-paper"
                    : "border-transparent text-white/45 hover:text-paper")
                }
              >
                <Icon className="h-4 w-4" strokeWidth={1.7} />
                <span className="whitespace-nowrap">{c.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── *
 *  Floating listing chip — sprinkled around the hero
 * ────────────────────────────────────────────────────────────────── */
function FloatingListingChip({
  city,
  title,
  price,
  per,
  tag,
  reverse = false,
}: {
  city: string;
  title: string;
  price: string;
  per: string;
  tag: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={
        "flex w-[248px] items-center gap-3 rounded-2xl border border-white/12 bg-ink/70 p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md" +
        (reverse ? " flex-row-reverse text-right" : "")
      }
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/[0.04]">
        <MapPin className="h-4 w-4 text-white/70" strokeWidth={1.6} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10.5px] uppercase tracking-[0.12em] text-white/40">
          {tag}
        </p>
        <p
          className="mt-0.5 truncate text-[12.5px] font-semibold text-paper"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="mt-0.5 truncate text-[11px] text-white/55">
          <span>{city}</span>
          <span className="mx-1 text-white/25">·</span>
          <span className="font-semibold text-paper">{price}</span>
          <span className="text-white/45">{per}</span>
        </p>
      </div>
    </div>
  );
}
