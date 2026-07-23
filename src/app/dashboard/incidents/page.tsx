import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAgencyIncidents } from "@/lib/queries";
import type { IncidentStatus } from "@/data/types";

export const metadata: Metadata = {
  title: "Incidents",
  robots: { index: false, follow: false },
};

const STATUS_VARIANT: Record<
  IncidentStatus,
  "solid" | "soft" | "muted" | "outline"
> = {
  created: "soft",
  under_review: "solid",
  resolved: "outline",
  closed: "muted",
};

export default async function IncidentsPage() {
  const [t, incidents] = await Promise.all([
    getTranslations("dashboard.incidents"),
    getAgencyIncidents(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[15px] text-muted">{t("subtitle")}</p>

      {incidents.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-fill">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <p className="font-display text-lg font-bold">{t("emptyTitle")}</p>
          <p className="max-w-sm text-[15px] text-muted">{t("emptyBody")}</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {incidents.map((inc) => (
            <Link
              key={inc.id}
              href={`/dashboard/requests/${inc.reservationId}`}
            >
              <Card className="flex items-center gap-4 p-4 transition-colors hover:border-ink/20">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold">
                    {t(`types.${inc.type}`)}
                  </p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    {inc.reservationReference} · {inc.listingTitle}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[inc.status]}>
                  {t(`status.${inc.status}`)}
                </Badge>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
