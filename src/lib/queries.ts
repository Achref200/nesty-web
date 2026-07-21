import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Database } from "@/types/database";
import type {
  Listing,
  ListingType,
  RentalTerm,
  Reservation,
  ReservationStatus,
  ReservationType,
} from "@/data/types";

type ListingRow = Database["public"]["Tables"]["listings"]["Row"];
type ReservationRow = Database["public"]["Tables"]["reservations"]["Row"] & {
  listings?: { title: string | null; city: string | null } | null;
};
type EventLite = { listing_id: string; type: string };

export interface ListingStats {
  views: number;
  saves: number;
  tours: number;
}

const emptyStats = (): ListingStats => ({ views: 0, saves: 0, tours: 0 });

function toListingType(t: string): ListingType {
  if (t === "private_room") return "privateRoom";
  if (t === "shared_room") return "sharedRoom";
  return "entirePlace";
}

function aggregate(events: EventLite[]): {
  byListing: Map<string, ListingStats>;
  totals: ListingStats;
} {
  const byListing = new Map<string, ListingStats>();
  const totals = emptyStats();
  for (const e of events) {
    const s = byListing.get(e.listing_id) ?? emptyStats();
    if (e.type === "view") {
      s.views += 1;
      totals.views += 1;
    } else if (e.type === "save") {
      s.saves += 1;
      totals.saves += 1;
    } else if (e.type === "tour") {
      s.tours += 1;
      totals.tours += 1;
    }
    byListing.set(e.listing_id, s);
  }
  return { byListing, totals };
}

function mapListing(
  row: ListingRow,
  reserved: boolean,
  stats: ListingStats,
): Listing {
  return {
    id: row.id,
    hostId: row.host_id,
    title: row.title,
    city: row.city,
    pricePerMonth: Number(row.price_per_month),
    type: toListingType(row.type),
    rentalTerm: row.rental_term === "short_term" ? "shortTerm" : "longTerm",
    audience: row.audience ?? [],
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    areaSqm: Number(row.area_sqm),
    cover: row.cover_image,
    gallery: row.gallery ?? [],
    rating: Number(row.rating),
    reviewCount: row.review_count,
    state: reserved ? "reserved" : "available",
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    status: row.status,
    tags: row.tags ?? [],
    views: stats.views,
    saves: stats.saves,
    tours: stats.tours,
  };
}

function mapReservation(row: ReservationRow): Reservation {
  return {
    id: row.id,
    listingId: row.listing_id,
    listingTitle: row.listings?.title ?? "Listing",
    city: row.listings?.city ?? "",
    guestName: row.guest_name ?? "Guest",
    type: row.type as ReservationType,
    start: row.start_at,
    end: row.end_at ?? undefined,
    guests: row.guests,
    status: row.status as ReservationStatus,
    note: row.note ?? undefined,
    estimatedTotal: row.estimated_total ?? undefined,
  };
}

function isReservedNow(rows: { status: string; start_at: string }[]): boolean {
  const grace = Date.now() - 864e5;
  return rows.some(
    (r) =>
      (r.status === "pending" || r.status === "confirmed") &&
      new Date(r.start_at).getTime() >= grace,
  );
}

export interface DashboardData {
  role: "seeker" | "host" | "partner";
  fullName: string;
  email: string;
  listings: Listing[];
  reservations: Reservation[];
  pending: number;
  totals: ListingStats;
}

/** Everything the agency dashboard needs for the signed-in host. */
export async function getDashboardData(): Promise<DashboardData | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, listingsRes, reservationsRes, eventsRes] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("listings")
        .select("*")
        .eq("host_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("reservations")
        .select("*, listings(title, city)")
        .eq("host_id", user.id)
        .order("start_at", { ascending: true }),
      supabase
        .from("listing_events")
        .select("listing_id,type")
        .eq("host_id", user.id),
    ]);

  const reservationRows = (reservationsRes.data ??
    []) as unknown as ReservationRow[];
  const reservations = reservationRows.map(mapReservation);

  const grace = Date.now() - 864e5;
  const reservedIds = new Set(
    reservationRows
      .filter(
        (r) =>
          (r.status === "pending" || r.status === "confirmed") &&
          new Date(r.start_at).getTime() >= grace,
      )
      .map((r) => r.listing_id),
  );

  const { byListing, totals } = aggregate(
    (eventsRes.data ?? []) as EventLite[],
  );

  const listings = (listingsRes.data ?? []).map((row) =>
    mapListing(
      row as ListingRow,
      reservedIds.has((row as ListingRow).id),
      byListing.get((row as ListingRow).id) ?? emptyStats(),
    ),
  );

  const pending = reservations.filter((r) => r.status === "pending").length;

  return {
    role: profileRes.data?.role ?? "host",
    fullName: profileRes.data?.full_name ?? user.email?.split("@")[0] ?? "there",
    email: user.email ?? "",
    listings,
    reservations,
    pending,
    totals,
  };
}

export interface Profile {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  role: "seeker" | "host" | "partner";
}

/** The signed-in agency's editable profile (settings page). */
export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, role")
    .eq("id", user.id)
    .single();

  return {
    fullName: data?.full_name ?? "",
    email: user.email ?? "",
    avatarUrl: data?.avatar_url ?? null,
    role: data?.role ?? "host",
  };
}

