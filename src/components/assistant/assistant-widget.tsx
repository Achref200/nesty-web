"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Send, Sparkles, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssistantSurface } from "@/lib/assistant/types";
import { ASSISTANT_NAME } from "@/lib/assistant/types";
import { useAssistant } from "./use-assistant";
import { ChatBubble } from "./chat-bubble";
import { AssistantAvatar, TypingIndicator } from "./typing-indicator";

const SUGGESTIONS: Record<AssistantSurface, string[]> = {
  landing: [
    "What makes Nesty different?",
    "Find a sea-view stay under 200 TND/night",
    "Plan a 3-day trip in Tunisia",
    "How do the 3D tours work?",
    "I run an agency — how do I join?",
  ],
  dashboard: [
    "How do I add a great listing?",
    "Explain how availability works",
    "Tips to get more bookings",
    "What should I focus on today?",
  ],
  app: [
    "Find a sea-view stay under 200 TND/night",
    "Is this a fair price for the area?",
    "What should I check before I visit?",
    "Help me plan my trip",
  ],
};

/**
 * Global, always-available assistant. A floating launcher opens a blurred glass
 * panel that lives above every page (not a dedicated route). Full-screen sheet
 * on mobile, floating card on desktop.
 */
export function AssistantWidget({
  surface,
  userName,
}: {
  surface: AssistantSurface;
  userName?: string;
}) {
  const [open, setOpen] = useState(false);
  const { messages, isTyping, errorText, animatingId, send, retry, clear, onAnimationDone } =
    useAssistant(surface, userName);

  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Keep the conversation pinned to the bottom as it grows.
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [messages, isTyping, errorText, animatingId, open]);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const mq = window.matchMedia("(max-width: 639px)");
    if (mq.matches) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function submit() {
    const text = draft.trim();
    if (!text || isTyping) return;
    send(text);
    setDraft("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  const isEmpty = messages.length === 0;

  // The landing canvas is dark, the dashboard is light — flip the launcher so it
  // always stands out against its background.
  const launcher =
    surface === "landing"
      ? { bar: "bg-paper text-ink", orb: "bg-ink/10" }
      : { bar: "bg-ink text-paper", orb: "bg-paper/15" };

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open ${ASSISTANT_NAME}`}
          className={cn(
            "group fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-pill py-3 pl-3 pr-4 shadow-lift transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6",
            launcher.bar,
          )}
        >
          <span className={cn("grid h-7 w-7 place-items-center rounded-pill", launcher.orb)}>
            <Sparkles className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="text-[13.5px] font-semibold">Ask Nesty</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <>
          {/* Mobile scrim */}
          <div
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label={ASSISTANT_NAME}
            className={cn(
              "keep-dark glass-panel fixed z-[61] flex flex-col overflow-hidden border border-separator shadow-lift",
              // Mobile: near-full-screen sheet. Desktop: floating card.
              "inset-x-3 bottom-3 top-16 rounded-3xl",
              "sm:inset-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[560px] sm:max-h-[80vh] sm:w-[380px]",
            )}
          >
            {/* Header */}
            <header className="flex items-center gap-2.5 border-b border-separator px-4 py-3">
              <AssistantAvatar size={32} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-ink">{ASSISTANT_NAME}</p>
                <p className="truncate text-[11px] text-muted">Here to help with Nesty</p>
              </div>
              {!isEmpty && (
                <button
                  type="button"
                  onClick={clear}
                  aria-label="Clear conversation"
                  className="grid h-8 w-8 place-items-center rounded-pill text-muted transition-colors hover:bg-fill hover:text-ink"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.9} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-pill text-muted transition-colors hover:bg-fill hover:text-ink"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </header>

            {/* Body */}
            <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto px-4 py-4">
              {isEmpty ? (
                <WelcomeView
                  surface={surface}
                  userName={userName}
                  onPick={(text) => send(text)}
                />
              ) : (
                messages.map((m) => (
                  <ChatBubble
                    key={m.id}
                    message={m}
                    surface={surface}
                    animate={m.id === animatingId}
                    onAnimationDone={onAnimationDone}
                    onNavigate={() => setOpen(false)}
                  />
                ))
              )}

              {isTyping && <TypingIndicator />}

              {errorText && (
                <div className="rounded-2xl border border-separator bg-card px-3.5 py-3 text-[13px] text-ink-soft">
                  <p>{errorText}</p>
                  <button
                    type="button"
                    onClick={retry}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-pill bg-ink px-3 py-1.5 text-[12px] font-semibold text-paper"
                  >
                    <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} /> Retry
                  </button>
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-separator px-3 py-3">
              <div className="flex items-end gap-2 rounded-2xl border border-separator bg-card px-3 py-2">
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    const el = e.target;
                    el.style.height = "auto";
                    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  rows={1}
                  placeholder="Ask anything about Nesty…"
                  className="max-h-28 flex-1 resize-none bg-transparent text-[13.5px] leading-relaxed text-ink outline-none placeholder:text-muted-soft"
                />
                <button
                  type="button"
                  onClick={submit}
                  disabled={!draft.trim() || isTyping}
                  aria-label="Send"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-ink text-paper transition-opacity disabled:opacity-30"
                >
                  <Send className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
              <p className="mt-2 px-1 text-center text-[10.5px] text-muted-soft">
                AI-powered · answers about Nesty only · can make mistakes.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function WelcomeView({
  surface,
  userName,
  onPick,
}: {
  surface: AssistantSurface;
  userName?: string;
  onPick: (text: string) => void;
}) {
  const greeting = timeGreeting();
  return (
    <div className="pt-2">
      <div className="flex flex-col items-center text-center">
        <span className="grid h-14 w-14 place-items-center rounded-pill bg-gradient-to-br from-ink to-ink-soft text-paper shadow-sm">
          <Sparkles className="h-7 w-7" strokeWidth={1.8} />
        </span>
        <p className="mt-4 font-display text-lg font-semibold text-ink">
          {greeting}
          {userName ? `, ${userName.split(" ")[0]}` : ""} 👋
        </p>
        <p className="mt-1 max-w-[16rem] text-[13px] leading-relaxed text-muted">
          I know Nesty inside out — ask about stays, budgets, trips or your listings.
        </p>
      </div>

      <p className="mt-6 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-soft">
        Try asking
      </p>
      <div className="mt-2 flex flex-col gap-2">
        {SUGGESTIONS[surface].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-2xl border border-separator bg-card px-3.5 py-2.5 text-left text-[13px] font-medium text-ink transition-colors hover:bg-fill"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
