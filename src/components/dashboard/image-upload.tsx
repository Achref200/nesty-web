"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  PHOTO_ACCEPT,
  PHOTO_ACCEPT_ATTR,
  PHOTO_MAX,
} from "@/lib/listings/schema";
import { Dots } from "@/components/ui/dots";
import { cn } from "@/lib/utils";

/**
 * Uploads photos straight from the agency's desktop to Cloudinary and exposes
 * the resulting delivery URLs to the form via hidden inputs:
 *   - `cover`   → the first photo (listing cover)
 *   - `gallery` → all photos, comma-separated (also feeds the 3D tour)
 */
export function ImageUpload({
  initialUrls = [],
  editable = true,
  onChange,
}: {
  initialUrls?: string[];
  editable?: boolean;
  onChange?: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("dashboard.upload");
  const seed = useMemo(() => initialUrls.join("|"), [initialUrls]);
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep the latest onChange without making it an effect dependency — an inline
  // `onChange` prop is a new function every render, so depending on it would
  // fire the notify effect endlessly (Maximum update depth exceeded).
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const notified = useRef(false);

  // Re-sync from the parent only when the *content* changes (seed), never on the
  // array reference — a default `[]` prop is a brand-new array every render, so
  // depending on `initialUrls` here loops forever and wipes freshly-added urls.
  // Return the same ref when unchanged so we don't trigger a spurious notify.
  useEffect(() => {
    setUrls((prev) => (prev.join("|") === seed ? prev : seed ? seed.split("|") : []));
  }, [seed]);

  // Notify the parent only on genuine user changes — skip the initial mount so
  // opening the wizard doesn't mark the draft dirty.
  useEffect(() => {
    if (!notified.current) {
      notified.current = true;
      return;
    }
    onChangeRef.current?.(urls);
  }, [urls]);

  async function handleFiles(files: FileList | null) {
    if (!editable) return;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const uploaded: string[] = [];
    let room = PHOTO_MAX - urls.length;

    for (const file of Array.from(files)) {
      if (room <= 0) {
        setError(t("tooMany", { max: PHOTO_MAX }));
        break;
      }
      if (!PHOTO_ACCEPT.includes(file.type)) {
        setError(t("badFormat"));
        continue;
      }
      try {
        uploaded.push(await uploadToCloudinary(file));
        room -= 1;
      } catch (e) {
        setError(e instanceof Error ? e.message : t("failed"));
      }
    }

    setUrls((prev) => [...prev, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(i: number) {
    if (!editable) return;
    setUrls((prev) => prev.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    if (!editable) return;
    setUrls((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="cover" value={urls[0] ?? ""} />
      <input type="hidden" name="gallery" value={urls.join(",")} />

      <div className="flex flex-wrap gap-3">
        {urls.map((url, i) => (
          <div
            key={url}
            className={cn(
              "relative h-24 w-24 overflow-hidden rounded-2xl bg-fill",
              i === 0 && "ring-2 ring-ink",
            )}
          >
            <Image
              src={url}
              alt={t("photoAlt", { n: i + 1 })}
              fill
              sizes="96px"
              unoptimized
              className="object-cover"
            />
            {editable && (
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white"
                aria-label={t("removePhoto")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {editable && urls.length > 1 && (
              <div className="absolute inset-x-1 bottom-1 flex justify-between">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white disabled:opacity-30"
                  aria-label={t("moveLeft")}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === urls.length - 1}
                  className="grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white disabled:opacity-30"
                  aria-label={t("moveRight")}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {i === 0 && (
              <span className="absolute bottom-1 left-1 rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-bold text-paper">
                {t("cover")}
              </span>
            )}
          </div>
        ))}

        {editable && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="grid h-24 w-24 place-items-center rounded-2xl border border-dashed border-separator bg-card text-muted transition-colors hover:border-ink hover:text-ink"
          >
            {uploading ? (
              <Dots />
            ) : (
              <ImagePlus className="h-6 w-6" />
            )}
          </button>
        )}
      </div>

      {editable && (
        <input
          ref={inputRef}
          type="file"
          accept={PHOTO_ACCEPT_ATTR}
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      )}

      <p className="text-[13px] text-muted">
        {editable ? t("hintEditable") : t("hintLocked")}
      </p>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
