"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Save, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { updateListingMedia } from "@/lib/actions/listings";

export function ListingMediaEditor({
  id,
  cover,
  gallery,
}: {
  id: string;
  cover: string | null;
  gallery: string[];
}) {
  const initialUrls = useMemo(() => {
    if (gallery.length > 0) return gallery;
    return cover ? [cover] : [];
  }, [cover, gallery]);

  const [editing, setEditing] = useState(false);
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [pending, startTransition] = useTransition();

  function cancelEdit() {
    setUrls(initialUrls);
    setEditing(false);
  }

  function save() {
    startTransition(async () => {
      const res = await updateListingMedia(id, urls);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Photos updated");
      setEditing(false);
    });
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-bold tracking-tight">Photos</h2>
          <p className="text-[13px] text-muted">
            {editing
              ? "Edit mode is active. Add or remove photos, then save changes."
              : "View mode is locked. Photos cannot be changed until you switch to edit mode."}
          </p>
        </div>

        {editing ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={cancelEdit} disabled={pending}>
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={save} disabled={pending}>
              <Save className="h-4 w-4" /> Save photos
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" /> Edit photos
          </Button>
        )}
      </div>

      <ImageUpload
        initialUrls={urls}
        editable={editing}
        onChange={(next) => setUrls(next)}
      />
    </Card>
  );
}
