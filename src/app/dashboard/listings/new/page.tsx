import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ListingWizard } from "@/components/dashboard/listing-wizard/listing-wizard";

export default async function NewListingPage() {
  const t = await getTranslations("dashboard.wizard");
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/listings"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> {t("back")}
      </Link>
      <ListingWizard />
    </div>
  );
}
