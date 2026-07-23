import Image from "next/image";
import Link from "next/link";
import { Star, Building2, Eye, Heart, DoorOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListingRowActions } from "@/components/dashboard/listing-row-actions";
import { formatDinars } from "@/lib/utils";
import type { Listing } from "@/data/types";

export function ListingItem({ listing }: { listing: Listing }) {
  const t = useTranslations("dashboard.listing");
  const isDraft = listing.status === "draft" || listing.status === "completed";
  const isDisabled = listing.status === "disabled";
  const dim = listing.status !== "published";
  return (
    <Card className="flex items-center gap-4 p-3 transition-colors hover:border-ink/20">
      <Link
        href={`/dashboard/listings/${listing.id}`}
        className="flex min-w-0 flex-1 items-center gap-4"
      >
        <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-fill">
          {listing.cover ? (
            <Image
              src={listing.cover}
              alt={listing.title}
              fill
              sizes="80px"
              unoptimized
              className={dim ? "object-cover opacity-40" : "object-cover"}
            />
          ) : (
            <Building2 className="h-6 w-6 text-muted-soft" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold">{listing.title}</p>
          <p className="truncate text-[13px] text-muted">{listing.city}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              {listing.rating > 0 ? listing.rating.toFixed(2) : t("new")}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {listing.views}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {listing.saves}
            </span>
            <span className="inline-flex items-center gap-1">
              <DoorOpen className="h-3.5 w-3.5" />
              {listing.tours}
            </span>
          </div>
        </div>
      </Link>
      <div className="flex flex-col items-end gap-2">
        <span className="font-display text-[15px] font-extrabold">
          {formatDinars(listing.pricePerMonth)}
        </span>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline">
            {listing.rentalTerm === "shortTerm" ? t("termShort") : t("termLong")}
          </Badge>
          {isDraft ? (
            <Badge variant="outline">{t("draft")}</Badge>
          ) : isDisabled ? (
            <Badge variant="soft">{t("hidden")}</Badge>
          ) : (
            <Badge variant={listing.state === "reserved" ? "solid" : "soft"}>
              {listing.state === "reserved" ? t("reserved") : t("available")}
            </Badge>
          )}
          <ListingRowActions id={listing.id} status={listing.status} />
        </div>
      </div>
    </Card>
  );
}
