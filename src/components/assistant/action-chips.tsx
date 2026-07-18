"use client";

import Link from "next/link";
import {
  Boxes,
  Building2,
  CalendarCheck,
  Compass,
  Inbox,
  LogIn,
  Mail,
  Plus,
  Route,
  type LucideIcon,
} from "lucide-react";
import type { AssistantSurface } from "@/lib/assistant/types";
import { resolveAction } from "@/lib/assistant/actions";

const ICONS: Record<string, LucideIcon> = {
  Boxes,
  Building2,
  CalendarCheck,
  Compass,
  Inbox,
  LogIn,
  Mail,
  Plus,
  Route,
};

/** Renders the deep-link shortcut buttons parsed from an assistant reply. */
export function ActionChips({
  actionKeys,
  surface,
  onNavigate,
}: {
  actionKeys: string[];
  surface: AssistantSurface;
  onNavigate?: () => void;
}) {
  const actions = actionKeys
    .map((key) => resolveAction(key, surface))
    .filter((a): a is NonNullable<typeof a> => a != null);

  if (actions.length === 0) return null;

  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {actions.map((action) => {
        const Icon = ICONS[action.icon] ?? Compass;
        const className =
          "inline-flex items-center gap-1.5 rounded-pill border border-separator bg-card px-3 py-1.5 text-[12.5px] font-semibold text-ink transition-colors hover:bg-fill";
        const content = (
          <>
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            {action.label}
          </>
        );

        return action.external ? (
          <a key={action.key} href={action.href} className={className} onClick={onNavigate}>
            {content}
          </a>
        ) : (
          <Link
            key={action.key}
            href={action.href}
            className={className}
            onClick={onNavigate}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}
