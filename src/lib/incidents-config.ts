/**
 * Reservation-incident enums + option lists. No server-only imports so both the
 * server queries/actions and client forms can share them.
 */
export type IncidentType =
  | "conflict"
  | "double_booking"
  | "unavailable"
  | "access"
  | "payment"
  | "damage"
  | "cleaning"
  | "other";

export type IncidentStatus = "created" | "under_review" | "resolved" | "closed";

export const INCIDENT_TYPES: readonly IncidentType[] = [
  "conflict",
  "double_booking",
  "unavailable",
  "access",
  "payment",
  "damage",
  "cleaning",
  "other",
];

export const INCIDENT_STATUSES: readonly IncidentStatus[] = [
  "created",
  "under_review",
  "resolved",
  "closed",
];
