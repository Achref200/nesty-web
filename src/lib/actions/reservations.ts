"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { ReservationStatus } from "@/data/types";

type Supabase = ReturnType<typeof createClient>;

export type ActionResult = { ok?: boolean; error?: string };

function revalidateReservations(id?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/requests");
  revalidatePath("/dashboard/calendar");
  if (id) revalidatePath(`/dashboard/requests/${id}`);
}

/** Turn a raw Postgres error into an agency-actionable message. */
function describe(message: string, t: (k: string) => string): string {
  const low = message.toLowerCase();
  if (low.includes("exclusion") || low.includes("overlap") || low.includes("23p01")) {
    return t("overlapConflict");
  }
  if (
    low.includes("does not exist") ||
    low.includes("schema cache") ||
    low.includes("could not find") ||
    low.includes("column")
  ) {
    return t("migrationNeeded");
  }
  if (low.includes("blocked")) return t("datesBlocked");
  return message;
}

/** Fetch a reservation the signed-in agency owns (ownership guard). */
async function ownedReservation(
  supabase: Supabase,
  id: string,
): Promise<{ status: ReservationStatus } | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("reservations")
    .select("status")
    .eq("id", id)
    .eq("host_id", user.id)
    .maybeSingle();
  return (data as { status: ReservationStatus } | null) ?? null;
}

/**
 * Confirm a pending reservation. The DB EXCLUDE constraint guarantees no
 * overlapping active reservation can coexist, so confirmation is race-safe.
 */
export async function confirmReservation(id: string): Promise<ActionResult> {
  const t = await getTranslations("dashboard.actions");
  const supabase = createClient();
  const owned = await ownedReservation(supabase, id);
  if (!owned) return { error: t("reservationNotFound") };
  if (owned.status !== "pending") return { error: t("notPending") };

  const { error } = await supabase
    .from("reservations")
    .update({ status: "confirmed" })
    .eq("id", id)
    .eq("status", "pending"); // optimistic guard against a concurrent change
  if (error) return { error: describe(error.message, t) };
  revalidateReservations(id);
  return { ok: true };
}

/** Reject a pending request — immediately releases the soft-locked dates. */
export async function rejectReservation(
  id: string,
  reason?: string,
): Promise<ActionResult> {
  const t = await getTranslations("dashboard.actions");
  const supabase = createClient();
  const owned = await ownedReservation(supabase, id);
  if (!owned) return { error: t("reservationNotFound") };
  if (owned.status !== "pending") return { error: t("notPending") };

  const { error } = await supabase
    .from("reservations")
    .update({ status: "rejected", cancellation_reason: reason?.trim() || null })
    .eq("id", id);
  if (error) return { error: describe(error.message, t) };
  revalidateReservations(id);
  return { ok: true };
}

/**
 * Cancel a confirmed reservation. A reason is mandatory — it is recorded in the
 * immutable timeline and sent to the seeker — and the dates are released.
 */
export async function cancelReservation(
  id: string,
  reason: string,
): Promise<ActionResult> {
  const t = await getTranslations("dashboard.actions");
  if (!reason?.trim()) return { error: t("reasonRequired") };
  const supabase = createClient();
  const owned = await ownedReservation(supabase, id);
  if (!owned) return { error: t("reservationNotFound") };
  if (owned.status !== "confirmed") return { error: t("notConfirmed") };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("reservations")
    .update({
      status: "cancelled",
      cancellation_reason: reason.trim(),
      cancelled_by: user?.id ?? null,
    })
    .eq("id", id);
  if (error) return { error: describe(error.message, t) };
  revalidateReservations(id);
  return { ok: true };
}

/** Mark a confirmed reservation as completed (stay finished). */
export async function completeReservation(id: string): Promise<ActionResult> {
  const t = await getTranslations("dashboard.actions");
  const supabase = createClient();
  const owned = await ownedReservation(supabase, id);
  if (!owned) return { error: t("reservationNotFound") };
  if (owned.status !== "confirmed") return { error: t("notConfirmed") };

  const { error } = await supabase
    .from("reservations")
    .update({ status: "completed" })
    .eq("id", id);
  if (error) return { error: describe(error.message, t) };
  revalidateReservations(id);
  return { ok: true };
}

/**
 * Modify a reservation's dates and/or guest count. Availability is revalidated
 * atomically by the DB (EXCLUDE constraint + block guard); the change is logged.
 */
export async function modifyReservation(
  id: string,
  input: { start: string; end?: string | null; guests?: number },
): Promise<ActionResult> {
  const t = await getTranslations("dashboard.actions");
  const supabase = createClient();
  const owned = await ownedReservation(supabase, id);
  if (!owned) return { error: t("reservationNotFound") };
  if (owned.status !== "pending" && owned.status !== "confirmed") {
    return { error: t("notModifiable") };
  }

  const update: Database["public"]["Tables"]["reservations"]["Update"] = {
    start_at: input.start,
    end_at: input.end ?? null,
  };
  if (typeof input.guests === "number") update.guests = input.guests;

  const { error } = await supabase.from("reservations").update(update).eq("id", id);
  if (error) return { error: describe(error.message, t) };
  revalidateReservations(id);
  return { ok: true };
}

/** Manually block a date range on a listing the agency owns. */
export async function blockDates(
  listingId: string,
  start: string,
  end: string,
  reason?: string,
): Promise<ActionResult> {
  const t = await getTranslations("dashboard.actions");
  if (!start || !end || new Date(end) <= new Date(start)) {
    return { error: t("invalidRange") };
  }
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t("signedOut") };

  const { data: listing } = await supabase
    .from("listings")
    .select("id")
    .eq("id", listingId)
    .eq("host_id", user.id)
    .maybeSingle();
  if (!listing) return { error: t("listingNotFound") };

  const { error } = await supabase.from("availability_blocks").insert({
    listing_id: listingId,
    host_id: user.id,
    start_date: start,
    end_date: end,
    reason: reason?.trim() || null,
  });
  if (error) return { error: describe(error.message, t) };
  revalidateReservations();
  return { ok: true };
}

/** Remove a manual block, releasing the dates back to Available. */
export async function unblockDates(blockId: string): Promise<ActionResult> {
  const t = await getTranslations("dashboard.actions");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t("signedOut") };

  const { error } = await supabase
    .from("availability_blocks")
    .delete()
    .eq("id", blockId)
    .eq("host_id", user.id);
  if (error) return { error: describe(error.message, t) };
  revalidateReservations();
  return { ok: true };
}
