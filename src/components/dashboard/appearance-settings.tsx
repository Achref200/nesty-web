"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import {
  DASH_PRESETS,
  DEFAULT_DASH_THEME,
  applyDashTheme,
  loadDashTheme,
  saveDashTheme,
  type DashTheme,
} from "@/lib/dashboard-theme";

const FIELDS: (keyof DashTheme)[] = [
  "primary",
  "secondary",
  "tertiary",
  "text",
  "background",
];

/**
 * Live palette customizer. Writes CSS variables onto the dashboard root so the
 * whole workspace recolours instantly, and persists to localStorage.
 */
export function AppearanceSettings() {
  const t = useTranslations("dashboard.settings.appearance");
  const [theme, setTheme] = useState<DashTheme>(DEFAULT_DASH_THEME);

  useEffect(() => {
    setTheme(loadDashTheme());
  }, []);

  function commit(next: DashTheme) {
    setTheme(next);
    applyDashTheme(next);
    saveDashTheme(next);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {DASH_PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => commit(p.theme)}
            className="inline-flex items-center gap-2 rounded-pill border border-separator bg-card px-3 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:bg-fill"
          >
            <span className="flex -space-x-1">
              <span
                className="h-3.5 w-3.5 rounded-pill ring-1 ring-paper"
                style={{ background: p.theme.primary }}
              />
              <span
                className="h-3.5 w-3.5 rounded-pill ring-1 ring-paper"
                style={{ background: p.theme.secondary }}
              />
              <span
                className="h-3.5 w-3.5 rounded-pill ring-1 ring-paper"
                style={{ background: p.theme.tertiary }}
              />
            </span>
            {t(`presets.${p.key}`)}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map((key) => (
          <label
            key={key}
            className="flex items-center justify-between gap-3 rounded-xl border border-separator bg-card px-3 py-2.5"
          >
            <span className="text-[13px] font-semibold text-ink">
              {t(`fields.${key}`)}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="font-mono text-[12px] uppercase text-muted">
                {theme[key]}
              </span>
              <input
                type="color"
                value={theme[key]}
                onChange={(e) => commit({ ...theme, [key]: e.target.value })}
                aria-label={t(`fields.${key}`)}
                className="h-8 w-10 cursor-pointer rounded-md border border-separator bg-transparent p-0"
              />
            </span>
          </label>
        ))}
      </div>

      <div>
        <button
          type="button"
          onClick={() => commit(DEFAULT_DASH_THEME)}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
        >
          <RotateCcw className="h-4 w-4" /> {t("reset")}
        </button>
      </div>
    </div>
  );
}
