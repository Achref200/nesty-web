/**
 * Server-only. Error taxonomy + the model-fallback/retry runner shared by every
 * provider — a direct port of the Flutter `ModelFallbackMixin`. Do NOT import
 * from client code.
 */
import "server-only";

import type { ChatMessage } from "../types";

export type AssistantApiErrorType =
  | "config"
  | "network"
  | "blocked"
  | "server"
  | "empty"
  | "rateLimited"
  | "unavailable";

export class AssistantApiError extends Error {
  constructor(
    public readonly type: AssistantApiErrorType,
    message: string,
  ) {
    super(message);
    this.name = "AssistantApiError";
  }
}

export interface ProviderRequest {
  systemPrompt: string;
  history: { role: ChatMessage["role"]; text: string }[];
}

/**
 * Try the primary model, then the fallback, retrying transient 503s (up to 3
 * attempts each with linear backoff). Behaviour is identical to the mobile app
 * so reliability is the same everywhere.
 */
export async function attemptModels(
  models: string[],
  call: (model: string) => Promise<string>,
): Promise<string> {
  const candidates = models.filter((m) => m.trim().length > 0);
  if (candidates.length === 0) {
    throw new AssistantApiError("config", "No model configured");
  }

  let lastError = new AssistantApiError("server", "No model attempted");

  for (const model of candidates) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await call(model);
      } catch (error) {
        if (!(error instanceof AssistantApiError)) {
          lastError = new AssistantApiError("server", String(error));
          break;
        }
        lastError = error;

        // 503 = temporary spike: back off and retry the SAME model first.
        if (error.type === "unavailable" && attempt < 2) {
          await delay(700 * (attempt + 1));
          continue;
        }

        switch (error.type) {
          case "config":
          case "network":
          case "blocked":
          case "empty":
            throw error; // switching models can't help these
          case "server":
          case "rateLimited":
          case "unavailable":
            break; // give the next model a chance
        }
        break;
      }
    }
  }

  throw lastError;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
