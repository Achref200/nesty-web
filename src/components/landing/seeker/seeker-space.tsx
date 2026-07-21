"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Star,
  Box,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import type {
  PublicListing,
  PublicListingsQuery,
  PublicListingsResult,
  ListingFacets,
} from "@/lib/queries";
import { loadPublicListings } from "@/lib/actions/public-listings";
import { cn } from "@/lib/utils";
import { Dots } from "@/components/ui/dots";
import { Reveal } from "../reveal";
import { Voice } from "../voice";
import { SeekerBenefits } from "./seeker-benefits";
import { DownloadCta } from "./download-cta";
import { SeekerAbout } from "./seeker-about";
import { AppModal } from "./app-modal";

type TermFilter = "all" | "shortTerm" | "longTerm";

const PAGE_SIZE = 12;

function formatPrice(value: number) {
  return value.toLocaleString("fr-FR");
}

/**
 * The traveller (seeker) experience. No hero — straight into a filterable,
 * paginated grid of real listings. Filtering and paging run in the database via
 * a server action, so it scales to thousands of listings (the browser only
 * holds one page at a time). Reserving anything opens the app modal — booking
 * itself happens in the mobile app.
 */
export function SeekerSpace({
  initial,
  facets,
}: {
  initial: PublicListingsResult;
  facets: ListingFacets;
}) {
  const t = useTranslations("seeker");
  const hasData = facets.maxPrice > 0;

  const [city, setCity] = useState("all");
  const [term, setTerm] = useState<TermFilter>("all");
  const [maxPrice, setMaxPrice] = useState(facets.maxPrice);

  const [items, setItems] = useState<PublicListing[]>(initial.items);
  const [total, setTotal] = useState(initial.total);
  const [hasMore, setHasMore] = useState(initial.hasMore);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | null>(null);

  const didMount = useRef(false);

  const priceFilter =
    facets.maxPrice > 0 && maxPrice < facets.maxPrice ? maxPrice : null;
  const filtersActive = city !== "all" || term !== "all" || priceFilter !== null;

  // Re-query the database whenever a filter changes (debounced for the slider).
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const query: PublicListingsQuery = {
      city,
      term,
      maxPrice:
        facets.maxPrice > 0 && maxPrice < facets.maxPrice ? maxPrice : null,
      page: 0,
      pageSize: PAGE_SIZE,
    };
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await loadPublicListings(query);
        setItems(res.items);
        setTotal(res.total);
        setHasMore(res.hasMore);
        setPage(0);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [city, term, maxPrice, facets.maxPrice]);

  async function loadMore() {
    const next = page + 1;
    setLoading(true);
    try {
      const res = await loadPublicListings({
        city,
        term,
        maxPrice: priceFilter,
        page: next,
        pageSize: PAGE_SIZE,
      });
      setItems((prev) => [...prev, ...res.items]);
      setHasMore(res.hasMore);
      setTotal(res.total);
      setPage(next);
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setCity("all");
    setTerm("all");
    setMaxPrice(facets.maxPrice);
  }

  function openApp(title?: string) {
    setModalTitle(title ?? null);
    setModalOpen(true);
  }

  return (
    <>
      <main>
        {/* Filters + real listings */}
        <section id="stays" className="relative pb-16 pt-10 md:pb-24 md:pt-12">
          <div className="mx-auto max-w-wide px-5 md:px-8">
            <div className="flex flex-col gap-2">
              <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
                {t("filters.title")}
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-paper md:text-4xl">
                {t("filters.subtitle")}
              </h2>
            </div>

            {hasData && (
              <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-4 md:flex-row md:items-end md:gap-5 md:p-5">
                <FilterSelect
                  label={t("filters.city")}
                  value={city}
                  onChange={setCity}
                  options={[
                    { value: "all", label: t("filters.allCities") },
                    ...facets.cities.map((c) => ({ value: c, label: c })),
                  ]}
                />
                <FilterSelect
                  label={t("filters.term")}
                  value={term}
                  onChange={(v) => setTerm(v as TermFilter)}
                  options={[
                    { value: "all", label: t("filters.allTerms") },
                    { value: "shortTerm", label: t("filters.shortTerm") },
                    { value: "longTerm", label: t("filters.longTerm") },
                  ]}
                />
                <div className="flex flex-1 flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-white/40">
                    {t("filters.maxPrice")} · {formatPrice(maxPrice)}{" "}
                    {t("filters.priceUnit")}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={facets.maxPrice}
                    step={100}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    aria-label={t("filters.maxPrice")}
                    className="h-11 w-full cursor-pointer accent-paper"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/60">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    {total === 1
                      ? t("filters.resultsOne")
                      : t("filters.resultsOther", { count: total })}
                  </span>
                  {filtersActive && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-[12.5px] font-semibold text-white/50 underline decoration-white/25 underline-offset-4 hover:text-paper"
                    >
                      {t("filters.clear")}
                    </button>
                  )}
                </div>
              </div>
            )}

            {items.length > 0 ? (
              <>
                <div
                  className={cn(
                    "mt-8 grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 md:gap-5",
                    loading && "opacity-60",
                  )}
                >
                  {items.map((listing, i) => (
                    <Reveal key={listing.id} delay={(i % 3) * 60}>
                      <ListingCard
                        listing={listing}
                        onReserve={() => openApp(listing.title)}
                      />
                    </Reveal>
                  ))}
                </div>

                <div className="mt-10 flex flex-col items-center gap-3">
                  <p className="text-[13px] text-white/40">
                    {t("filters.showing", { shown: items.length, total })}
                  </p>
                  {hasMore && (
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-pill border border-white/15 px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-white/[0.06] disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          {t("filters.loading")} <Dots />
                        </>
                      ) : (
                        t("filters.loadMore")
                      )}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <EmptyState hasData={hasData} onClear={clearFilters} />
            )}
          </div>
        </section>

        <SeekerBenefits />
        <Voice />
        <DownloadCta onWatchDemo={() => openApp()} />
        <SeekerAbout />
      </main>

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        listingTitle={modalTitle}
      />
    </>
  );
}

