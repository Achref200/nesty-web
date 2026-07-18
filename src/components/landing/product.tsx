import Image from "next/image";
import {
  Building2,
  CalendarCheck,
  Compass,
  Heart,
  Search,
  Star,
  Bell,
  Plus,
  MapPin,
  ArrowUpRight,
  Box,
  ChevronRight,
  Users,
  Inbox,
} from "lucide-react";
import { Reveal } from "./reveal";
import { Parallax } from "./parallax";
import { Phone } from "./phone";
import { FEATURED_LISTINGS } from "@/data/showcase";

/**
 * Product section — the tour. Two set-pieces:
 *
 *   1. A dense, believable agency workspace: browser chrome + sidebar + top
 *      bar with search & team avatars + main inventory table + a "today"
 *      column with request queue and a mini month calendar.
 *   2. A single phone that shows a real feed — status bar, greeting, search,
 *      category chips, a big hero listing with 3D badge, a smaller pair
 *      below, then a tab bar with an active pill.
 *
 * Both sit in a shared dark frame. Parallax on the phone (drifts up faster
 * than the workspace) creates depth without being loud.
 */

export function Product() {
  const listings = FEATURED_LISTINGS.slice(0, 5);
  return (
    <section
      id="product"
      className="relative border-t border-white/[0.06] py-24 md:py-32"
    >
      <div className="mx-auto max-w-wide px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
            the product
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-5xl">
            The workspace your agents open first,
            <br />
            <span className="text-white/50">
              and the app your renters keep on the home screen.
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/55">
            One dashboard for every rental you manage. One app for every home
            a renter falls for. A single calendar that keeps nightly stays,
            monthly rentals and yearly leases in perfect sync.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-[1.5fr_1fr] md:gap-8 md:items-start">
          {/* Web workspace preview */}
          <Reveal>
            <WorkspacePreview listings={listings} />
          </Reveal>

          {/* Phone with light parallax so it drifts up faster */}
          <Reveal delay={120}>
            <Parallax speed={0.15}>
              <AppPreview listings={listings.slice(0, 4)} />
            </Parallax>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────── *
 *  Web workspace — the dashboard-in-a-frame
 * ─────────────────────────────────────────────────────────────────── */

function WorkspacePreview({
  listings,
}: {
  listings: typeof FEATURED_LISTINGS;
}) {
  const rows = listings.slice(0, 4);
  return (
    <div
      id="agencies"
      className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-4 md:p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-pill bg-paper/10 opacity-40 blur-3xl"
      />

      {/* Browser chrome */}
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-pill bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-pill bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-pill bg-white/15" />
        <div className="ml-3 hidden items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/50 sm:flex">
          <span className="h-1.5 w-1.5 rounded-pill bg-white/50" />
          <span className="text-white/30">nesty.tn</span>
          <span className="text-white/70">/dashboard/listings</span>
        </div>
        <span className="ml-auto rounded-pill border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
          agency workspace
        </span>
      </div>

      {/* Dashboard shell */}
      <div className="mt-4 grid gap-3 md:grid-cols-[168px_1fr]">
        {/* Sidebar */}
        <aside className="hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 md:block">
          <p className="px-2 pt-1 text-[10px] uppercase tracking-[0.16em] text-white/30">
            Atlas Realty
          </p>
          <nav className="mt-3 space-y-1">
            <NavRow icon={Building2} label="Listings" active count={24} />
            <NavRow icon={CalendarCheck} label="Calendar" />
            <NavRow icon={Inbox} label="Requests" count={7} />
            <NavRow icon={Users} label="Team" />
          </nav>
          <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">
              this week
            </p>
            <p className="mt-1.5 font-display text-lg font-semibold text-paper">
              +18%
            </p>
            <p className="mt-0.5 text-[11px] leading-tight text-white/45">
              visits vs last week
            </p>
          </div>
        </aside>

        {/* Main */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          {/* Top bar */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
            <div className="flex flex-1 items-center gap-2 rounded-pill border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/45">
              <Search className="h-3 w-3" strokeWidth={2} />
              Search a listing, address or agent…
            </div>
            <Bell className="hidden h-4 w-4 text-white/55 sm:block" strokeWidth={1.8} />
            <div className="hidden -space-x-2 sm:flex">
              {["AR", "SK", "YR"].map((i, k) => (
                <span
                  key={i}
                  className={
                    "grid h-7 w-7 place-items-center rounded-pill border-2 border-ink text-[10px] font-bold text-paper " +
                    (k === 0
                      ? "bg-white/25"
                      : k === 1
                        ? "bg-white/15"
                        : "bg-white/10")
                  }
                >
                  {i}
                </span>
              ))}
            </div>
            <button className="ml-1 inline-flex items-center gap-1 rounded-pill bg-paper px-3 py-1.5 text-[11px] font-semibold text-ink">
              <Plus className="h-3 w-3" strokeWidth={2.4} /> New listing
            </button>
          </div>

          {/* Header row */}
          <div className="flex items-end justify-between px-4 pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                rental inventory
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-paper">
                24 rentals · 3 drafts
              </p>
            </div>
            <div className="hidden items-center gap-1 text-[11px] text-white/40 sm:flex">
              <span className="rounded-pill border border-white/12 bg-paper/10 px-2 py-0.5 text-paper">
                All
              </span>
              <span className="rounded-pill border border-white/10 px-2 py-0.5">
                Per night
              </span>
              <span className="rounded-pill border border-white/10 px-2 py-0.5">
                Per month
              </span>
            </div>
          </div>

          {/* Listing table */}
          <div className="mt-3 px-4 pb-4">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-white/[0.06] pb-2 text-[10px] uppercase tracking-[0.14em] text-white/35">
              <span>Rental</span>
              <span className="hidden sm:inline">Rate</span>
              <span>Status</span>
            </div>
            <ul className="mt-1 divide-y divide-white/[0.04]">
              {rows.map((l) => {
                const isShort = l.term === "shortTerm";
                const rate = isShort
                  ? Math.max(60, Math.round(l.price / 22))
                  : l.price;
                const per = isShort ? "night" : "mo";
                return (
                  <li
                    key={l.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-white/[0.05]">
                        <Image
                          src={l.image}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover opacity-90"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-semibold text-paper">
                          {l.title}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-white/40">
                          <span>{l.city}</span>
                          {l.beds > 0 && (
                            <>
                              <span className="text-white/20">·</span>
                              <span>{l.beds} bd</span>
                            </>
                          )}
                          <span className="text-white/20">·</span>
                          <span>{l.sqm} m²</span>
                          <span className="text-white/20">·</span>
                          <span className="uppercase tracking-wide text-white/55">
                            {isShort ? "short" : "long"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="hidden text-right font-display text-[12px] font-semibold text-paper sm:block">
                      {rate.toLocaleString("fr-FR")}
                      <span className="ml-0.5 text-[9.5px] font-medium text-white/40">
                        TND/{per}
                      </span>
                    </div>
                    <span
                      className={
                        "rounded-pill border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] " +
                        (l.state === "available"
                          ? "border-white/12 bg-white/[0.05] text-paper"
                          : "border-white/8 bg-white/[0.02] text-white/45")
                      }
                    >
                      {l.state === "available" ? "Live" : "Booked"}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Bottom split — requests preview + mini month calendar */}
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_150px]">
              {/* Requests preview */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                    today&rsquo;s stay requests
                  </p>
                  <ChevronRight className="h-3 w-3 text-white/40" />
                </div>
                <ul className="mt-2 space-y-2">
                  {[
                    { n: "Amine", d: "visit today · 15:30", l: "Corniche Loft" },
                    { n: "Yasmine", d: "check-in Aug 12 · 8 nights", l: "Sidi Bou Villa" },
                    { n: "Karim", d: "6-month lease", l: "Gammarth Pool House" },
                  ].map((r) => (
                    <li
                      key={r.n}
                      className="flex items-center justify-between text-[11.5px]"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-paper">
                          {r.n}
                          <span className="ml-1.5 text-white/40">{r.d}</span>
                        </p>
                        <p className="truncate text-white/40">{r.l}</p>
                      </div>
                      <button className="rounded-pill bg-paper px-2 py-0.5 text-[10px] font-semibold text-ink">
                        Confirm
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Mini calendar */}
              <MiniCalendar />
            </div>
          </div>
        </div>
      </div>

      {/* Footer caption */}
      <div className="mt-5 flex items-center gap-2 text-[13px] font-medium text-white/60">
        <ArrowUpRight className="h-3.5 w-3.5 text-paper" strokeWidth={2} />
        <span className="text-paper">Agency workspace</span>
        <span className="text-white/35">·</span>
        <span>every rental, request and stay on one calm board.</span>
      </div>
    </div>
  );
}

function NavRow({
  icon: Icon,
  label,
  active,
  count,
}: {
  icon: typeof Building2;
  label: string;
  active?: boolean;
  count?: number;
}) {
  return (
    <div
      className={
        "flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-semibold " +
        (active ? "bg-paper text-ink" : "text-white/50 hover:text-paper")
      }
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
      <span className="flex-1">{label}</span>
      {typeof count === "number" && (
        <span
          className={
            "rounded-pill px-1.5 text-[10px] font-bold " +
            (active
              ? "bg-ink/10 text-ink"
              : "bg-white/[0.06] text-white/60")
          }
        >
          {count}
        </span>
      )}
    </div>
  );
}

function MiniCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const booked = new Set([4, 5, 6, 12, 17, 22, 23]);
  const today = 18;
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
          this month
        </p>
        <span className="text-[10px] font-semibold text-white/50">Jul</span>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-[3px]">
        {days.map((d) => {
          const isBooked = booked.has(d);
          const isToday = d === today;
          return (
            <span
              key={d}
              className={
                "grid h-4 w-full place-items-center rounded-[3px] text-[9px] " +
                (isToday
                  ? "bg-paper font-bold text-ink"
                  : isBooked
                    ? "bg-white/25 text-ink"
                    : "bg-white/[0.05] text-white/40")
              }
            >
              {d}
            </span>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-white/40">
        <span className="h-2 w-2 rounded-sm bg-white/25" /> booked
      </div>
    </div>
  );
}



/* ─────────────────────────────────────────────────────────────────── *
 *  Mobile app — the phone that feels real
 * ─────────────────────────────────────────────────────────────────── */

function AppPreview({
  listings,
}: {
  listings: typeof FEATURED_LISTINGS;
}) {
  const [hero, ...rest] = listings;
  return (
    <div
      id="app"
      className="relative flex flex-col items-center overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] px-4 py-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-pill bg-paper/10 opacity-40 blur-3xl"
      />

      <Phone>
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-2.5 text-[10px] font-semibold text-paper/85">
          <span>9:41</span>
          <div className="flex items-center gap-1 text-paper/70">
            <span className="text-[9px]">4G</span>
            <span className="inline-block h-2 w-3 rounded-[1px] border border-paper/60" />
          </div>
        </div>

        {/* Greeting */}
        <div className="mt-4 flex items-center justify-between px-4">
          <div>
            <p className="text-[10px] text-white/45">good afternoon</p>
            <p className="mt-0.5 text-[13px] font-semibold text-paper">
              Amine · La Marsa
            </p>
          </div>
          <span className="grid h-8 w-8 place-items-center rounded-pill border border-white/12 bg-white/[0.05] text-[11px] font-bold text-paper">
            A
          </span>
        </div>

        {/* Search pill */}
        <div className="mx-4 mt-4 flex items-center gap-2 rounded-pill border border-white/10 bg-white/[0.05] px-3 py-2">
          <Search className="h-3.5 w-3.5 text-white/50" strokeWidth={1.8} />
          <span className="text-[11px] text-white/50">
            Search neighborhood…
          </span>
          <span className="ml-auto grid h-5 w-5 place-items-center rounded-md bg-paper text-[9px] font-bold text-ink">
            ⌕
          </span>
        </div>

        {/* Category chips */}
        <div className="mt-3 flex gap-1.5 overflow-hidden px-4">
          {[
            { l: "For you", a: true },
            { l: "3D tour", a: false },
            { l: "Sea view", a: false },
            { l: "New", a: false },
          ].map((t) => (
            <span
              key={t.l}
              className={
                t.a
                  ? "rounded-pill bg-paper px-2.5 py-1 text-[10px] font-semibold text-ink"
                  : "rounded-pill border border-white/10 px-2.5 py-1 text-[10px] font-medium text-white/55"
              }
            >
              {t.l}
            </span>
          ))}
        </div>

        {/* Hero listing card */}
        {hero && (
          <div className="mx-4 mt-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03]">
            <div className="relative aspect-[16/11] w-full bg-white/[0.05]">
              <Image
                src={hero.image}
                alt=""
                fill
                sizes="240px"
                className="object-cover"
                unoptimized
              />
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-pill bg-black/45 px-2 py-0.5 text-[9px] font-semibold text-paper backdrop-blur-sm">
                <Box className="h-2.5 w-2.5" strokeWidth={2} /> 3D tour
              </span>
              <span className="absolute left-[68px] top-2 inline-flex items-center gap-1 rounded-pill bg-paper/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-ink backdrop-blur-sm">
                verified
              </span>
              <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-pill bg-black/45 text-paper backdrop-blur-sm">
                <Heart className="h-3 w-3" strokeWidth={2} />
              </span>
              <div className="absolute inset-x-2 bottom-2 flex items-end justify-between">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-paper drop-shadow">
                    {hero.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-paper/80">
                    <MapPin className="h-2.5 w-2.5" strokeWidth={1.8} />
                    {hero.city} · {hero.area}
                  </p>
                </div>
                <span className="rounded-pill bg-paper px-1.5 py-0.5 text-[10px] font-bold text-ink">
                  180 TND
                  <span className="ml-0.5 text-[8px] font-medium text-ink/60">/night</span>
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="inline-flex items-center gap-1 truncate text-[10px] text-white/60">
                <Star className="h-2.5 w-2.5 fill-current" />
                {hero.rating}
                <span className="text-white/30">
                  {" "}
                  · {hero.beds} bd
                </span>
                <span className="text-white/30">· {hero.baths} ba</span>
                <span className="text-white/30">· {hero.sqm} m²</span>
              </span>
              <button className="shrink-0 rounded-pill bg-paper px-2 py-0.5 text-[9px] font-semibold text-ink">
                Book stay
              </button>
            </div>
          </div>
        )}

        {/* Smaller pair */}
        <div className="mx-4 mt-2.5 grid grid-cols-2 gap-2">
          {rest.slice(0, 2).map((l, i) => (
            <div
              key={l.id}
              className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03]"
            >
              <div className="relative aspect-[4/3] w-full bg-white/[0.05]">
                <Image
                  src={l.image}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover opacity-95"
                  unoptimized
                />
                <span className="absolute right-1 top-1 rounded-pill bg-black/45 px-1.5 py-0.5 text-[8.5px] font-semibold text-paper backdrop-blur-sm">
                  {i === 0 ? "140 TND/night" : "3 800 /mo"}
                </span>
              </div>
              <div className="px-1.5 py-1">
                <p className="truncate text-[9.5px] font-semibold text-paper">
                  {l.title}
                </p>
                <p className="truncate text-[9px] text-white/45">{l.city}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tab bar */}
        <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.06] bg-ink/95 px-6 py-2.5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            {[
              { I: Compass, a: true },
              { I: Heart, a: false },
              { I: CalendarCheck, a: false },
              { I: Search, a: false },
            ].map(({ I, a }, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <I
                  className={`h-4 w-4 ${a ? "text-paper" : "text-white/35"}`}
                  strokeWidth={1.8}
                />
                <span
                  className={
                    "h-1 w-1 rounded-pill " + (a ? "bg-paper" : "bg-transparent")
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </Phone>

      <p className="mt-8 max-w-[280px] text-center text-[13px] font-medium text-white/60">
        <span className="text-paper">Mobile app</span>
        <span className="text-white/35"> · </span>
        search, tour in 3D, and reserve your stay — in about six taps.
      </p>
    </div>
  );
}
