/**
 * Booking availability & guard rules for the agency dashboard.
 *
 * These are pure, side-effect-free functions so they can be unit-tested in
 * isolation and reused by server actions. The rules they encode:
 *
 *  - A listing can't be hidden or deleted while it has an active (pending or
 *    confirmed) reservation that is still upcoming or ongoing.
 *  - A reservation can't be confirmed (or created) for a window that already
 *    overlaps another active reservation — no double-booking.
 *
 * Occupancy model: a "stay" holds `[check-in day, check-out day)` — the
 * check-out day is free, so back-to-back stays are allowed. A "visit" holds a
 * one-hour viewing slot from its start time.
 */

import type { ReservationStatus, ReservationType } from "@/data/types";

const DAY_MS = 86_400_000;
const VISIT_SLOT_MS = 60 * 60 * 1000; // a viewing occupies a 1-hour slot

/** The minimal reservation shape these rules need. `Reservation` satisfies it. */
export interface ReservationLike {
  id: string;
  listingId: string;
  type: ReservationType;
  /** ISO date — visit: date + time; stay: check-in. */
  start: string;
  /** ISO date — stay check-out (exclusive). */
  end?: string;
  status: ReservationStatus;
}

/** Statuses that hold a slot. Cancelled/completed reservations never block. */
export const ACTIVE_STATUSES: ReservationStatus[] = ["pending", "confirmed"];

export interface Interval {
  start: number;
  end: number;
}

function startOfDay(ms: number): number {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** The time window a reservation occupies, in epoch ms `[start, end)`. */
export function occupancy(r: ReservationLike): Interval {
  const startMs = new Date(r.start).getTime();
  if (r.type === "stay") {
    const checkIn = startOfDay(startMs);
    const checkOut = r.end ? startOfDay(new Date(r.end).getTime()) : checkIn + DAY_MS;
    // Guard against inverted/empty ranges — always hold at least one night.
    return { start: checkIn, end: Math.max(checkOut, checkIn + DAY_MS) };
  }
  // Visit: a one-hour viewing slot.
  return { start: startMs, end: startMs + VISIT_SLOT_MS };
}

/** True when two half-open intervals `[start, end)` overlap. */
export function intervalsOverlap(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

export function isActiveStatus(status: ReservationStatus): boolean {
  return status === "pending" || status === "confirmed";
}

/** Active and not entirely in the past (still upcoming or ongoing). */
export function isBlocking(r: ReservationLike, now: number = Date.now()): boolean {
  if (!isActiveStatus(r.status)) return false;
  return occupancy(r).end > now;
}

/** Every active, upcoming/ongoing reservation for a listing. */
export function blockingReservations(
  reservations: ReservationLike[],
  now: number = Date.now(),
): ReservationLike[] {
  return reservations.filter((r) => isBlocking(r, now));
}

export interface RuleResult {
  allowed: boolean;
  reason?: string;
  conflicts: ReservationLike[];
}

function ok(): RuleResult {
  return { allowed: true, conflicts: [] };
}

/**
 * Whether a listing may be hidden or deleted right now. Blocked while any
 * active reservation is still upcoming or ongoing.
 */
export function canModifyListing(
  reservations: ReservationLike[],
  now: number = Date.now(),
): RuleResult {
  const conflicts = blockingReservations(reservations, now);
  if (conflicts.length === 0) return ok();
  const confirmed = conflicts.filter((r) => r.status === "confirmed").length;
  const pending = conflicts.length - confirmed;
  const parts: string[] = [];
  if (confirmed) parts.push(`${confirmed} confirmed`);
  if (pending) parts.push(`${pending} pending`);
  return {
    allowed: false,
    reason: `This listing has ${parts.join(" and ")} booking${
      conflicts.length === 1 ? "" : "s"
    } coming up. Cancel or complete them before hiding or deleting it.`,
    conflicts,
  };
}

/**
 * Whether `incoming` can be reserved given the listing's other reservations.
 * Blocked when it overlaps any active (pending or confirmed) reservation.
 */
export function canReserve(
  incoming: ReservationLike,
  existing: ReservationLike[],
): RuleResult {
  const window = occupancy(incoming);
  const conflicts = existing.filter(
    (r) =>
      r.id !== incoming.id &&
      r.listingId === incoming.listingId &&
      isActiveStatus(r.status) &&
      intervalsOverlap(window, occupancy(r)),
  );
  if (conflicts.length === 0) return ok();
  return {
    allowed: false,
    reason:
      "These dates overlap a reservation that's already pending or confirmed for this listing.",
    conflicts,
  };
}

/**
 * Whether a pending reservation can be confirmed. Blocked when its window
 * overlaps another reservation that is *already confirmed* — the strict
 * no-double-booking rule.
 */
export function canConfirmReservation(
  target: ReservationLike,
  others: ReservationLike[],
): RuleResult {
  const window = occupancy(target);
  const conflicts = others.filter(
    (r) =>
      r.id !== target.id &&
      r.listingId === target.listingId &&
      r.status === "confirmed" &&
      intervalsOverlap(window, occupancy(r)),
  );
  if (conflicts.length === 0) return ok();
  return {
    allowed: false,
    reason:
      "Another reservation for these dates is already confirmed. Decline it first to confirm this one.",
    conflicts,
  };
}
