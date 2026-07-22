"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import {
  TICKET_AREAS,
  TICKET_SEVERITIES,
  TICKET_TYPES,
  type TicketArea,
  type TicketSeverity,
  type TicketType,
} from "@/lib/tickets";

export type CreateTicketState = { error?: string };
export type ReplyState = { error?: string; ok?: boolean };

function pick<T extends string>(
  value: FormDataEntryValue | null,
  list: readonly T[],
  fallback: T,
): T {
  const v = String(value ?? "");
  return (list as readonly string[]).includes(v) ? (v as T) : fallback;
}

function urls(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Turns a raw Postgres/PostgREST error into a message an agency can act on.
 * The usual culprit right after shipping is a missing migration (no
 * `attachments` column / `ticket_messages` table / agency RLS policy).
 */
function describeDbError(
  error: { message?: string } | null,
  setupMsg: string,
  fallback: string,
): string {
  const low = (error?.message ?? "").toLowerCase();
  if (
    low.includes("does not exist") ||
    low.includes("schema cache") ||
    low.includes("could not find") ||
    low.includes("row-level security") ||
    low.includes("violates row-level")
  ) {
    return setupMsg;
  }
  return error?.message || fallback;
}

/** Open a new support ticket from the agency dashboard. */
export async function createTicket(
  _prev: CreateTicketState,
  formData: FormData,
): Promise<CreateTicketState> {
  const t = await getTranslations("dashboard.support.errors");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t("signedOut") };

  const subject = String(formData.get("subject") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!subject) return { error: t("subjectRequired") };
  if (!description) return { error: t("descriptionRequired") };

  const area: TicketArea = pick(formData.get("area"), TICKET_AREAS, "other");
  const type: TicketType = pick(formData.get("type"), TICKET_TYPES, "bug");
  const severity: TicketSeverity = pick(
    formData.get("severity"),
    TICKET_SEVERITIES,
    "medium",
  );
  const attachments = urls(formData.get("attachments"));

  const base = {
    reporter_id: user.id,
    reporter_role: "agency",
    type,
    severity,
    subject,
    area,
    status: "open" as const,
  };

  // Full insert (with the screenshots column).
  let { data, error } = await supabase
    .from("support_tickets")
    .insert({ ...base, description, attachments })
    .select("id")
    .single();

  // Graceful fallback: if the `attachments` column isn't there yet (migration
  // not applied), still create the ticket — fold the screenshot links into the
  // description so nothing is lost.
  if (error && /attachments/i.test(error.message ?? "")) {
    const withLinks = attachments.length
      ? `${description}\n\n— Screenshots —\n${attachments.join("\n")}`
      : description;
    ({ data, error } = await supabase
      .from("support_tickets")
      .insert({ ...base, description: withLinks })
      .select("id")
      .single());
  }

  if (error || !data) {
    console.error("[createTicket] insert failed:", error);
    return { error: describeDbError(error, t("setupNeeded"), t("failed")) };
  }

  revalidatePath("/dashboard/support");
  redirect(`/dashboard/support/${data.id}`);
}

/** Post a reply from the agency onto one of their tickets. */
export async function replyTicket(
  _prev: ReplyState,
  formData: FormData,
): Promise<ReplyState> {
  const t = await getTranslations("dashboard.support.errors");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t("signedOut") };

  const ticketId = String(formData.get("ticketId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!ticketId) return { error: t("failed") };
  if (!body) return { error: t("messageRequired") };

  const { error } = await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    author_id: user.id,
    author_role: "agency",
    body,
    attachments: urls(formData.get("attachments")),
  });
  if (error) {
    console.error("[replyTicket] insert failed:", error);
    return { error: describeDbError(error, t("setupNeeded"), t("failed")) };
  }

  revalidatePath(`/dashboard/support/${ticketId}`);
  return { ok: true };
}