/* ── Filter select ─────────────────────────────────────────────────── */
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-1 flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wide text-white/40">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3 text-[14px] font-semibold text-paper focus:border-white/30 focus:outline-none [&>option]:bg-ink"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ── Listing preview card ──────────────────────────────────────────── */
function ListingCard({
  listing,
  onReserve,
}: {
  listing: PublicListing;
  onReserve: () => void;
}) {
  const t = useTranslations("seeker.listing");
  const has3d = listing.tags.some((tag) => /3d|tour/i.test(tag));

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/[0.05]">
        {listing.cover ? (
          <Image
            src={listing.cover}
            alt={`${listing.title} — ${listing.city}, Tunisia`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/20">
            <MapPin className="h-8 w-8" />
          </div>
        )}
        <div className="keep-dark absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-pill bg-paper/90 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.05em] text-ink backdrop-blur-sm">
            <ShieldCheck className="h-3 w-3" strokeWidth={2.4} />
            {t("verified")}
          </span>
          {has3d && (
            <span className="inline-flex items-center gap-1 rounded-pill bg-black/50 px-2.5 py-1 text-[10.5px] font-semibold text-paper backdrop-blur-sm">
              <Box className="h-3 w-3" strokeWidth={2} />
              {t("tour3d")}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[15px] font-bold leading-tight tracking-tight text-paper">
            {listing.title}
          </h3>
          {listing.rating > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-semibold text-white/70">
              <Star className="h-3.5 w-3.5 fill-current text-paper" />
              {listing.rating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-white/50">
          <MapPin className="h-3.5 w-3.5" />
          {listing.city}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-white/50">
          <span className="inline-flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" /> {listing.bedrooms} {t("beds")}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" /> {listing.bathrooms} {t("baths")}
          </span>
          <span className="inline-flex items-center gap-1">
            <Maximize className="h-3.5 w-3.5" /> {listing.areaSqm} m²
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-2 border-t border-white/[0.06] pt-4">
          <span className="flex flex-col leading-tight">
            <span className="text-[11px] text-white/40">{t("from")}</span>
            <span className="font-display text-lg font-bold text-paper">
              {formatPrice(listing.pricePerMonth)}{" "}
              <span className="text-[12px] font-medium text-white/50">
                TND{t("perMonth")}
              </span>
            </span>
          </span>
          <button
            type="button"
            onClick={onReserve}
            className="rounded-pill bg-paper px-4 py-2 text-[13px] font-bold text-ink transition-transform hover:-translate-y-px"
          >
            {t("reserve")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Empty state (no mocks — honest when there's no real data) ─────── */
function EmptyState({
  hasData,
  onClear,
}: {
  hasData: boolean;
  onClear: () => void;
}) {
  const t = useTranslations("seeker");
  return (
    <div className="mt-8 grid place-items-center rounded-3xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-16 text-center">
      <div className="max-w-md">
        <h3 className="font-display text-xl font-bold text-paper">
          {t("empty.title")}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-white/55">
          {t("empty.body")}
        </p>
        {hasData && (
          <button
            type="button"
            onClick={onClear}
            className="mt-5 rounded-pill border border-white/15 px-4 py-2 text-[13px] font-semibold text-paper transition-colors hover:bg-white/[0.06]"
          >
            {t("filters.clear")}
          </button>
        )}
      </div>
    </div>
  );
}
