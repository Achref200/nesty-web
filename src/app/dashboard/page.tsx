import Link from "next/link";
import {
  Inbox,
  CalendarCheck,
  Building2,
  BadgeCheck,
  Plus,
  Eye,
  Heart,
  DoorOpen,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ReservationItem } from "@/components/dashboard/reservation-item";
import { ListingItem } from "@/components/dashboard/listing-item";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { getDashboardData } from "@/lib/queries";
import { isActive } from "@/data/types";

export default async function OverviewPage() {
  const t = await getTranslations("dashboard.overview");
  const data = await getDashboardData();
  if (!data) return null;

  const now = Date.now();
  const upcoming = data.reservations.filter(
    (r) => isActive(r.status) && new Date(r.start).getTime() >= now - 864e5,
  );
  const confirmed = data.reservations.filter(
    (r) => r.status === "confirmed",
  ).length;
  const reserved = data.listings.filter((l) => l.state === "reserved").length;

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[15px] text-muted">
        {t.rich("welcome", {
          name: data.fullName,
          b: (chunks) => <span className="font-semibold text-ink">{chunks}</span>,
        })}
      </p>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Inbox} value={`${data.pending}`} label={t("pendingRequests")} />
        <StatCard
          icon={CalendarCheck}
          value={`${upcoming.length}`}
          label={t("upcoming")}
        />
        <StatCard
          icon={Building2}
          value={`${data.listings.length}`}
          label={t("activeListings")}
        />
        <StatCard
          icon={BadgeCheck}
          value={`${confirmed}`}
          label={t("confirmed")}
        />
      </section>

      <section>
        <div className="mb-4 flex items-center">
          <h2 className="font-display text-lg font-bold tracking-tight">
            {t("engagement")}
          </h2>
          <Button asChild variant="ghost" size="sm" className="ml-auto">
            <Link href="/dashboard/listings">{t("byListing")}</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatCard
            icon={Eye}
            value={`${data.totals.views}`}
            label={t("totalViews")}
          />
          <StatCard
            icon={Heart}
            value={`${data.totals.saves}`}
            label={t("totalSaves")}
          />
          <StatCard
            icon={DoorOpen}
            value={`${data.totals.tours}`}
            label={t("tourRequests")}
          />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-4 flex items-center">
            <h2 className="font-display text-lg font-bold tracking-tight">
              {t("nextUp")}
            </h2>
            <Button asChild variant="ghost" size="sm" className="ml-auto">
              <Link href="/dashboard/requests">{t("viewAll")}</Link>
            </Button>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-[15px] text-muted">
              {t("noUpcoming")}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.slice(0, 4).map((r) => (
                <ReservationItem key={r.id} reservation={r} manage showSeeker />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-4 flex items-center">
            <h2 className="font-display text-lg font-bold tracking-tight">
              {t("portfolio")}
            </h2>
            <Button asChild variant="ghost" size="sm" className="ml-auto">
              <Link href="/dashboard/listings">{t("manage")}</Link>
            </Button>
          </div>
          {data.listings.length === 0 ? (
            <Button asChild size="sm">
              <Link href="/dashboard/listings/new">
                <Plus className="h-4 w-4" /> {t("addFirst")}
              </Link>
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              {data.listings.slice(0, 4).map((l) => (
                <ListingItem key={l.id} listing={l} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
