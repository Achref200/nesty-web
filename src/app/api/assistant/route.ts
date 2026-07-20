/**
 * POST /api/assistant — the single server proxy for the AI assistant. Keeps the
 * provider key server-side, validates + caps all user input, and maps failures
 * to normalised kinds. Runs on the Node runtime (needs env + outbound fetch).
 */
import { NextResponse } from "next/server";

import { assistantConfig } from "@/lib/assistant/config";
import { generateAssistantReply } from "@/lib/assistant/server/generate";
import type {
  AssistantRequest,
  AssistantResponse,
  AssistantSurface,
  ChatRole,
} from "@/lib/assistant/types";
import { MAX_HISTORY_TURNS } from "@/lib/assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Input caps — defend the model + our bill against oversized payloads.
const MAX_MESSAGES = 60;
const MAX_TEXT_LEN = 4000;
const SURFACES: AssistantSurface[] = ["landing", "dashboard", "app"];
const ROLES: ChatRole[] = ["user", "assistant"];

export async function POST(request: Request): Promise<NextResponse<AssistantResponse>> {
  if (!assistantConfig.enabled) {
    return NextResponse.json({ error: "config" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "server" }, { status: 400 });
  }

  const parsed = parseRequest(body);
  if (!parsed) {
    return NextResponse.json({ error: "server" }, { status: 400 });
  }

  const result = await generateAssistantReply(parsed);

  if (result.ok) {
    return NextResponse.json({ reply: result.reply }, { status: 200 });
  }

  return NextResponse.json({ error: result.failure }, { status: statusFor(result.failure) });
}

function parseRequest(body: unknown): AssistantRequest | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  const surface = b.surface;
  if (typeof surface !== "string" || !SURFACES.includes(surface as AssistantSurface)) {
    return null;
  }

  if (!Array.isArray(b.messages) || b.messages.length === 0) return null;

  const messages = b.messages
    .slice(-MAX_MESSAGES)
    .map((m) => {
      if (typeof m !== "object" || m === null) return null;
      const role = (m as Record<string, unknown>).role;
      const text = (m as Record<string, unknown>).text;
      if (typeof role !== "string" || !ROLES.includes(role as ChatRole)) return null;
      if (typeof text !== "string") return null;
      const trimmed = text.trim().slice(0, MAX_TEXT_LEN);
      if (trimmed.length === 0) return null;
      return { role: role as ChatRole, text: trimmed };
    })
    .filter((m): m is { role: ChatRole; text: string } => m !== null)
    .slice(-MAX_HISTORY_TURNS);

  if (messages.length === 0) return null;

  const locale =
    typeof b.locale === "string" ? b.locale.slice(0, 8) : undefined;
  const userName =
    typeof b.userName === "string" ? b.userName.trim().slice(0, 80) : undefined;
  const context =
    typeof b.context === "string" ? b.context.trim().slice(0, 2000) : undefined;

  return { surface: surface as AssistantSurface, messages, locale, userName, context };
}

function statusFor(failure: AssistantResponse["error"]): number {
  switch (failure) {
    case "config":
      return 503;
    case "rate_limit":
      return 429;
    case "network":
      return 502;
    case "blocked":
      return 200; // a normal, safe refusal — not an error state
    default:
      return 500;
  }
}
