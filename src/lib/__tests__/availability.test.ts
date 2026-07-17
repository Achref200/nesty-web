import { describe, expect, it } from "vitest";
import {
  blockingReservations,
  canConfirmReservation,
  canModifyListing,
  canReserve,
  intervalsOverlap,
  isBlocking,
  occupancy,
  type ReservationLike,
} from "@/lib/availability";

// Fixed "now" (local time, no Z) so day-boundary math is timezone-stable.
const NOW = new Date("2026-08-01T09:00:00").getTime();

function res(partial: Partial<ReservationLike> = {}): ReservationLike {
  return {
    id: partial.id ?? "r1",
    listingId: partial.listingId ?? "L1",
    type: partial.type ?? "stay",
    start: partial.start ?? "2026-08-10T00:00:00",
    // Respect an explicitly-cleared end (`end: undefined`) vs. an omitted one.
    end: "end" in partial ? partial.end : "2026-08-14T00:00:00",
    status: partial.status ?? "confirmed",
  };
}

describe("occupancy", () => {
  it("holds a one-hour slot for a visit", () => {
    const o = occupancy(res({ type: "visit", start: "2026-08-10T15:00:00", end: undefined }));
    expect(o.end - o.start).toBe(60 * 60 * 1000);
  });

  it("holds [check-in, check-out) for a stay", () => {
    const o = occupancy(res({ start: "2026-08-10T00:00:00", end: "2026-08-14T00:00:00" }));
    expect(o.end - o.start).toBe(4 * 86_400_000);
  });

  it("holds at least one night for a stay with no end", () => {
    const o = occupancy(res({ type: "stay", start: "2026-08-10T00:00:00", end: undefined }));
    expect(o.end - o.start).toBe(86_400_000);
  });

  it("never returns an inverted range", () => {
    const o = occupancy(res({ start: "2026-08-14T00:00:00", end: "2026-08-10T00:00:00" }));
    expect(o.end).toBeGreaterThan(o.start);
  });
});

describe("intervalsOverlap", () => {
  it("detects overlap", () => {
    expect(intervalsOverlap({ start: 0, end: 10 }, { start: 5, end: 15 })).toBe(true);
  });
  it("treats touching intervals as non-overlapping (back-to-back)", () => {
    expect(intervalsOverlap({ start: 0, end: 10 }, { start: 10, end: 20 })).toBe(false);
  });
  it("detects containment", () => {
    expect(intervalsOverlap({ start: 0, end: 100 }, { start: 40, end: 50 })).toBe(true);
  });
});

describe("isBlocking", () => {
  it("blocks an upcoming confirmed reservation", () => {
    expect(isBlocking(res({ status: "confirmed" }), NOW)).toBe(true);
  });
  it("blocks an upcoming pending reservation", () => {
    expect(isBlocking(res({ status: "pending" }), NOW)).toBe(true);
  });
  it("does not block a cancelled reservation", () => {
    expect(isBlocking(res({ status: "cancelled" }), NOW)).toBe(false);
  });
  it("does not block a completed reservation", () => {
    expect(isBlocking(res({ status: "completed" }), NOW)).toBe(false);
  });
  it("does not block a reservation entirely in the past", () => {
    const past = res({ start: "2026-07-10T00:00:00", end: "2026-07-14T00:00:00" });
    expect(isBlocking(past, NOW)).toBe(false);
  });
  it("still blocks an ongoing reservation (started, not finished)", () => {
    const ongoing = res({ start: "2026-07-30T00:00:00", end: "2026-08-05T00:00:00" });
    expect(isBlocking(ongoing, NOW)).toBe(true);
  });
});

describe("canModifyListing (hide / delete guard)", () => {
  it("allows when there are no reservations", () => {
    expect(canModifyListing([], NOW).allowed).toBe(true);
  });

  it("allows when only cancelled or completed exist", () => {
    const r = canModifyListing(
      [res({ id: "a", status: "cancelled" }), res({ id: "b", status: "completed" })],
      NOW,
    );
    expect(r.allowed).toBe(true);
  });

  it("allows when active reservations are all in the past", () => {
    const past = res({ start: "2026-07-01T00:00:00", end: "2026-07-05T00:00:00" });
    expect(canModifyListing([past], NOW).allowed).toBe(true);
  });

  it("blocks when an upcoming confirmed reservation exists", () => {
    const r = canModifyListing([res({ status: "confirmed" })], NOW);
    expect(r.allowed).toBe(false);
    expect(r.reason).toMatch(/confirmed/);
    expect(r.conflicts).toHaveLength(1);
  });

  it("blocks when an upcoming pending reservation exists", () => {
    const r = canModifyListing([res({ status: "pending" })], NOW);
    expect(r.allowed).toBe(false);
    expect(r.reason).toMatch(/pending/);
  });

  it("mentions both counts when pending and confirmed coexist", () => {
    const r = canModifyListing(
      [
        res({ id: "a", status: "confirmed" }),
        res({ id: "b", status: "pending", start: "2026-08-20T00:00:00", end: "2026-08-22T00:00:00" }),
      ],
      NOW,
    );
    expect(r.allowed).toBe(false);
    expect(r.reason).toMatch(/confirmed/);
    expect(r.reason).toMatch(/pending/);
  });
});

