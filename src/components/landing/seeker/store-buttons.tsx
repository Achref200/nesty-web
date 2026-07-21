"use client";

import { useTranslations } from "next-intl";
import { appStores } from "@/lib/site";
import { cn } from "@/lib/utils";

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.417 2.196-1.245 3.163-.997 1.163-2.257 1.834-3.522 1.735-.16-1.113.395-2.29 1.16-3.222.847-1.033 2.293-1.827 3.607-1.676zM20.5 17.03c-.635 1.44-.94 2.087-1.76 3.36-1.146 1.782-2.762 4.005-4.767 4.023-1.784.017-2.24-1.163-4.66-1.15-2.42.014-2.923 1.171-4.708 1.155-2.004-.018-3.534-2.028-4.68-3.81C-.966 16.85-1.35 11.87.988 9.026 2.64 6.998 5.29 5.802 7.78 5.802c2.55 0 4.14 1.395 6.24 1.395 2.036 0 3.276-1.397 6.223-1.397 2.238 0 4.606 1.222 6.29 3.333-5.53 3.03-4.626 10.95-6.033 7.898z" />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M3.6 2.4a1.6 1.6 0 0 0-.4 1.1v17c0 .4.15.79.4 1.1l10-9.6-10-9.6zm11.2 10.8-2.5 2.4L5.4 22.1c.4.15.85.1 1.24-.12l11.36-6.6-3.2-2.18zm7.6-2.5-3-1.74-3.5 3.34 3.5 3.35 3-1.75c1-.6 1-2.6 0-3.2zM6.64 2.02c-.39-.22-.85-.27-1.24-.12l7.9 8.5 3.2-3.35L6.64 2.02z" />
    </svg>
  );
}

function StoreButton({
  store,
  label,
  comingSoon,
}: {
  store: "apple" | "google";
  label: string;
  comingSoon: string;
}) {
  const href = store === "apple" ? appStores.apple : appStores.google;
  const Glyph = store === "apple" ? AppleGlyph : GoogleGlyph;
  const prefix = store === "apple" ? "App Store" : "Google Play";
  const base =
    "inline-flex flex-1 items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-[13px] font-semibold transition-transform";

  if (!href) {
    return (
      <span
        aria-disabled="true"
        title={comingSoon}
        className={cn(
          base,
          "cursor-default border border-white/12 bg-white/[0.04] text-white/60",
        )}
      >
        <Glyph />
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/40">
            {comingSoon}
          </span>
          <span>{prefix}</span>
        </span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, "bg-paper text-ink hover:-translate-y-px")}
    >
      <Glyph />
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-ink/50">
          {label}
        </span>
        <span>{prefix}</span>
      </span>
    </a>
  );
}

/** Apple + Google store buttons for the traveller space (dark surface). */
export function StoreButtons({ className }: { className?: string }) {
  const t = useTranslations("seeker.download");
  return (
    <div className={cn("flex flex-col gap-2.5 sm:flex-row", className)}>
      <StoreButton store="apple" label={t("apple")} comingSoon={t("comingSoon")} />
      <StoreButton store="google" label={t("google")} comingSoon={t("comingSoon")} />
    </div>
  );
}
