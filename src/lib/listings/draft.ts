/**
 * Client-side draft persistence for the listing wizard. Keeps entered data
 * safe if the host reloads or navigates away mid-flow. Backend-free by design
 * (works within the current architecture) — keyed per listing id, or "new" for
 * a fresh creation.
 */

"use client";

import type { ListingDraft } from "./schema";

const PREFIX = "nesty-listing-draft:";

function key(id: string | undefined): string {
  return `${PREFIX}${id ?? "new"}`;
}

interface Stored {
  step: number;
  draft: ListingDraft;
  savedAt: number;
}

export function loadDraft(
  id: string | undefined,
): { step: number; draft: ListingDraft } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed?.draft) return null;
    return { step: parsed.step ?? 0, draft: parsed.draft };
  } catch {
    return null;
  }
}

export function saveDraft(
  id: string | undefined,
  draft: ListingDraft,
  step: number,
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: Stored = { step, draft, savedAt: Date.now() };
    window.localStorage.setItem(key(id), JSON.stringify(payload));
  } catch {
    /* quota or serialization failure — non-fatal, drafts are best-effort */
  }
}

export function clearDraft(id: string | undefined): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key(id));
  } catch {
    /* ignore */
  }
}
