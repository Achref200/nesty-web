"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { canModifyListing, type ReservationLike } from "@/lib/availability";
import type { Database } from "@/types/database";
import {
  mergeDraft,
  validateAll,
  type ListingDraft,
  type ListingStatus,
} from "@/lib/listings/schema";

type ListingInsert = Database["public"]["Tables"]["listings"]["Insert"];
type ListingUpdate = Database["public"]["Tables"]["listings"]["Update"];

export type ListingDraftState = { error?: string; ok?: boolean; id?: string };

/* ─────────────────────── Draft ⇄ row serialization ─────────────────────── */

/** Columns added by the listing-lifecycle migration. Stripped on fallback. */
const NEW_COLUMNS = [
  "property_type",
  "max_guests",
  "district",
  "contact_phone",
  "house_rules",
  "pricing",
  "booking_conditions",
  "wizard_step",
] as const;

/** Map a lifecycle status onto the legacy 2-value column (pre-migration). */
function legacyStatus(status: ListingStatus): "active" | "hidden" {
  return status === "published" ? "active" : "hidden";
}

/** True when the error is a missing column / unknown status (pre-migration). */
function isSchemaError(message: string): boolean {
  return /schema cache|could not find|does not exist|violates check constraint|invalid input value for enum/i.test(
    message,
  );
}

/** Turn the raw "schema cache" error into an actionable message. */
function friendlyColumnError(message: string): string {
  if (isSchemaError(message)) {
    return "Some listing fields aren't available yet. Apply the latest Supabase migration (listing_lifecycle) to unlock the full wizard.";
  }
  return message;
}

type Row = Record<string, unknown>;

/** Build the full insert/update payload for a wizard draft. */
function draftToRow(
  draft: ListingDraft,
  hostName: string | null,
  status: ListingStatus,
  step: number,
): Row {
  const cover = draft.cover ?? draft.gallery[0] ?? null;
  const row: Row = {
    host_name: hostName,
    title: draft.title.trim(),
    city: draft.city.trim(),
    address: draft.address.trim() || null,
    description: draft.description.trim() || null,
    price_per_month: Math.round(draft.pricing.amount) || 0,
    bedrooms: draft.bedrooms,
    bathrooms: draft.bathrooms,
    cover_image: cover,
    gallery: draft.gallery,
    tags: draft.tags,
    amenities: draft.amenities,
    property_type: draft.propertyType,
    max_guests: draft.maxGuests,
    district: draft.district.trim() || null,
    contact_phone: draft.contactPhone.trim() || null,
    house_rules: draft.rules,
    pricing: draft.pricing,
    booking_conditions: draft.conditions,
    status,
    wizard_step: step,
  };
  if (draft.latitude != null && draft.longitude != null) {
    row.latitude = draft.latitude;
    row.longitude = draft.longitude;
  }
  return row;
}

/** Drop migration-only columns and downgrade the status for legacy schemas. */
function stripNewColumns(row: Row): Row {
  const copy: Row = { ...row };
  for (const c of NEW_COLUMNS) delete copy[c];
  if (typeof row.status === "string") {
    copy.status = legacyStatus(row.status as ListingStatus);
  }
  return copy;
}

async function insertRow(
  supabase: ReturnType<typeof createClient>,
  row: Row,
): Promise<{ id?: string; error?: string }> {
  let res = await supabase
    .from("listings")
    .insert(row as unknown as ListingInsert)
    .select("id")
    .single();
  if (res.error && isSchemaError(res.error.message)) {
    res = await supabase
      .from("listings")
      .insert(stripNewColumns(row) as unknown as ListingInsert)
      .select("id")
      .single();
  }
  if (res.error) return { error: friendlyColumnError(res.error.message) };
  return { id: (res.data as { id: string } | null)?.id };
}

async function updateRow(
  supabase: ReturnType<typeof createClient>,
  id: string,
  row: Row,
): Promise<{ error?: string }> {
  let res = await supabase
    .from("listings")
    .update(row as unknown as ListingUpdate)
    .eq("id", id);
  if (res.error && isSchemaError(res.error.message)) {
    res = await supabase
      .from("listings")
      .update(stripNewColumns(row) as unknown as ListingUpdate)
      .eq("id", id);
  }
  return { error: res.error ? friendlyColumnError(res.error.message) : undefined };
}

function revalidateListing(id?: string) {
  if (id) revalidatePath(`/dashboard/listings/${id}`);
  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard");
}

/* ───────────────────────── Create / edit (wizard) ───────────────────────── */

/**
 * Persist a wizard draft. Creates a new listing when `draft.id` is absent,
 * otherwise updates the owned listing. `status` is "draft" for a manual save
 * and "completed" once every step has validated (the final submit).
 */
async function persist(
  input: ListingDraft,
  status: ListingStatus,
  step: number,
): Promise<ListingDraftState> {
  const draft = mergeDraft(input);
  draft.id = input.id;
  const supabase = createClient();
  const t = await getTranslations("dashboard.actions");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t("signedOut") };
  if (!draft.title.trim()) return { error: t("titleRequired") };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const row = draftToRow(draft, profile?.full_name ?? null, status, step);

  if (draft.id) {
    const owned = await ownedListing(draft.id);
    if (owned.error) return { error: owned.error };
    const { error } = await updateRow(supabase, draft.id, row);
    if (error) return { error };
    revalidateListing(draft.id);
    return { ok: true, id: draft.id };
  }

  const { id, error } = await insertRow(supabase, {
    host_id: user.id,
    ...row,
  } as Row);
  if (error) return { error };
  revalidateListing(id);
  return { ok: true, id };
}

/** Save the current wizard state as a draft (no full validation). */
export async function saveListingDraft(
  draft: ListingDraft,
  step = 0,
): Promise<ListingDraftState> {
  return persist(draft, "draft", step);
}

/** Final submit — validates every step, then stores as a completed draft. */
export async function submitListing(
  draft: ListingDraft,
): Promise<ListingDraftState> {
  const errors = validateAll(mergeDraft(draft));
  if (Object.keys(errors).length > 0) {
    const t = await getTranslations("dashboard.actions");
    return { error: t("fixErrors") };
  }
  return persist(draft, "completed", 6);
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

/* ─────────────────────────── Lifecycle transitions ─────────────────────────── */

async function transition(
  id: string,
  to: ListingStatus,
): Promise<ListingControlState> {
  const { supabase, error } = await ownedListing(id);
  if (error) return { error };
  const { error: updateError } = await updateRow(supabase, id, { status: to });
  if (updateError) return { error: updateError };
  revalidateListing(id);
  return { ok: true };
}

/** Make a draft/disabled listing live. */
export async function publishListing(id: string): Promise<ListingControlState> {
  return transition(id, "published");
}

/**
 * Deactivate a published listing: hidden from traveler search, but all data
 * and existing reservations remain intact. Always allowed.
 */
export async function disableListing(id: string): Promise<ListingControlState> {
  return transition(id, "disabled");
}

/** Restore a disabled listing to its published visibility. */
export async function reactivateListing(
  id: string,
): Promise<ListingControlState> {
  return transition(id, "published");
}

/**
 * Backward-compatible visibility toggle used by existing controls.
 * "active" → published, "hidden" → disabled.
 */
export async function setListingStatus(
  id: string,
  status: "active" | "hidden",
): Promise<ListingControlState> {
  return status === "active" ? publishListing(id) : disableListing(id);
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
