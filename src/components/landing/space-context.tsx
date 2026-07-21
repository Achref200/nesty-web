"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export type Space = "agency" | "seeker";

/** Remembers the chosen space so a server refresh (e.g. language switch) keeps it. */
export const SPACE_COOKIE = "nesty-space";

interface SpaceContextValue {
  space: Space;
  setSpace: (space: Space) => void;
}

const SpaceContext = createContext<SpaceContextValue | null>(null);

/**
 * Holds which landing "space" is active — the B2B agency marketing site or the
 * traveller (seeker) discovery experience. The nav toggle and the content
 * switch both read from here so a single control flips the whole page.
 */
export function SpaceProvider({
  children,
  initial = "agency",
}: {
  children: React.ReactNode;
  initial?: Space;
}) {
  const [space, setSpaceState] = useState<Space>(initial);

  const setSpace = useCallback((next: Space) => {
    setSpaceState(next);
    if (typeof document !== "undefined") {
      document.cookie = `${SPACE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    }
  }, []);

  return (
    <SpaceContext.Provider value={{ space, setSpace }}>
      {children}
    </SpaceContext.Provider>
  );
}

export function useSpace() {
  const ctx = useContext(SpaceContext);
  if (!ctx) throw new Error("useSpace must be used within a SpaceProvider");
  return ctx;
}

const OPTIONS: { key: Space; icon: typeof Compass }[] = [
  { key: "seeker", icon: Compass },
  { key: "agency", icon: Building2 },
];

/** Segmented Travellers / Agencies switch for the landing header. */
export function SpaceToggle({ className }: { className?: string }) {
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
    <div
      role="group"
      aria-label={t("ariaLabel")}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-pill border border-white/12 bg-white/[0.04] p-0.5",
        className,
      )}
    >
      {OPTIONS.map(({ key, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => switchTo(key)}
          aria-pressed={space === key}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
            space === key
              ? "bg-paper text-ink"
              : "text-white/55 hover:text-paper",
          )}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={2} />
          {t(key)}
        </button>
      ))}
    </div>
  );
}
