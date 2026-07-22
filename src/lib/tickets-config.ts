/**
 * Ticket enums + option lists. Kept free of server-only imports so both the
 * server queries (`lib/tickets.ts`) and client forms can share them.
 */
export type TicketType =
  | "bug"
  | "error"
  | "failure"
  | "feature_request"
  | "question"
  | "other";
export type TicketSeverity = "low" | "medium" | "high" | "critical";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketArea =
  | "listings"
  | "reservations"
  | "calendar"
  | "billing"
  | "account"
  | "verification"
  | "tours_3d"
  | "app"
  | "other";

export const TICKET_TYPES: readonly TicketType[] = [
  "bug",
  "error",
  "failure",
  "question",
  "feature_request",
  "other",
];

export const TICKET_SEVERITIES: readonly TicketSeverity[] = [
  "low",
  "medium",
  "high",
  "critical",
];

export const TICKET_AREAS: readonly TicketArea[] = [
  "listings",
  "reservations",
  "calendar",
  "billing",
  "account",
  "verification",
  "tours_3d",
  "app",
  "other",
];

const TICKET_IMAGE_RE =
  /https?:\/\/\S+?\.(?:png|jpe?g|gif|webp|svg)(?:\?\S*)?|https?:\/\/res\.cloudinary\.com\/\S+/gi;

/**
 * Splits a ticket body into readable text + a list of image URLs. Screenshots
 * may live in the `attachments` array (once the migration is applied) and/or be
 * folded into the description as links (before it is), so this merges both and
 * strips the raw URLs / "Screenshots" marker out of the visible text.
 */
export function splitTicketBody(
  body: string | null | undefined,
  attachments: string[] = [],
): { text: string; images: string[] } {
  const raw = body ?? "";
  const found = raw.match(TICKET_IMAGE_RE) ?? [];
  const text = raw
    .replace(/—?\s*Screenshots\s*—?/gi, "")
    .replace(TICKET_IMAGE_RE, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const images = Array.from(new Set([...(attachments ?? []), ...found]));
  return { text, images };
}
