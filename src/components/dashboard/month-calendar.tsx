"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarX2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ReservationItem } from "./reservation-item";
import { cn } from "@/lib/utils";
import { type Reservation } from "@/data/types";

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function occupiedKeys(r: Reservation): string[] {
  const s = new Date(r.start);
  const first = new Date(s.getFullYear(), s.getMonth(), s.getDate());
  if (r.type === "visit" || !r.end) return [dayKey(first)];
  const end = new Date(r.end);
  const out: string[] = [];
  for (let d = new Date(first); d < end; d.setDate(d.getDate() + 1)) {
    out.push(dayKey(new Date(d)));
  }
  return out.length ? out : [dayKey(first)];
}

export function MonthCalendar({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [month, setMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selected, setSelected] = useState<Date>(today);

  const active = reservations.filter((r) => r.status !== "cancelled");
  const marked = useMemo(() => {
    const map = new Map<string, { stay: boolean; visit: boolean }>();
    active.forEach((r) => {
      const isStay = r.type === "stay";
      occupiedKeys(r).forEach((k) => {
        const cur = map.get(k) ?? { stay: false, visit: false };
        if (isStay) cur.stay = true;
        else cur.visit = true;
        map.set(k, cur);
      });
    });
    return map;
  }, [active]);

  const year = month.getFullYear();
  const m = month.getMonth();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const firstDow = (new Date(year, m, 1).getDay() + 6) % 7; // Monday-first

  const monthPrefix = `${year}-${m}-`;
  const monthCount = useMemo(() => {
    const ids = new Set<string>();
    active.forEach((r) => {
      if (occupiedKeys(r).some((k) => k.startsWith(monthPrefix))) ids.add(r.id);
    });
    return ids.size;
  }, [active, monthPrefix]);

  const selKey = dayKey(selected);
  const dayItems = active.filter((r) => occupiedKeys(r).includes(selKey));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <Card>
        <div className="flex items-center">
          <h2 className="font-display text-lg font-bold tracking-tight">
            {MONTHS[m]} {year}
          </h2>
          <div className="ml-auto flex gap-1.5">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setMonth(new Date(year, m - 1, 1))}
              className="grid h-9 w-9 place-items-center rounded-pill bg-fill hover:bg-separator"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setMonth(new Date(year, m + 1, 1))}
              className="grid h-9 w-9 place-items-center rounded-pill bg-fill hover:bg-separator"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1">
          {WEEK.map((w, i) => (
            <div
              key={i}
              className="py-1 text-center text-xs font-bold text-muted-soft"
            >
              {w}
            </div>
          ))}
          {cells.map((d, i) => {
            if (d === null) return <div key={`e${i}`} />;
            const date = new Date(year, m, d);
            const k = dayKey(date);
            const isToday = k === dayKey(today);
            const isSelected = k === selKey;
            const types = marked.get(k);
            return (
              <button
                key={k}
                type="button"
                onClick={() => setSelected(date)}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center rounded-pill text-sm font-semibold transition-colors",
                  isSelected ? "bg-ink text-paper" : "text-ink hover:bg-fill",
                  isToday && !isSelected && "ring-1 ring-inset ring-brand",
                )}
              >
                {d}
                <span className="mt-0.5 flex h-1.5 items-center justify-center gap-0.5">
                  {types?.stay && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-pill",
                        isSelected ? "bg-paper" : "bg-ink",
                      )}
                    />
                  )}
                  {types?.visit && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-pill",
                        isSelected ? "bg-paper/80" : "bg-brand",
                      )}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-separator pt-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-pill bg-ink" /> Stay
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-pill bg-brand" /> Visit
          </span>
          <span className="ml-auto font-semibold text-ink-soft">
            {monthCount} booking{monthCount === 1 ? "" : "s"} this month
          </span>
        </div>
      </Card>

      <div>
        <h3 className="mb-3 font-display text-lg font-bold tracking-tight">
          {selected.getDate()} {MONTHS[selected.getMonth()]}
        </h3>
        {dayItems.length === 0 ? (
          <Card className="flex items-center gap-3 text-muted">
            <CalendarX2 className="h-5 w-5 text-muted-soft" />
            <span className="text-[15px]">Nothing booked on this day.</span>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {dayItems.map((r) => (
              <ReservationItem key={r.id} reservation={r} manage showGuest />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
