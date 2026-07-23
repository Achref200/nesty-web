"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { INCIDENT_TYPES, type IncidentType } from "@/lib/incidents-config";

export type CreateIncidentState = { error?: string; ok?: boolean };

function pickType(value: FormDataEntryValue | null): IncidentType {
  const v = String(value ?? "");
  return (INCIDENT_TYPES as readonly string[]).includes(v)
    ? (v as IncidentType)
    : "other";
}

function urls(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * File an incident against a reservation the agency owns. Lifecycle
 * (Created → Under review → Resolved → Closed) then stays under Nesty Support
 * control; the agency can only create and monitor.
 */
export async function createIncident(
  _prev: CreateIncidentState,
  formData: FormData,
): Promise<CreateIncidentState> {
  const t = await getTranslations("dashboard.incidents.errors");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t("signedOut") };

  const reservationId = String(formData.get("reservationId") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const occurredOn = String(formData.get("occurredOn") ?? "").trim();
  if (!reservationId) return { error: t("reservationRequired") };
  if (!description) return { error: t("descriptionRequired") };

  // Ownership guard (RLS also enforces this).
  const { data: reservation } = await supabase
    .from("reservations")
    .select("id")
    .eq("id", reservationId)
    .eq("host_id", user.id)
    .maybeSingle();
  if (!reservation) return { error: t("reservationRequired") };

  const rawCost = String(formData.get("estimatedCost") ?? "").trim();
  const estimatedCost = rawCost ? Number(rawCost) : null;

  const { error } = await supabase.from("reservation_incidents").insert({
    reservation_id: reservationId,
    reporter_id: user.id,
    type: pickType(formData.get("type")),
    description,
    occurred_on: occurredOn || new Date().toISOString().slice(0, 10),
    estimated_cost:
      estimatedCost != null && Number.isFinite(estimatedCost)
        ? estimatedCost
        : null,
    attachments: urls(formData.get("attachments")),
  });
  if (error) {
    const low = error.message.toLowerCase();
    if (
      low.includes("does not exist") ||
      low.includes("schema cache") ||
      low.includes("could not find") ||
      low.includes("row-level")
    ) {
      return { error: t("migrationNeeded") };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard/requests");
  revalidatePath(`/dashboard/requests/${reservationId}`);
  revalidatePath("/dashboard/incidents");
  return { ok: true };
}
