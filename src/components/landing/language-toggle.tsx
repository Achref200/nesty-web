"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";
import { setLocale } from "@/lib/actions/locale";

/**
 * EN / FR language switch for the landing header. Persists the choice via a
 * cookie (server action) and refreshes the server-rendered tree. Styled to sit
 * next to the theme toggle — monochrome, pill segment control.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const active = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === active) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-pill border border-white/12 bg-white/[0.04] p-0.5",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <Globe
        className="ml-1.5 mr-0.5 h-3.5 w-3.5 text-white/40"
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
              ? "bg-paper text-ink"
              : "text-white/55 hover:text-paper",
          )}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
