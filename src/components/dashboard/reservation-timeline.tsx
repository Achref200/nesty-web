import {
  CalendarPlus,
  Check,
  CheckCheck,
  Pencil,
  TimerOff,
  X,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReservationEvent } from "@/data/types";

const ICONS: Record<string, LucideIcon> = {
  created: CalendarPlus,
  confirmed: Check,
  completed: CheckCheck,
  rejected: X,
  cancelled: X,
  expired: TimerOff,
  modified: Pencil,
};

function fmt(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleString();
  }
}

/** Chronological, immutable audit trail of everything done to a reservation. */
export async function ReservationTimeline({
  events,
  locale,
}: {
  events: ReservationEvent[];
  locale: string;
}) {
  const t = await getTranslations("dashboard.timeline");
  if (events.length === 0) {
    return <p className="text-sm text-muted">{t("empty")}</p>;
  }

  return (
    <ol className="flex flex-col gap-4">
      {events.map((e) => {
        const Icon = ICONS[e.eventType] ?? CalendarPlus;
        return (
          <li key={e.id} className="flex gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-fill">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">
                {t(`event.${e.eventType}`)}
              </p>
              {e.reason && (
                <p className="text-[13px] text-muted">“{e.reason}”</p>
              )}
              <p className="text-xs text-muted-soft">{fmt(e.createdAt, locale)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
