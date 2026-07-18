/**
 * The whitelist of in-app destinations the assistant may deep-link to — the web
 * equivalent of the Flutter `AssistantActions` registry. The model may append
 * `[[action:KEY]]` tags to its reply; only keys listed here (for the current
 * surface) are honoured, everything else is ignored. Isomorphic + secret-free.
 */

import type { AssistantSurface } from "./types";
import { agencyAccessMailto } from "@/lib/site";

export interface AssistantActionDef {
  key: string;
  /** Short chip label shown to the user. */
  label: string;
  /** Route or mailto. */
  href: string;
  /** true → open in a new tab / mail client (anchor), false → in-app Link. */
  external?: boolean;
  /** lucide-react icon name, mapped to a component in the chip renderer. */
  icon: string;
  /** Surfaces where this shortcut is offered. */
  surfaces: AssistantSurface[];
}

export const ASSISTANT_ACTIONS: AssistantActionDef[] = [
  // ── Landing (public visitors: renters + agencies) ──────────────────────────
  {
    key: "browse_stays",
    label: "Browse stays",
    href: "/#stays",
    icon: "Compass",
    surfaces: ["landing"],
  },
  {
    key: "how_it_works",
    label: "How it works",
    href: "/#how",
    icon: "Route",
    surfaces: ["landing"],
  },
  {
    key: "explore_product",
    label: "See the product",
    href: "/#product",
    icon: "Boxes",
    surfaces: ["landing"],
  },
  {
    key: "request_access",
    label: "Request agency access",
    href: agencyAccessMailto,
    external: true,
    icon: "Mail",
    surfaces: ["landing"],
  },
  {
    key: "sign_in",
    label: "Sign in",
    href: "/login",
    icon: "LogIn",
    surfaces: ["landing"],
  },
  // ── Dashboard (agency staff) ───────────────────────────────────────────────
  {
    key: "new_listing",
    label: "Add a listing",
    href: "/dashboard/listings/new",
    icon: "Plus",
    surfaces: ["dashboard"],
  },
  {
    key: "listings",
    label: "Open listings",
    href: "/dashboard/listings",
    icon: "Building2",
    surfaces: ["dashboard"],
  },
  {
    key: "calendar",
    label: "Open calendar",
    href: "/dashboard/calendar",
    icon: "CalendarCheck",
    surfaces: ["dashboard"],
  },
  {
    key: "requests",
    label: "View requests",
    href: "/dashboard/requests",
    icon: "Inbox",
    surfaces: ["dashboard"],
  },
];

/** Comma-separated allowed keys for a surface — injected into the prompt. */
export function allowedActionKeys(surface: AssistantSurface): string {
  return ASSISTANT_ACTIONS.filter((a) => a.surfaces.includes(surface))
    .map((a) => a.key)
    .join(", ");
}

/** Resolve a key to its definition, scoped to the surface (case-insensitive). */
export function resolveAction(
  key: string,
  surface: AssistantSurface,
): AssistantActionDef | undefined {
  const normalized = key.toLowerCase().trim();
  return ASSISTANT_ACTIONS.find(
    (a) => a.key === normalized && a.surfaces.includes(surface),
  );
}
