import type { Metadata } from "next";
import Link from "next/link";
import { Bell, ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { MarkAllReadButton } from "@/components/dashboard/mark-all-read";
import { getNotifications } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false, follow: false },
};

export default async function NotificationsPage() {
  const [t, locale, notifications] = await Promise.all([
    getTranslations("dashboard.notificationsPage"),
    getLocale(),
    getNotifications(),
  ]);

  const fmt = (iso: string) => {
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
  };

  const hasUnread = notifications.some((n) => !n.readAt);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <p className="text-[15px] text-muted">{t("subtitle")}</p>
        {hasUnread && (
          <div className="ml-auto">
            <MarkAllReadButton label={t("markAll")} />
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-fill">
            <Bell className="h-6 w-6" />
          </div>
          <p className="font-display text-lg font-bold">{t("emptyTitle")}</p>
          <p className="max-w-sm text-[15px] text-muted">{t("emptyBody")}</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => {
            const body = (
              <Card
                className={`flex items-center gap-3 p-4 ${
                  n.readAt ? "" : "border-ink/20"
                }`}
              >
                {!n.readAt && (
                  <span className="h-2 w-2 shrink-0 rounded-pill bg-ink" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">
                    {t(`type.${n.type}`, {
                      reference: n.reference ?? "",
                    })}
                  </p>
                  {n.reason && (
                    <p className="text-[13px] text-muted">“{n.reason}”</p>
                  )}
                  <p className="text-xs text-muted-soft">{fmt(n.createdAt)}</p>
                </div>
                {n.reservationId && (
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
                )}
              </Card>
            );
            return n.reservationId ? (
              <Link key={n.id} href={`/dashboard/requests/${n.reservationId}`}>
                {body}
              </Link>
            ) : (
              <div key={n.id}>{body}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
