"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Save, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteListing,
  disableListing,
  publishListing,
  reactivateListing,
  updateListingPrice,
} from "@/lib/actions/listings";
import type { ListingStatus } from "@/lib/listings/schema";

export function ListingControls({
  id,
  price,
  status,
}: {
  id: string;
  price: number;
  status: ListingStatus;
}) {
  const router = useRouter();
  const t = useTranslations("dashboard.controls");
  const [value, setValue] = useState(String(price));
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const isPublished = status === "published";
  const isDisabled = status === "disabled";

  function savePrice() {
    const next = Number(value);
    if (!Number.isFinite(next) || next <= 0) {
      toast.error(t("invalidPrice"));
      return;
    }
    startTransition(async () => {
      const res = await updateListingPrice(id, next);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(t("priceUpdated"));
        router.refresh();
      }
    });
  }

  function toggleStatus() {
    startTransition(async () => {
      const res = isPublished
        ? await disableListing(id)
        : isDisabled
          ? await reactivateListing(id)
          : await publishListing(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(isPublished ? t("toastHidden") : t("toastLive"));
        router.refresh();
      }
    });
  }

  function remove() {
    startTransition(async () => {
      const res = await deleteListing(id);
      // deleteListing redirects on success; only errors return here.
      if (res?.error) toast.error(res.error);
    });
  }

  return (
    <Card className="flex flex-col gap-5 p-5">
      <div>
        <p className="font-display text-[15px] font-bold">{t("priceControl")}</p>
        <p className="mt-0.5 text-[13px] text-muted">
          {t("priceHint")}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="pr-14"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">
              TND
            </span>
          </div>
          <Button
            onClick={savePrice}
            disabled={pending || value === String(price)}
            size="default"
          >
            <Save className="h-4 w-4" /> {t("save")}
          </Button>
        </div>
      </div>

      <div className="h-px bg-separator" />

      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-bold">{t("visibility")}</p>
          <p className="mt-0.5 text-[13px] text-muted">
            {isPublished ? t("visibilityLive") : t("visibilityHidden")}
          </p>
        </div>
        <Button variant="outline" onClick={toggleStatus} disabled={pending}>
          {isPublished ? (
            <>
              <EyeOff className="h-4 w-4" /> {t("hide")}
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" /> {t("publish")}
            </>
          )}
        </Button>
      </div>

      <div className="h-px bg-separator" />

      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-bold">{t("deleteTitle")}</p>
          <p className="mt-0.5 text-[13px] text-muted">
            {t("deleteHint")}
          </p>
        </div>
        {confirming ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setConfirming(false)}
              disabled={pending}
            >
              {t("cancel")}
            </Button>
            <Button variant="danger" onClick={remove} disabled={pending}>
              <Trash2 className="h-4 w-4" /> {t("confirm")}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setConfirming(true)}
            disabled={pending}
          >
            <Trash2 className="h-4 w-4" /> {t("delete")}
          </Button>
        )}
      </div>
    </Card>
  );
}
