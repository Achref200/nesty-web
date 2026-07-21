"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Play, Smartphone } from "lucide-react";
import { appDemoVideo } from "@/lib/site";
import { StoreButtons } from "./store-buttons";

/**
 * The reservation moment for travellers. Booking lives in the mobile app, so
 * instead of a fake checkout we show a quick app demo (or a calm placeholder
 * until the clip ships) and the store buttons. Optionally names the listing the
 * visitor tapped so the intent carries over.
 */
export function AppModal({
  open,
  onClose,
  listingTitle,
}: {
  open: boolean;
  onClose: () => void;
  listingTitle?: string | null;
}) {
  const t = useTranslations("seeker.modal");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
      />

      <div className="keep-dark relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0d] text-paper shadow-[0_60px_120px_-50px_rgba(0,0,0,0.9)] animate-in fade-in-0 zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-xl border border-white/12 bg-black/40 text-white/70 transition-colors hover:text-paper"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Video / demo area */}
        <div className="relative aspect-video w-full bg-gradient-to-br from-white/[0.08] to-white/[0.02]">
          {appDemoVideo ? (
            <video
              src={appDemoVideo}
              className="h-full w-full object-cover"
              controls
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div
                aria-hidden="true"
                className="dark-grid pointer-events-none absolute inset-0 opacity-40"
              />
              <div className="relative flex flex-col items-center gap-3 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-pill border border-white/20 bg-white/[0.06] backdrop-blur-sm">
                  <Play className="h-6 w-6 translate-x-0.5 text-paper" fill="currentColor" />
                </span>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/50">
                  <Smartphone className="h-3.5 w-3.5" />
                  {t("videoFallback")}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <h2 className="font-display text-xl font-bold tracking-tight text-paper">
            {listingTitle ? t("titleWithName", { name: listingTitle }) : t("title")}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-white/55">
            {t("subtitle")}
          </p>
          <StoreButtons className="mt-5" />
        </div>
      </div>
    </div>
  );
}
