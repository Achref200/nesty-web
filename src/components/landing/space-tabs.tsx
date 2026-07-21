"use client";

import { useTranslations } from "next-intl";
import { Compass, Building2 } from "lucide-react";
import { useSpace, type Space } from "./space-context";
import { cn } from "@/lib/utils";

const TABS: { key: Space; icon: typeof Compass }[] = [
  { key: "seeker", icon: Compass },
  { key: "agency", icon: Building2 },
];

/**
 * The primary Travellers / Hosts switch. Lives at the very top of the page
 * content (not the header) so choosing an audience is the first thing a visitor
 * does — Airbnb-style segmented tabs.
 */
export function SpaceTabs() {
  const { space, setSpace } = useSpace();
  const t = useTranslations("space");

  function switchTo(next: Space) {
    if (next === space) return;
    setSpace(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }

  return (
    <div className="flex justify-center px-5 pt-8 md:pt-10">
      <div
        role="tablist"
        aria-label={t("ariaLabel")}
        className="inline-flex items-center gap-1 rounded-pill border border-white/12 bg-white/[0.04] p-1 backdrop-blur-sm"
      >
        {TABS.map(({ key, icon: Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={space === key}
            onClick={() => switchTo(key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-[14px] font-semibold transition-colors",
              space === key
                ? "bg-paper text-ink"
                : "text-white/60 hover:text-paper",
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
            {t(key)}
          </button>
        ))}
      </div>
    </div>
  );
}
