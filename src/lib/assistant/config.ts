/**
 * Server-side assistant configuration. Reads the AI_ASSISTANT_* environment
 * variables. NONE of these are `NEXT_PUBLIC_`, so the API key never reaches the
 * browser — every model call is proxied through /api/assistant on the server.
 *
 * Do NOT import this module from a client component. It is meant for the API
 * route and the server components that gate whether the widget renders.
 */

function read(name: string, fallback: string): string {
  const value = process.env[name];
  return value != null && value.trim().length > 0 ? value.trim() : fallback;
}

function readBool(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value == null || value.trim().length === 0) return fallback;
  return value.trim().toLowerCase() === "true";
}

export const assistantConfig = {
  get enabled(): boolean {
    return readBool("AI_ASSISTANT_ENABLED", true);
  },
  /** `gemini` (default) or an OpenAI-compatible API (`openai` / `grok` / `xai`). */
  get provider(): string {
    return read("AI_ASSISTANT_PROVIDER", "gemini");
  },
  get apiKey(): string {
    return read("AI_ASSISTANT_API_KEY", "");
  },
  get model(): string {
    return read("AI_ASSISTANT_MODEL", "gemini-3.1-flash-lite");
  },
  get fallbackModel(): string {
    return read("AI_ASSISTANT_FALLBACK_MODEL", "gemini-flash-lite-latest");
  },
  get baseUrl(): string {
    return read(
      "AI_ASSISTANT_BASE_URL",
      "https://generativelanguage.googleapis.com/v1beta",
    );
  },
} as const;
