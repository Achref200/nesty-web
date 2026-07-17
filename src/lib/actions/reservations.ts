"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canConfirmReservation, type ReservationLike } from "@/lib/availability";
import type { ReservationStatus } from "@/data/types";

type ReservationRowLite = {
  id: string;
  listing_id: string;
  type: "visit" | "stay";
  start_at: string;
  end_at: string | null;
  status: ReservationStatus;
};

function toLike(r: ReservationRowLite): ReservationLike {
  return {
    id: r.id,
    listingId: r.listing_id,
    type: r.type,
    start: r.start_at,
    end: r.end_at ?? undefined,
    status: r.status,
  };
}

/** Update a reservation's status. RLS ensures only the host (or guest) can. */
export async function setReservationStatus(
  id: string,
  status: Extract<ReservationStatus, "confirmed" | "cancelled" | "completed">,
) {
  const supabase = createClient();

  // Guard: never confirm a reservation that overlaps an already-confirmed one.
  if (status === "confirmed") {
    const { data: target } = await supabase
      .from("reservations")
      .select("id, listing_id, type, start_at, end_at, status")
      .eq("id", id)
      .maybeSingle();
    if (!target) return { error: "Reservation not found." };

    const { data: others } = await supabase
      .from("reservations")
      .select("id, listing_id, type, start_at, end_at, status")
      .eq("listing_id", (target as ReservationRowLite).listing_id)
      .neq("id", id);

    const rule = canConfirmReservation(
      toLike(target as ReservationRowLite),
      ((others ?? []) as ReservationRowLite[]).map(toLike),
    );
    if (!rule.allowed) return { error: rule.reason };
  }

  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/requests");
  revalidatePath("/dashboard/calendar");
  return { ok: true };
}