describe("canReserve (no double-booking)", () => {
  const existingConfirmed = res({ id: "existing", status: "confirmed" }); // 08-10 → 08-14

  it("allows when there is no existing reservation", () => {
    expect(canReserve(res({ id: "new" }), []).allowed).toBe(true);
  });

  it("blocks a stay overlapping a confirmed stay", () => {
    const incoming = res({ id: "new", start: "2026-08-12T00:00:00", end: "2026-08-16T00:00:00" });
    const r = canReserve(incoming, [existingConfirmed]);
    expect(r.allowed).toBe(false);
    expect(r.conflicts.map((c) => c.id)).toContain("existing");
  });

  it("blocks a stay overlapping a pending stay", () => {
    const incoming = res({ id: "new", start: "2026-08-12T00:00:00", end: "2026-08-16T00:00:00" });
    const r = canReserve(incoming, [res({ id: "existing", status: "pending" })]);
    expect(r.allowed).toBe(false);
  });

  it("allows back-to-back stays (check-out == check-in)", () => {
    const incoming = res({ id: "new", start: "2026-08-14T00:00:00", end: "2026-08-18T00:00:00" });
    expect(canReserve(incoming, [existingConfirmed]).allowed).toBe(true);
  });

  it("allows non-overlapping dates", () => {
    const incoming = res({ id: "new", start: "2026-09-01T00:00:00", end: "2026-09-05T00:00:00" });
    expect(canReserve(incoming, [existingConfirmed]).allowed).toBe(true);
  });

  it("ignores cancelled/completed reservations", () => {
    const incoming = res({ id: "new", start: "2026-08-12T00:00:00", end: "2026-08-16T00:00:00" });
    const r = canReserve(incoming, [
      res({ id: "x", status: "cancelled" }),
      res({ id: "y", status: "completed" }),
    ]);
    expect(r.allowed).toBe(true);
  });

  it("ignores reservations on other listings", () => {
    const incoming = res({ id: "new", listingId: "L1", start: "2026-08-12T00:00:00", end: "2026-08-16T00:00:00" });
    const other = res({ id: "existing", listingId: "L2", status: "confirmed" });
    expect(canReserve(incoming, [other]).allowed).toBe(true);
  });

  it("does not conflict with itself", () => {
    expect(canReserve(existingConfirmed, [existingConfirmed]).allowed).toBe(true);
  });

  it("allows two visits at different hours on the same day", () => {
    const a = res({ id: "a", type: "visit", start: "2026-08-10T15:00:00", end: undefined });
    const b = res({ id: "b", type: "visit", start: "2026-08-10T17:00:00", end: undefined, status: "confirmed" });
    expect(canReserve(a, [b]).allowed).toBe(true);
  });

  it("blocks two visits in the same hour slot", () => {
    const a = res({ id: "a", type: "visit", start: "2026-08-10T15:00:00", end: undefined });
    const b = res({ id: "b", type: "visit", start: "2026-08-10T15:30:00", end: undefined, status: "confirmed" });
    expect(canReserve(a, [b]).allowed).toBe(false);
  });
});

describe("canConfirmReservation (strict confirm guard)", () => {
  const target = res({ id: "target", status: "pending", start: "2026-08-12T00:00:00", end: "2026-08-16T00:00:00" });

  it("blocks confirming over an already-confirmed overlap", () => {
    const confirmed = res({ id: "other", status: "confirmed" }); // 08-10 → 08-14 overlaps
    const r = canConfirmReservation(target, [confirmed]);
    expect(r.allowed).toBe(false);
    expect(r.conflicts.map((c) => c.id)).toContain("other");
  });

  it("allows confirming when the overlap is only pending (not yet confirmed)", () => {
    const otherPending = res({ id: "other", status: "pending" });
    expect(canConfirmReservation(target, [otherPending]).allowed).toBe(true);
  });

  it("allows confirming when there is no overlap", () => {
    const far = res({ id: "other", status: "confirmed", start: "2026-09-10T00:00:00", end: "2026-09-14T00:00:00" });
    expect(canConfirmReservation(target, [far]).allowed).toBe(true);
  });

  it("excludes the target reservation itself", () => {
    const selfConfirmed = res({ ...target, status: "confirmed" });
    expect(canConfirmReservation(selfConfirmed, [selfConfirmed]).allowed).toBe(true);
  });
});

describe("blockingReservations", () => {
  it("returns only active, upcoming/ongoing reservations", () => {
    const list: ReservationLike[] = [
      res({ id: "confirmed-future", status: "confirmed" }),
      res({ id: "pending-future", status: "pending", start: "2026-08-20T00:00:00", end: "2026-08-22T00:00:00" }),
      res({ id: "cancelled", status: "cancelled" }),
      res({ id: "past", status: "confirmed", start: "2026-07-01T00:00:00", end: "2026-07-03T00:00:00" }),
    ];
    const ids = blockingReservations(list, NOW).map((r) => r.id).sort();
    expect(ids).toEqual(["confirmed-future", "pending-future"]);
  });
});
