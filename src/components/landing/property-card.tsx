import Image from "next/image";
import { Bath, BedDouble, MapPin, Ruler, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDinars } from "@/lib/utils";
import { TERM_LABEL, type ShowcaseListing } from "@/data/showcase";

/**
 * Premium property card used across the landing showcase. Photography carries
 * the color; the monochrome chrome keeps it calm and brand-consistent.
 */
export function PropertyCard({
  listing,
  className,
  priority = false,
}: {
  listing: ShowcaseListing;
  className?: string;
  priority?: boolean;
}) {
  const reserved = listing.state === "reserved";
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-separator bg-card shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.image}
          alt={`${listing.title} in ${listing.area}, ${listing.city}`}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          unoptimized
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent"
        />
        {listing.badge && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-pill bg-paper/90 px-2.5 py-1 text-[11px] font-bold text-ink shadow-card backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-pill bg-brand" />
            {listing.badge}
          </span>
        )}
        <span
          className={cn(
            "absolute right-3 top-3 rounded-pill px-2.5 py-1 text-[11px] font-bold shadow-card backdrop-blur",
            reserved ? "bg-ink text-paper" : "bg-paper/90 text-ink",
          )}
        >
          {reserved ? "Reserved" : "Available"}
        </span>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-semibold text-paper">
          <MapPin className="h-3.5 w-3.5" />
          {listing.area}, {listing.city}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-bold leading-tight text-ink">
            {listing.title}
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-ink">
            <Star className="h-3.5 w-3.5 fill-brand text-brand" />
            {listing.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-1 text-[13px] text-muted">
          {listing.agency} · {listing.reviews} reviews
        </p>

        <div className="mt-4 flex items-center gap-4 text-[13px] text-muted">
          {listing.beds > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" /> {listing.beds}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Bath className="h-4 w-4" /> {listing.baths}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ruler className="h-4 w-4" /> {listing.sqm} m²
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-separator pt-4">
          <div>
            <span className="font-display text-lg font-extrabold text-ink">
              {formatDinars(listing.price)}
            </span>
            <span className="text-[13px] text-muted"> / mo</span>
          </div>
          <Badge variant="outline">{TERM_LABEL[listing.term]}</Badge>
        </div>
      </div>
    </article>
  );
}
