"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChipOption {
  value: string;
  label: string;
}

/**
 * Reusable selectable-chip group used across the listing wizard (audience,
 * amenities, tags, single-choice pickers). Multi by default; pass `single` for
 * radio-style behaviour. Controlled via `value` / `onChange`.
 */
export function ChipGroup({
  options,
  value,
  onChange,
  single = false,
  showCheck = false,
  className,
}: {
  options: ChipOption[];
  value: string[];
  onChange: (next: string[]) => void;
  single?: boolean;
  showCheck?: boolean;
  className?: string;
}) {
  function toggle(v: string) {
    if (single) {
      onChange([v]);
      return;
    }
    onChange(
      value.includes(v) ? value.filter((x) => x !== v) : [...value, v],
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => {
        const active = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
              active
                ? "bg-ink text-paper"
                : "bg-fill text-ink hover:bg-separator",
            )}
          >
            {showCheck && active && <Check className="h-3.5 w-3.5" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
