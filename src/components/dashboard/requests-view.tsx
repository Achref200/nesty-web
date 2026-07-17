"use client";

import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import { ReservationItem } from "@/components/dashboard/reservation-item";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Reservation, ReservationStatus } from "@/data/types";

type FilterKey = "all" | ReservationStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export function RequestsView({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = {
      all: reservations.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    for (const r of reservations) c[r.status] += 1;
    return c;
  }, [reservations]);

  const items =
    filter === "all"
      ? reservations
      : reservations.filter((r) => r.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterKey)}>
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.key} value={f.key}>
              {f.label}
              <span
                className={cn(
                  "rounded-pill px-1.5 py-0.5 text-[11px] font-bold",
                  filter === f.key ? "bg-fill text-ink" : "bg-card/70 text-muted",
                )}
              >
                {counts[f.key]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-separator py-14 text-center">
          <Inbox className="h-6 w-6 text-muted-soft" />
          <p className="text-[15px] font-semibold text-ink">Nothing here yet</p>
          <p className="max-w-xs text-sm text-muted">
            When seekers book a visit or reserve dates, requests in this view land
            here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((r) => (
            <ReservationItem key={r.id} reservation={r} manage showGuest />
          ))}
        </div>
      )}
    </div>
  );
}
