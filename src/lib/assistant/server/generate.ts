/**
 * Server-only orchestrator — the repository + use-case + provider-factory layer.
 * Builds the system prompt, picks the provider, runs the call, and maps provider
 * exceptions to the normalised failure kinds the UI understands.
 */
import "server-only";

import type {
  AssistantFailureKind,
  AssistantRequest,
  ChatRole,
} from "../types";
import { MAX_HISTORY_TURNS } from "../types";
import { buildSystemPrompt } from "../system-prompt";
import { assistantConfig } from "../config";
import { AssistantApiError } from "./remote";
import { generateGeminiReply } from "./gemini";
import { generateOpenAiReply } from "./openai";

export type GenerateResult =
  | { ok: true; reply: string }
  | { ok: false; failure: AssistantFailureKind };

export async function generateAssistantReply(
  req: AssistantRequest,
): Promise<GenerateResult> {
  const systemPrompt = buildSystemPrompt({
    surface: req.surface,
    locale: req.locale,
    userName: req.userName,
    context: req.context,
  });

  const history = req.messages
    .filter((m) => m.text.trim().length > 0)
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role as ChatRole, text: m.text }));

  try {
    const reply = await callProvider({ systemPrompt, history });
    return { ok: true, reply };
  } catch (error) {
    return { ok: false, failure: mapFailure(error) };
  }
}

function callProvider(request: {
  systemPrompt: string;
  history: { role: ChatRole; text: string }[];
}): Promise<string> {
  const provider = assistantConfig.provider.toLowerCase();
  const isOpenAiCompatible =
    provider === "openai" || provider === "grok" || provider === "xai";
  return isOpenAiCompatible
    ? generateOpenAiReply(request)
    : generateGeminiReply(request);
}

function mapFailure(error: unknown): AssistantFailureKind {
  if (!(error instanceof AssistantApiError)) return "server";
  switch (error.type) {
    case "config":
      return "config";
    case "network":
      return "network";
    case "blocked":
      return "blocked";
    case "rateLimited":
    case "unavailable":
      return "rate_limit";
    case "server":
    case "empty":
      return "server";
  }
}
