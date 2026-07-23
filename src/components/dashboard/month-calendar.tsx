"use client";

import { useMemo, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, CalendarX2, Lock, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReservationItem } from "./reservation-item";
import {
  computeCalendar,
  type BlockLike,
  type ReservationLike,
} from "@/lib/availability";
import { blockDates, unblockDates } from "@/lib/actions/reservations";
import { cn } from "@/lib/utils";
import {
  type AvailabilityBlock,
  type DayState,
  type Reservation,
} from "@/data/types";

function dayKey(d: Date) {
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}-${`${d.getDate()}`.padStart(2, "0")}`;
}

function toResLike(r: Reservation): ReservationLike {
  return {
    id: r.id,
    listingId: r.listingId,
    type: r.type,
    start: r.start,
    end: r.end,
    status: r.status,
  };
}

const STATE_DOT: Record<Exclude<DayState, "available">, string> = {
  confirmed: "bg-ink",
  pending: "border border-ink bg-transparent",
  blocked: "bg-muted-soft",
};

const selectClass =
  "h-11 rounded-xl border border-separator bg-card px-3 text-sm font-semibold text-ink outline-none focus:border-ink";

export function MonthCalendar({
  reservations,
  blocks,
  listings,
}: {
  reservations: Reservation[];
  blocks: AvailabilityBlock[];
  listings: { id: string; title: string }[];
}) {
  const t = useTranslations("dashboard.calendar");
  const months = t.raw("months") as string[];
  const week = t.raw("weekdays") as string[];
  const router = useRouter();
  const [saving, startTransition] = useTransition();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [month, setMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selected, setSelected] = useState<Date>(today);
  const [scope, setScope] = useState<string>("all");
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const scoped = scope === "all";
  const resList = scoped
    ? reservations
    : reservations.filter((r) => r.listingId === scope);
  const blockList = scoped
    ? blocks
    : blocks.filter((b) => b.listingId === scope);

  const dayStates = useMemo(() => {
    const blockLikes: BlockLike[] = blockList.map((b) => ({
      id: b.id,
      listingId: b.listingId,
      startDate: b.startDate,
      endDate: b.endDate,
    }));
    return computeCalendar(resList.map(toResLike), blockLikes);
  }, [resList, blockList]);

  const year = month.getFullYear();
  const m = month.getMonth();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const firstDow = (new Date(year, m, 1).getDay() + 6) % 7; // Monday-first

  const selKey = dayKey(selected);
  const dayReservations = resList.filter((r) => {
    const s = new Date(r.start);
    const first = new Date(s.getFullYear(), s.getMonth(), s.getDate());
    if (r.type === "visit" || !r.end) return dayKey(first) === selKey;
    const end = new Date(r.end);
    for (let d = new Date(first); d < end; d.setDate(d.getDate() + 1)) {
      if (dayKey(new Date(d)) === selKey) return true;
    }
    return false;
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function submitBlock() {
    if (scoped) {
      toast.error(t("pickListing"));
      return;
    }
    if (!blockStart || !blockEnd) {
      toast.error(t("pickDates"));
      return;
    }
    startTransition(async () => {
      const res = await blockDates(scope, blockStart, blockEnd, blockReason);
      if (res.error) toast.error(res.error);
      else {
        toast.success(t("blocked"));
        setBlockStart("");
        setBlockEnd("");
        setBlockReason("");
        router.refresh();
      }
    });
  }

  function removeBlock(id: string) {
    startTransition(async () => {
      const res = await unblockDates(id);
      if (res.error) toast.error(res.error);
      else {
        toast.success(t("unblocked"));
        router.refresh();
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-lg font-bold tracking-tight">
            {months[m]} {year}
          </h2>
          {listings.length > 0 && (
            <select
              aria-label={t("listing")}
              className={cn(selectClass, "ml-1 h-9")}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
            >
              <option value="all">{t("allListings")}</option>
              {listings.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          )}
          <div className="ml-auto flex gap-1.5">
            <button
              type="button"
              aria-label={t("prevMonth")}
              onClick={() => setMonth(new Date(year, m - 1, 1))}
              className="grid h-9 w-9 place-items-center rounded-pill bg-fill hover:bg-separator"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={t("nextMonth")}
              onClick={() => setMonth(new Date(year, m + 1, 1))}
              className="grid h-9 w-9 place-items-center rounded-pill bg-fill hover:bg-separator"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1">
          {week.map((w, i) => (
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
            const state = dayStates.get(k);
            return (
              <button
                key={k}
                type="button"
                onClick={() => setSelected(date)}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center rounded-pill text-sm font-semibold transition-colors",
                  isSelected ? "bg-ink text-paper" : "text-ink hover:bg-fill",
                  isToday && !isSelected && "ring-1 ring-inset ring-ink",
                  state === "blocked" && !isSelected && "bg-fill/60",
                )}
              >
                {d}
                <span className="mt-0.5 flex h-1.5 items-center justify-center">
                  {state && state !== "available" && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-pill",
                        isSelected ? "bg-paper" : STATE_DOT[state],
                      )}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-separator pt-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-pill bg-ink" /> {t("confirmed")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-pill border border-ink" />{" "}
            {t("pending")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-pill bg-muted-soft" /> {t("blocked")}
          </span>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="mb-3 font-display text-lg font-bold tracking-tight">
            {selected.getDate()} {months[selected.getMonth()]}
          </h3>
          {dayReservations.length === 0 ? (
            <Card className="flex items-center gap-3 text-muted">
              <CalendarX2 className="h-5 w-5 text-muted-soft" />
              <span className="text-[15px]">{t("nothingBooked")}</span>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {dayReservations.map((r) => (
                <ReservationItem
                  key={r.id}
                  reservation={r}
                  manage
                  showSeeker
                  href={`/dashboard/requests/${r.id}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Manual availability blocks */}
        <Card className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <h3 className="font-display text-base font-bold">
              {t("blockTitle")}
            </h3>
          </div>
          {scoped ? (
            <p className="text-sm text-muted">{t("pickListing")}</p>
          ) : (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  type="date"
                  aria-label={t("from")}
                  value={blockStart}
                  onChange={(e) => setBlockStart(e.target.value)}
                  className="h-11"
                />
                <Input
                  type="date"
                  aria-label={t("to")}
                  value={blockEnd}
                  onChange={(e) => setBlockEnd(e.target.value)}
                  className="h-11"
                />
              </div>
              <Input
                aria-label={t("reason")}
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder={t("reasonPlaceholder")}
                className="h-11"
              />
              <Button size="sm" disabled={saving} onClick={submitBlock}>
                <Plus className="h-4 w-4" /> {t("blockButton")}
              </Button>

              {blockList.length > 0 && (
                <ul className="flex flex-col gap-1.5 border-t border-separator pt-3">
                  {blockList.map((b) => (
                    <li
                      key={b.id}
                      className="flex items-center gap-2 text-sm text-ink"
                    >
                      <span className="flex-1">
                        {b.startDate} → {b.endDate}
                        {b.reason ? ` · ${b.reason}` : ""}
                      </span>
                      <button
                        type="button"
                        aria-label={t("unblock")}
                        disabled={saving}
                        onClick={() => removeBlock(b.id)}
                        className="grid h-7 w-7 place-items-center rounded-pill bg-fill hover:bg-separator"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
