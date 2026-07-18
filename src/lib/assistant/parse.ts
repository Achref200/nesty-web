/**
 * Parses `[[action:KEY]]` shortcut tags out of a raw assistant reply — the web
 * port of the Flutter action-tag parsing. Returns the clean, user-visible text
 * plus up to 3 valid, surface-scoped action keys. Isomorphic (used client-side
 * after the reply arrives).
 */

import type { AssistantSurface } from "./types";
import { resolveAction } from "./actions";

const ACTION_TAG = /\[\[\s*action\s*:\s*([a-zA-Z_]+)\s*\]\]/g;
const MAX_ACTIONS = 3;

export function parseAssistantReply(
  raw: string,
  surface: AssistantSurface,
): { text: string; actionKeys: string[] } {
  const keys: string[] = [];

  let match: RegExpExecArray | null;
  ACTION_TAG.lastIndex = 0;
  while ((match = ACTION_TAG.exec(raw)) !== null) {
    const resolved = resolveAction(match[1], surface);
    if (resolved && !keys.includes(resolved.key) && keys.length < MAX_ACTIONS) {
      keys.push(resolved.key);
    }
  }

  const text = raw
    .replace(ACTION_TAG, "")
    // collapse the blank lines left behind by stripped tags
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { text, actionKeys: keys };
}
