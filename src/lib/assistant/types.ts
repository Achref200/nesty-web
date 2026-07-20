/**
 * Assistant domain types (framework-agnostic, isomorphic). Mirrors the Flutter
 * `domain/entities` layer — same shapes, adapted to TypeScript. Everything here
 * is safe to import from both server and client (no secrets, no node APIs).
 */

export type ChatRole = "user" | "assistant";

/** The two places the assistant lives. Drives persona + available shortcuts. */
export type AssistantSurface = "landing" | "dashboard" | "app";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  /** epoch ms — kept serializable so history survives localStorage round-trips. */
  createdAt: number;
  /** Resolved deep-link shortcut keys parsed from the reply. */
  actionKeys?: string[];
}

/** Normalised failure kinds surfaced to the UI (mirrors AssistantFailure). */
export type AssistantFailureKind =
  | "network"
  | "server"
  | "rate_limit"
  | "blocked"
  | "config";

/** POST /api/assistant request body. */
export interface AssistantRequest {
  surface: AssistantSurface;
  locale?: string;
  userName?: string;
  /** Optional context hint (e.g. the mobile app's "what you're viewing" note). */
  context?: string;
  messages: { role: ChatRole; text: string }[];
}

/** POST /api/assistant response body. */
export interface AssistantResponse {
  reply?: string;
  error?: AssistantFailureKind;
}

/** Friendly product name shown in the UI + system prompt. */
export const ASSISTANT_NAME = "Nesty Assistant";

/** Only the last N non-empty turns are ever sent to the model (matches doc). */
export const MAX_HISTORY_TURNS = 24;
