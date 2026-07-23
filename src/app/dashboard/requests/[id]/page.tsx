import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReservationItem } from "@/components/dashboard/reservation-item";
import { ReservationTimeline } from "@/components/dashboard/reservation-timeline";
import { IncidentForm } from "@/components/dashboard/incident-form";
import { getReservationDetail } from "@/lib/queries";
import { formatDinars } from "@/lib/utils";
import type { IncidentStatus } from "@/data/types";

export const metadata = { robots: { index: false, follow: false } };

const INCIDENT_VARIANT: Record<
  IncidentStatus,
  "solid" | "soft" | "muted" | "outline"
> = {
  created: "soft",
  under_review: "solid",
  resolved: "outline",
  closed: "muted",
};

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-soft">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

export default async function ReservationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [detail, t, tIncident, locale] = await Promise.all([
    getReservationDetail(params.id),
    getTranslations("dashboard.detail"),
    getTranslations("dashboard.incidents"),
    getLocale(),
  ]);

  if (!detail) notFound();
  const { reservation, timeline, incidents } = detail;

  const createdLabel = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(reservation.createdAt));

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link
        href="/dashboard/requests"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> {t("back")}
      </Link>

      {/* Summary + lifecycle actions */}
      <ReservationItem reservation={reservation} manage showSeeker />

      <Card className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Fact label={t("reference")} value={reservation.reference} />
        <Fact label={t("city")} value={reservation.city || "—"} />
        <Fact label={t("guests")} value={String(reservation.guests)} />
        <Fact
          label={t("total")}
          value={
            reservation.estimatedTotal
              ? formatDinars(reservation.estimatedTotal)
              : "—"
          }
        />
        <Fact label={t("createdOn")} value={createdLabel} />
        {reservation.cancellationReason && (
          <div className="col-span-2 sm:col-span-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-soft">
              {t("cancellationReason")}
            </p>
            <p className="mt-0.5 text-sm text-ink">
              {reservation.cancellationReason}
            </p>
          </div>
        )}
        {reservation.note && (
          <div className="col-span-2 sm:col-span-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-soft">
              {t("note")}
            </p>
            <p className="mt-0.5 text-sm text-ink">{reservation.note}</p>
          </div>
        )}
      </Card>

      {/* Incidents */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center">
          <h2 className="font-display text-lg font-bold tracking-tight">
            {tIncident("title")}
          </h2>
          <div className="ml-auto">
            <IncidentForm reservationId={reservation.id} />
          </div>
        </div>
        {incidents.length === 0 ? (
          <p className="text-sm text-muted">{tIncident("none")}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {incidents.map((inc) => (
              <Card key={inc.id} className="flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink">
                    {tIncident(`types.${inc.type}`)}
                  </p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    {inc.description}
                  </p>
                  {inc.estimatedCost != null && (
                    <p className="mt-1 text-xs text-muted-soft">
                      {tIncident("estimatedCost")}:{" "}
                      {formatDinars(inc.estimatedCost)}
                    </p>
                  )}
                  {inc.resolution && (
                    <p className="mt-1 text-xs text-ink">
                      {tIncident("resolution")}: {inc.resolution}
                    </p>
                  )}
                </div>
                <Badge variant={INCIDENT_VARIANT[inc.status]}>
                  {tIncident(`status.${inc.status}`)}
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Timeline */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold tracking-tight">
          {t("timeline")}
        </h2>
        <Card>
          <ReservationTimeline events={timeline} locale={locale} />
        </Card>
      </section>
    </div>
  );
}
