"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import {
  CalendarClock,
  CalendarDays,
  Check,
  CheckCheck,
  Clock,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "./status-badge";
import { formatDate, formatDinars } from "@/lib/utils";
import { remainingSoftLock } from "@/lib/availability";
import {
  cancelReservation,
  completeReservation,
  confirmReservation,
  rejectReservation,
  type ActionResult,
} from "@/lib/actions/reservations";
import { isOpen, type Reservation, type ReservationStatus } from "@/data/types";

function whenLabel(r: Reservation, nightsLabel: string, locale: string): string {
  const start = new Date(r.start);
  if (r.type === "visit") {
    const hh = start.getHours().toString().padStart(2, "0");
    const mm = start.getMinutes().toString().padStart(2, "0");
    return `${formatDate(start, locale)} · ${hh}:${mm}`;
  }
  const end = r.end ? new Date(r.end) : null;
  const first = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const nights = end
    ? Math.round((end.getTime() - first.getTime()) / 86_400_000)
    : 0;
  return `${formatDate(start, locale)} → ${end ? formatDate(end, locale) : ""} · ${nights} ${nightsLabel}`;
}

function formatRemaining(ms: number): string {
  const totalMin = Math.floor(ms / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function ReservationItem({
  reservation,
  manage = false,
  showSeeker = true,
  href,
}: {
  reservation: Reservation;
  manage?: boolean;
  showSeeker?: boolean;
  href?: string;
}) {
  const [status, setStatus] = useState<ReservationStatus>(reservation.status);
  const [pending, startTransition] = useTransition();
  const [reasonOpen, setReasonOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const router = useRouter();
  const t = useTranslations("dashboard.reservation");
  const locale = useLocale();
  const isVisit = reservation.type === "visit";

  // Keep the soft-lock countdown fresh without a heavy timer.
  useEffect(() => {
    if (status !== "pending") return;
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, [status]);

  const remaining = useMemo(
    () =>
      status === "pending" ? remainingSoftLock(reservation.expiresAt, now) : 0,
    [status, reservation.expiresAt, now],
  );

  function run(
    action: () => Promise<ActionResult>,
    next: ReservationStatus,
    successKey: string,
  ) {
    const prev = status;
    setStatus(next);
    startTransition(async () => {
      const res = await action();
      if (res?.error) {
        setStatus(prev);
        toast.error(res.error);
      } else {
        toast.success(t(successKey));
        router.refresh();
      }
    });
  }

  const isCancel = status === "confirmed"; // dialog is Cancel vs Decline

  function submitReason() {
    const value = reason.trim();
    if (isCancel && !value) {
      toast.error(t("reasonRequired"));
      return;
    }
    setReasonOpen(false);
    const id = reservation.id;
    if (isCancel) {
      run(() => cancelReservation(id, value), "cancelled", "toastCancelled");
    } else {
      run(() => rejectReservation(id, value), "rejected", "toastDeclined");
    }
    setReason("");
  }

  const title = (
    <p className="truncate text-[15px] font-bold">{reservation.listingTitle}</p>
  );

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-fill">
          {isVisit ? (
            <CalendarClock className="h-[18px] w-[18px]" />
          ) : (
            <CalendarDays className="h-[18px] w-[18px]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-pill bg-fill px-1.5 py-0.5 font-mono text-[11px] font-bold text-muted">
              {reservation.reference}
            </span>
            {status === "pending" && reservation.expiresAt && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-soft">
                <Clock className="h-3 w-3" />
                {remaining > 0
                  ? t("expiresIn", { time: formatRemaining(remaining) })
                  : t("expired")}
              </span>
            )}
          </div>
          {href ? (
            <Link href={href} className="hover:underline">
              {title}
            </Link>
          ) : (
            title
          )}
          <p className="text-[13px] text-muted">
            {whenLabel(reservation, t("nights"), locale)}
          </p>
          {showSeeker && (
            <p className="text-xs text-muted-soft">
              {reservation.seekerName} · {reservation.guests}{" "}
              {reservation.guests === 1 ? t("guest") : t("guests")}
              {reservation.estimatedTotal
                ? ` · ${formatDinars(reservation.estimatedTotal)}`
                : ""}
            </p>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      {manage && isOpen(status) && (
        <div className="mt-3 flex gap-2">
          {status === "pending" && (
            <Button
              size="sm"
              className="flex-1"
              disabled={pending}
              onClick={() =>
                run(
                  () => confirmReservation(reservation.id),
                  "confirmed",
                  "toastConfirmed",
                )
              }
            >
              <Check className="h-4 w-4" /> {t("confirm")}
            </Button>
          )}
          {status === "confirmed" && (
            <Button
              size="sm"
              className="flex-1"
              disabled={pending}
              onClick={() =>
                run(
                  () => completeReservation(reservation.id),
                  "completed",
                  "toastCompleted",
                )
              }
            >
              <CheckCheck className="h-4 w-4" /> {t("markDone")}
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            className="flex-1"
            disabled={pending}
            onClick={() => setReasonOpen(true)}
          >
            <X className="h-4 w-4" /> {isCancel ? t("cancel") : t("decline")}
          </Button>
        </div>
      )}

      <AlertDialog open={reasonOpen} onOpenChange={setReasonOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isCancel ? t("cancelTitle") : t("declineTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isCancel ? t("cancelBody") : t("declineBody")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder={t("reasonPlaceholder")}
            className="w-full rounded-xl border border-separator bg-card px-4 py-3 text-sm text-ink outline-none placeholder:text-muted-soft focus:border-ink"
          />
          <AlertDialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReasonOpen(false)}
            >
              {t("keep")}
            </Button>
            <Button variant="danger" size="sm" onClick={submitReason}>
              {isCancel ? t("cancelConfirm") : t("declineConfirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
