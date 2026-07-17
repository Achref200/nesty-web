"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { setListingStatus, deleteListing } from "@/lib/actions/listings";
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
  hidden,
}: {
  id: string;
  hidden: boolean;
}) {
  const [pending, start] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  function toggleHide() {
    start(async () => {
      const res = await setListingStatus(id, hidden ? "active" : "hidden");
      if (res.error) toast.error(res.error);
      else {
        toast.success(hidden ? "Listing is live" : "Listing hidden");
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
            aria-label="Manage listing"
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
            <Link href={`/dashboard/listings/${id}`}>
              <Pencil className="h-4 w-4" /> Edit details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={toggleHide}>
            {hidden ? (
              <>
                <Eye className="h-4 w-4" /> Publish
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" /> Hide
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
            <Trash2 className="h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the place and all its data. A listing with
              upcoming bookings can&rsquo;t be deleted — cancel those first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="danger"
              disabled={pending}
              onClick={(e) => {
                e.preventDefault();
                remove();
              }}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
