"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { canModifyListing, type ReservationLike } from "@/lib/availability";

export type CreateListingState = { error?: string };

const TYPE_MAP: Record<string, "entire_place" | "private_room" | "shared_room"> =
  {
    entirePlace: "entire_place",
    privateRoom: "private_room",
    sharedRoom: "shared_room",
  };

function num(value: FormDataEntryValue | null, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Create a listing owned by the signed-in agency. */
export async function createListing(
  _prev: CreateListingState,
  formData: FormData,
): Promise<CreateListingState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const t = await getTranslations("dashboard.actions");
  if (!user) return { error: t("signedOut") };

  const title = String(formData.get("title") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  if (!title) return { error: t("titleRequired") };
  if (!city) return { error: t("cityRequired") };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const lat = formData.get("latitude");
  const lng = formData.get("longitude");
  const hasCoords = Boolean(lat) && Boolean(lng);

  const rentalTerm =
    String(formData.get("rentalTerm") ?? "longTerm") === "shortTerm"
      ? "short_term"
      : "long_term";
  const audience = String(formData.get("audience") ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  const gallery = String(formData.get("gallery") ?? "")
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
  const cover = String(formData.get("cover") ?? "").trim() || gallery[0] || null;

  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const { error } = await supabase.from("listings").insert({
    host_id: user.id,
    host_name: profile?.full_name ?? null,
    title,
    city,
    address: String(formData.get("address") ?? "").trim() || null,
    price_per_month: num(formData.get("price")),
    type: TYPE_MAP[String(formData.get("type") ?? "entirePlace")] ?? "entire_place",
    rental_term: rentalTerm,
    audience,
    bedrooms: num(formData.get("bedrooms")),
    bathrooms: num(formData.get("bathrooms")),
    area_sqm: num(formData.get("area")),
    cover_image: cover,
    gallery,
    description: String(formData.get("description") ?? "").trim() || null,
    // Only sent when present, so basic creation still works even before the
    // location / status+tags migrations are applied.
    ...(hasCoords ? { latitude: num(lat), longitude: num(lng) } : {}),
    ...(tags.length ? { tags } : {}),
  });
  if (error) return { error: friendlyColumnError(error.message) };

  redirect("/dashboard/listings");
}

async function ownedListing(id: string) {
  const supabase = createClient();
  const t = await getTranslations("dashboard.actions");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: t("signedOut") as string };
  const { data } = await supabase
    .from("listings")
    .select("id")
    .eq("id", id)
    .eq("host_id", user.id)
    .maybeSingle();
  if (!data) return { supabase, error: t("listingNotFound") as string };
  return { supabase, error: undefined };
}

/** Pending & confirmed reservations for a listing, as availability inputs. */
async function activeReservationsFor(
  supabase: ReturnType<typeof createClient>,
  listingId: string,
): Promise<ReservationLike[]> {
  const { data } = await supabase
    .from("reservations")
    .select("id, listing_id, type, start_at, end_at, status")
    .eq("listing_id", listingId)
    .in("status", ["pending", "confirmed"]);
  return (data ?? []).map((r) => ({
    id: r.id,
    listingId: r.listing_id,
    type: r.type,
    start: r.start_at,
    end: r.end_at ?? undefined,
    status: r.status,
  }));
}

/** Turn the raw "schema cache" error into an actionable message. */
function friendlyColumnError(message: string): string {
  if (/status.*(column|schema cache)|column.*status/i.test(message)) {
    return "The listings table is missing the 'status' column. Apply the latest Supabase migration (listing_status_tags) and try again.";
  }
  if (/tags.*(column|schema cache)|column.*tags/i.test(message)) {
    return "The listings table is missing the 'tags' column. Apply the latest Supabase migration (listing_status_tags) and try again.";
  }
  return message;
}

export type ListingControlState = { error?: string; ok?: boolean };

/** Update the monthly price of a listing the host owns. */
export async function updateListingPrice(
  id: string,
  price: number,
): Promise<ListingControlState> {
  if (!Number.isFinite(price) || price <= 0) {
    return { error: (await getTranslations("dashboard.actions"))("invalidPrice") };
  }
  const { supabase, error } = await ownedListing(id);
  if (error) return { error };
  const { error: updateError } = await supabase
    .from("listings")
    .update({ price_per_month: Math.round(price) })
    .eq("id", id);
  if (updateError) return { error: updateError.message };
  revalidatePath(`/dashboard/listings/${id}`);
  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Update listing photos (gallery + cover) for a listing the host owns. */
export async function updateListingMedia(
  id: string,
  urls: string[],
): Promise<ListingControlState> {
  const { supabase, error } = await ownedListing(id);
  if (error) return { error };

  const gallery = urls.map((u) => u.trim()).filter(Boolean);
  const cover = gallery[0] ?? null;

  const { error: updateError } = await supabase
    .from("listings")
    .update({ cover_image: cover, gallery })
    .eq("id", id);
  if (updateError) return { error: updateError.message };

  revalidatePath(`/dashboard/listings/${id}`);
  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Toggle a listing between active (visible) and hidden. */
export async function setListingStatus(
  id: string,
  status: "active" | "hidden",
): Promise<ListingControlState> {
  const { supabase, error } = await ownedListing(id);
  if (error) return { error };

  // Guard: never take a listing offline while it has upcoming bookings.
  if (status === "hidden") {
    const reservations = await activeReservationsFor(supabase, id);
    const rule = canModifyListing(reservations);
    if (!rule.allowed) return { error: rule.reason };
  }

  const { error: updateError } = await supabase
    .from("listings")
    .update({ status })
    .eq("id", id);
  if (updateError) return { error: friendlyColumnError(updateError.message) };
  revalidatePath(`/dashboard/listings/${id}`);
  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Permanently delete a listing the host owns. */
export async function deleteListing(id: string): Promise<ListingControlState> {
  const { supabase, error } = await ownedListing(id);
  if (error) return { error };

  // Guard: don't delete a listing that has upcoming bookings.
  const reservations = await activeReservationsFor(supabase, id);
  const rule = canModifyListing(reservations);
  if (!rule.allowed) return { error: rule.reason };

  const { error: deleteError } = await supabase
    .from("listings")
    .delete()
    .eq("id", id);
  if (deleteError) return { error: deleteError.message };
  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard");
  redirect("/dashboard/listings");
}
