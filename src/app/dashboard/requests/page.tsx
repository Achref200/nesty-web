import { RequestsView } from "@/components/dashboard/requests-view";
import { getReservations, type ReservationFilters } from "@/lib/queries";
import type { ReservationStatus } from "@/data/types";

const STATUSES = new Set([
  "pending",
  "confirmed",
  "rejected",
  "cancelled",
  "expired",
  "completed",
]);

const SORTS = new Set(["recent", "checkin", "created"]);

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const raw = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const status = raw("status");
  const sort = raw("sort");
  const page = Number.parseInt(raw("page") ?? "0", 10);

  // Only accept well-formed YYYY-MM-DD so a hand-edited URL can't reach the query.
  const asDate = (k: string) => {
    const v = raw(k) ?? "";
    return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "";
  };
  const dateFrom = asDate("from");
  const dateTo = asDate("to");

  const filters: ReservationFilters = {
    status:
      status && STATUSES.has(status) ? (status as ReservationStatus) : "all",
    listingId: raw("listing") || "all",
    search: raw("q") ?? "",
    sort: sort && SORTS.has(sort) ? (sort as ReservationFilters["sort"]) : "recent",
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page: Number.isFinite(page) && page > 0 ? page : 0,
    pageSize: 20,
  };

  const data = await getReservations(filters);

  return (
    <RequestsView
      items={data.items}
      counts={data.counts}
      listings={data.listings}
      total={data.total}
      hasMore={data.hasMore}
      page={filters.page ?? 0}
      pageSize={filters.pageSize ?? 20}
      filters={{
        status: filters.status ?? "all",
        listingId: filters.listingId ?? "all",
        search: filters.search ?? "",
        sort: filters.sort ?? "recent",
        dateFrom,
        dateTo,
      }}
    />
  );
}
