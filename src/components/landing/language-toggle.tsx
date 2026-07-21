"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";
import { setLocale } from "@/lib/actions/locale";
import { NestyLoaderOverlay } from "@/components/brand/loader";

type ToggleVariant = "dark" | "light";

/**
 * EN / FR language switch. Persists the choice via a cookie (server action) and
 * refreshes the server-rendered tree. The `dark` variant (default) sits in the
 * inverted landing header; the `light` variant works on the paper surfaces of
 * the login screen and the agency dashboard.
 */
export function LanguageToggle({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: ToggleVariant;
}) {
  const active = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isLight = variant === "light";

  function switchTo(next: Locale) {
    if (next === active) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <>
      {pending && (
        <NestyLoaderOverlay
          className={isLight ? "bg-paper/80 text-ink" : "bg-ink/70 text-paper"}
          label="Switching language"
        />
      )}
      <div
        className={cn(
          "inline-flex items-center gap-0.5 rounded-pill border p-0.5",
          isLight
            ? "border-separator bg-card"
            : "border-white/12 bg-white/[0.04]",
          className,
        )}
        role="group"
        aria-label="Language"
      >
        <Globe
          className={cn(
            "ml-1.5 mr-0.5 h-3.5 w-3.5",
            isLight ? "text-muted" : "text-white/40",
          )}
          strokeWidth={1.8}
          aria-hidden="true"
        />
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            disabled={pending}
            aria-pressed={active === l}
            className={cn(
              "rounded-pill px-2 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors disabled:opacity-60",
              active === l
                ? isLight
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink"
                : isLight
                  ? "text-muted hover:text-ink"
                  : "text-white/55 hover:text-paper",
            )}
          >
            {LOCALE_LABELS[l]}
          </button>
        ))}
      </div>
    </>
  );
}
