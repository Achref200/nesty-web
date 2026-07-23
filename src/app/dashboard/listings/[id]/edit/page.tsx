import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getListingDetail } from "@/lib/queries";
import { isEditable } from "@/lib/listings/schema";
import { listingToDraft } from "@/lib/listings/map";
import { ListingWizard } from "@/components/dashboard/listing-wizard/listing-wizard";

export default async function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  const t = await getTranslations("dashboard.wizard");
  const detail = await getListingDetail(params.id);
  if (!detail) notFound();

  // Only drafts are editable; published listings go back to the manage view.
  if (!isEditable(detail.listing.status)) {
    redirect(`/dashboard/listings/${params.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/dashboard/listings/${params.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> {t("back")}
      </Link>
      <ListingWizard
        initial={listingToDraft(detail.listing)}
        listingId={params.id}
      />
    </div>
  );
}