/** A public-facing listing preview for the landing seeker space. */
export interface PublicListing {
  id: string;
  title: string;
  city: string;
  pricePerMonth: number;
  rentalTerm: RentalTerm;
  type: ListingType;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  cover: string | null;
  rating: number;
  reviewCount: number;
  tags: string[];
  agency: string | null;
}

export interface PublicListingsQuery {
  city?: string;
  term?: "all" | "shortTerm" | "longTerm";
  maxPrice?: number | null;
  page?: number;
  pageSize?: number;
}

export interface PublicListingsResult {
  items: PublicListing[];
  total: number;
  hasMore: boolean;
}

export interface ListingFacets {
  cities: string[];
  maxPrice: number;
}

type PublicRow = {
  id: string;
  title: string;
  city: string;
  price_per_month: number;
  rental_term: "short_term" | "long_term";
  type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  cover_image: string | null;
  gallery: string[] | null;
  rating: number;
  review_count: number;
  tags: string[] | null;
  host_name: string | null;
};

function mapPublicRow(row: PublicRow): PublicListing {
  return {
    id: row.id,
    title: row.title,
    city: row.city,
    pricePerMonth: Number(row.price_per_month),
    rentalTerm: row.rental_term === "short_term" ? "shortTerm" : "longTerm",
    type: toListingType(row.type),
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    areaSqm: Number(row.area_sqm),
    cover: row.cover_image ?? row.gallery?.[0] ?? null,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    tags: row.tags ?? [],
    agency: row.host_name ?? null,
  };
}

const PUBLIC_COLUMNS =
  "id, title, city, price_per_month, rental_term, type, bedrooms, bathrooms, area_sqm, cover_image, gallery, rating, review_count, tags, host_name";

/**
 * A page of active listings for the public landing (traveller space). Filtering
 * and pagination happen in the database (`.eq/.lte/.range` + an exact count) so
 * this scales past thousands of listings — the client only ever holds one page
 * at a time. Real data only: returns an empty page when Supabase isn't
 * configured or the query fails, so the UI shows an honest empty state.
 */
export async function getPublicListings(
  query: PublicListingsQuery = {},
): Promise<PublicListingsResult> {
  const empty: PublicListingsResult = { items: [], total: 0, hasMore: false };
  if (!isSupabaseConfigured) return empty;

  const pageSize = Math.min(Math.max(query.pageSize ?? 12, 1), 48);
  const page = Math.max(query.page ?? 0, 0);
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const supabase = createClient();
  let q = supabase
    .from("listings")
    .select(PUBLIC_COLUMNS, { count: "exact" })
    .eq("status", "active");

  if (query.city && query.city !== "all") q = q.eq("city", query.city);
  if (query.term && query.term !== "all") {
    q = q.eq(
      "rental_term",
      query.term === "shortTerm" ? "short_term" : "long_term",
    );
  }
  if (typeof query.maxPrice === "number" && query.maxPrice > 0) {
    q = q.lte("price_per_month", query.maxPrice);
  }

  const { data, error, count } = await q
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error || !data) return empty;

  const items = (data as unknown as PublicRow[]).map(mapPublicRow);
  const total = count ?? items.length;
  return { items, total, hasMore: from + items.length < total };
}

/**
 * Filter facets for the traveller space: the distinct cities and the highest
 * monthly price across active listings. Cities are read as a single column and
 * de-duplicated; for a very large catalog, move this to a Postgres RPC/view.
 */
export async function getListingFacets(): Promise<ListingFacets> {
  if (!isSupabaseConfigured) return { cities: [], maxPrice: 0 };
  const supabase = createClient();
  const [citiesRes, priceRes] = await Promise.all([
    supabase.from("listings").select("city").eq("status", "active").limit(1000),
    supabase
      .from("listings")
      .select("price_per_month")
      .eq("status", "active")
      .order("price_per_month", { ascending: false })
      .limit(1),
  ]);

  const cities = citiesRes.data
    ? Array.from(
        new Set(
          (citiesRes.data as { city: string | null }[])
            .map((r) => r.city)
            .filter((c): c is string => Boolean(c)),
        ),
      ).sort()
    : [];
  const maxPrice = priceRes.data?.[0]
    ? Number((priceRes.data[0] as { price_per_month: number }).price_per_month)
    : 0;

  return { cities, maxPrice };
}

export interface ListingDetail {
  listing: Listing;
  reservations: Reservation[];
}

/** A single listing owned by the current host, with its analytics & bookings. */
export async function getListingDetail(
  id: string,
): Promise<ListingDetail | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [listingRes, eventsRes, reservationsRes] = await Promise.all([
    supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .eq("host_id", user.id)
      .maybeSingle(),
    supabase.from("listing_events").select("listing_id,type").eq("listing_id", id),
    supabase
      .from("reservations")
      .select("*, listings(title, city)")
      .eq("listing_id", id)
      .eq("host_id", user.id)
      .order("start_at", { ascending: true }),
  ]);

  if (!listingRes.data) return null;

  const { byListing } = aggregate((eventsRes.data ?? []) as EventLite[]);
  const reservationRows = (reservationsRes.data ??
    []) as unknown as ReservationRow[];
  const reservations = reservationRows.map(mapReservation);
  const reserved = isReservedNow(reservationRows);

  const listing = mapListing(
    listingRes.data as ListingRow,
    reserved,
    byListing.get(id) ?? emptyStats(),
  );
  return { listing, reservations };
}
