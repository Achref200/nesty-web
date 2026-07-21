"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("dashboard.media");
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
      toast.success(t("toastUpdated"));
      setEditing(false);
    });
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-bold tracking-tight">{t("photos")}</h2>
          <p className="text-[13px] text-muted">
            {editing ? t("editHint") : t("viewHint")}
          </p>
        </div>

        {editing ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={cancelEdit} disabled={pending}>
              <X className="h-4 w-4" /> {t("cancel")}
            </Button>
            <Button onClick={save} disabled={pending}>
              <Save className="h-4 w-4" /> {t("savePhotos")}
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" /> {t("editPhotos")}
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
