"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Inbox, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReservationItem } from "@/components/dashboard/reservation-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Reservation, ReservationStatus } from "@/data/types";

type StatusKey = "all" | ReservationStatus;

const STATUS_KEYS: StatusKey[] = [
  "all",
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "rejected",
  "expired",
];

const SORT_KEYS = ["recent", "checkin", "created"] as const;

const selectClass =
  "h-11 rounded-xl border border-separator bg-card px-3 text-sm font-semibold text-ink outline-none focus:border-ink";

export function RequestsView({
  items,
  counts,
  listings,
  total,
  hasMore,
  page,
  pageSize,
  filters,
}: {
  items: Reservation[];
  counts: Record<StatusKey, number>;
  listings: { id: string; title: string }[];
  total: number;
  hasMore: boolean;
  page: number;
  pageSize: number;
  filters: {
    status: StatusKey;
    listingId: string;
    search: string;
    sort: string;
  };
}) {
  const t = useTranslations("dashboard.requests");
  const tStatus = useTranslations("dashboard.status");
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(filters.search);

  // Push filter changes into the URL (server re-queries). Reset page on change.
  function setParam(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v == null || v === "" || v === "all") next.delete(k);
      else next.set(k, v);
    }
    if (!("page" in patch)) next.delete("page");
    router.push(`/dashboard/requests?${next.toString()}`);
  }

  // Debounce the free-text search.
  useEffect(() => {
    if (search === filters.search) return;
    const id = setTimeout(() => setParam({ q: search }), 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = page * pageSize + items.length;

  return (
    <div className="flex flex-col gap-5">
      {/* Filter bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-soft" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label={t("filterStatus")}
            className={selectClass}
            value={filters.status}
            onChange={(e) => setParam({ status: e.target.value })}
          >
            {STATUS_KEYS.map((s) => (
              <option key={s} value={s}>
                {(s === "all" ? t("all") : tStatus(s)) + ` (${counts[s]})`}
              </option>
            ))}
          </select>
          <select
            aria-label={t("filterListing")}
            className={selectClass}
            value={filters.listingId}
            onChange={(e) => setParam({ listing: e.target.value })}
          >
            <option value="all">{t("allListings")}</option>
            {listings.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
          <select
            aria-label={t("sort")}
            className={selectClass}
            value={filters.sort}
            onChange={(e) => setParam({ sort: e.target.value })}
          >
            {SORT_KEYS.map((s) => (
              <option key={s} value={s}>
                {t(`sort_${s}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-separator py-14 text-center">
          <Inbox className="h-6 w-6 text-muted-soft" />
          <p className="text-[15px] font-semibold text-ink">{t("emptyTitle")}</p>
          <p className="max-w-xs text-sm text-muted">{t("emptyBody")}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((r) => (
              <ReservationItem
                key={r.id}
                reservation={r}
                manage
                showSeeker
                href={`/dashboard/requests/${r.id}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 pt-1 text-sm text-muted">
            <span>{t("showing", { from, to, total })}</span>
            <div className="ml-auto flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 0}
                onClick={() => setParam({ page: String(page - 1) })}
              >
                <ChevronLeft className="h-4 w-4" /> {t("prev")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!hasMore}
                onClick={() => setParam({ page: String(page + 1) })}
              >
                {t("next")} <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
