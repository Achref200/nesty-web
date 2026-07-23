"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import {
  deleteListing,
  disableListing,
  publishListing,
  reactivateListing,
} from "@/lib/actions/listings";
import type { ListingStatus } from "@/lib/listings/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

/** Manage menu (edit / hide / delete) for a listing row — shadcn primitives. */
export function ListingRowActions({
  id,
  status,
}: {
  id: string;
  status: ListingStatus;
}) {
  const [pending, start] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("dashboard.rowActions");

  const isPublished = status === "published";
  const isDisabled = status === "disabled";
  const editable = status === "draft" || status === "completed";

  function toggleHide() {
    start(async () => {
      const res = isPublished
        ? await disableListing(id)
        : isDisabled
          ? await reactivateListing(id)
          : await publishListing(id);
      if (res.error) toast.error(res.error);
      else {
        toast.success(isPublished ? t("toastHidden") : t("toastLive"));
        router.refresh();
      }
    });
  }

  function remove() {
    start(async () => {
      const res = await deleteListing(id);
      // deleteListing redirects on success; only errors return here.
      if (res?.error) {
        toast.error(res.error);
        setConfirmOpen(false);
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={t("manage")}
            disabled={pending}
            className={cn(
              "grid h-8 w-8 place-items-center rounded-lg border border-separator bg-card text-ink transition-colors hover:bg-fill",
              pending && "opacity-50",
            )}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link
              href={
                editable
                  ? `/dashboard/listings/${id}/edit`
                  : `/dashboard/listings/${id}`
              }
            >
              <Pencil className="h-4 w-4" /> {t("edit")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={toggleHide}>
            {isPublished ? (
              <>
                <EyeOff className="h-4 w-4" /> {t("hide")}
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> {t("publish")}
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            destructive
            onSelect={(e) => {
              e.preventDefault();
              setConfirmOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" /> {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteBody")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              variant="danger"
              disabled={pending}
              onClick={(e) => {
                e.preventDefault();
                remove();
              }}
            >
              <Trash2 className="h-4 w-4" /> {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
