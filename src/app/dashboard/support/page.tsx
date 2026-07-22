import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LifeBuoy, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAgencyTickets, type TicketStatus } from "@/lib/tickets";

export const metadata: Metadata = {
  title: "Support",
  robots: { index: false, follow: false },
};

const STATUS_VARIANT: Record<
  TicketStatus,
  "solid" | "soft" | "muted" | "outline"
> = {
  open: "solid",
  in_progress: "soft",
  resolved: "outline",
  closed: "muted",
};

export default async function SupportPage() {
  const [t, tickets] = await Promise.all([
    getTranslations("dashboard.support"),
    getAgencyTickets(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <p className="text-[15px] text-muted">{t("subtitle")}</p>
        <Button asChild size="sm" className="ml-auto">
          <Link href="/dashboard/support/new">
            <Plus className="h-4 w-4" /> {t("new")}
          </Link>
        </Button>
      </div>

      {tickets.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-fill">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <p className="font-display text-lg font-bold">{t("emptyTitle")}</p>
          <p className="max-w-sm text-[15px] text-muted">{t("emptyBody")}</p>
          <Button asChild size="sm" className="mt-1">
            <Link href="/dashboard/support/new">
              <Plus className="h-4 w-4" /> {t("openFirst")}
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {tickets.map((ticket) => (
            <Link key={ticket.id} href={`/dashboard/support/${ticket.id}`}>
              <Card className="flex items-center gap-4 p-4 transition-colors hover:border-ink/20">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold">
                    {ticket.subject}
                  </p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    {t(`areas.${ticket.area ?? "other"}`)} ·{" "}
                    {t(`types.${ticket.type}`)}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[ticket.status]}>
                  {t(`status.${ticket.status}`)}
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
