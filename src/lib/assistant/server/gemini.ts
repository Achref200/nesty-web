/**
 * Server-only Gemini provider (primary). Port of `GeminiRemoteDataSourceImpl`.
 * Contract: POST {base}/models/{model}:generateContent, header x-goog-api-key.
 */
import "server-only";

import { assistantConfig } from "../config";
import {
  AssistantApiError,
  attemptModels,
  type ProviderRequest,
} from "./remote";

const TIMEOUT_MS = 45_000;

export async function generateGeminiReply({
  systemPrompt,
  history,
}: ProviderRequest): Promise<string> {
  const apiKey = assistantConfig.apiKey;
  if (!apiKey) {
    throw new AssistantApiError("config", "Missing assistant API key");
  }

  const contents = history
    .filter((m) => m.text.trim().length > 0)
    .map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

  const requestBody = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: { temperature: 0.8, topP: 0.95, maxOutputTokens: 1024 },
  };

  return attemptModels(
    [assistantConfig.model, assistantConfig.fallbackModel],
    (model) => requestModel(model, apiKey, requestBody),
  );
}

async function requestModel(
  model: string,
  apiKey: string,
  requestBody: unknown,
): Promise<string> {
  const url = `${assistantConfig.baseUrl}/models/${model}:generateContent`;

  let response: Response;
  try {
    response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(requestBody),
    });
  } catch (error) {
    throw new AssistantApiError("network", String(error));
  }

  if (response.status === 429) {
    throw new AssistantApiError("rateLimited", await safeBody(response));
  }
  if (response.status === 503) {
    throw new AssistantApiError("unavailable", await safeBody(response));
  }
  if (response.status !== 200) {
    throw new AssistantApiError("server", `${response.status}`);
  }

  const data = (await response.json()) as GeminiResponse;

  if (data.promptFeedback?.blockReason) {
    throw new AssistantApiError("blocked", "Prompt blocked");
  }

  const candidates = data.candidates;
  if (!candidates || candidates.length === 0) {
    throw new AssistantApiError("empty", "No candidates");
  }

  const first = candidates[0];
  const finishReason = first.finishReason;
  const text = (first.content?.parts ?? [])
    .map((p) => p.text)
    .filter((t): t is string => typeof t === "string")
    .join("")
    .trim();

  if (text.length === 0) {
    if (finishReason === "SAFETY" || finishReason === "PROHIBITED_CONTENT") {
      throw new AssistantApiError("blocked", "Response blocked");
    }
    throw new AssistantApiError("empty", "Empty response");
  }
  return text;
}

interface GeminiResponse {
  promptFeedback?: { blockReason?: string };
  candidates?: {
    finishReason?: string;
    content?: { parts?: { text?: string }[] };
  }[];
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function safeBody(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}
