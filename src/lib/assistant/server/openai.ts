/**
 * Server-only OpenAI-compatible provider (optional alt: openai / grok / xai).
 * Port of `OpenAiRemoteDataSourceImpl`. Contract: POST {base}/chat/completions,
 * header Authorization: Bearer {key}.
 */
import "server-only";

import { assistantConfig } from "../config";
import {
  AssistantApiError,
  attemptModels,
  type ProviderRequest,
} from "./remote";

const TIMEOUT_MS = 45_000;

export async function generateOpenAiReply({
  systemPrompt,
  history,
}: ProviderRequest): Promise<string> {
  const apiKey = assistantConfig.apiKey;
  if (!apiKey) {
    throw new AssistantApiError("config", "Missing assistant API key");
  }

  const messages = [
    { role: "system", content: systemPrompt },
    ...history
      .filter((m) => m.text.trim().length > 0)
      .map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      })),
  ];

  return attemptModels(
    [assistantConfig.model, assistantConfig.fallbackModel],
    (model) => requestModel(model, apiKey, messages),
  );
}

async function requestModel(
  model: string,
  apiKey: string,
  messages: { role: string; content: string }[],
): Promise<string> {
  const base = assistantConfig.baseUrl.replace(/\/+$/, "");
  const url = `${base}/chat/completions`;

  const requestBody = {
    model,
    messages,
    temperature: 0.8,
    max_tokens: 1024,
    stream: false,
  };

  let response: Response;
  try {
    response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
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

  const data = (await response.json()) as OpenAiResponse;
  const choices = data.choices;
  if (!choices || choices.length === 0) {
    throw new AssistantApiError("empty", "No choices");
  }

  const first = choices[0];
  const text = (typeof first.message?.content === "string"
    ? first.message.content
    : ""
  ).trim();

  if (text.length === 0) {
    if (first.finish_reason === "content_filter") {
      throw new AssistantApiError("blocked", "Response blocked");
    }
    throw new AssistantApiError("empty", "Empty response");
  }
  return text;
}

interface OpenAiResponse {
  choices?: {
    finish_reason?: string;
    message?: { content?: string };
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
