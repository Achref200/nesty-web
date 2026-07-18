"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AssistantResponse,
  AssistantSurface,
  ChatMessage,
} from "@/lib/assistant/types";
import { parseAssistantReply } from "@/lib/assistant/parse";

/**
 * Client controller for the assistant — the web port of the GetX/Bloc logic.
 * Owns the message list, typing/error state, the typewriter target, and
 * best-effort localStorage persistence (one ongoing thread per surface).
 */
export function useAssistant(surface: AssistantSurface, userName?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [animatingId, setAnimatingId] = useState("");

  const storageKey = `nesty.assistant.${surface}.v1`;
  const messagesRef = useRef<ChatMessage[]>(messages);
  const loadedRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Load saved thread once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {
      /* best-effort: ignore corrupt/blocked storage */
    }
    loadedRef.current = true;
  }, [storageKey]);

  // Persist on every change (cap to the last 40 messages).
  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(messages.slice(-40)));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [messages, storageKey]);

  const runInference = useCallback(
    async (history: ChatMessage[]) => {
      setIsTyping(true);
      setErrorText("");
      try {
        const locale =
          typeof navigator !== "undefined" ? navigator.language?.slice(0, 2) : "en";
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            surface,
            locale,
            userName,
            messages: history.slice(-24).map((m) => ({ role: m.role, text: m.text })),
          }),
        });

        const data = (await res.json().catch(() => ({ error: "server" }))) as AssistantResponse;

        if (!res.ok && !data.error) {
          setErrorText(failureMessage("server"));
          return;
        }
        if (data.error || !data.reply) {
          setErrorText(failureMessage(data.error ?? "server"));
          return;
        }

        const { text, actionKeys } = parseAssistantReply(data.reply, surface);
        const reply: ChatMessage = {
          id: uid(),
          role: "assistant",
          text,
          createdAt: Date.now(),
          actionKeys,
        };
        setMessages((prev) => [...prev, reply]);
        setAnimatingId(reply.id);
      } catch {
        setErrorText(failureMessage("network"));
      } finally {
        setIsTyping(false);
      }
    },
    [surface, userName],
  );

  const send = useCallback(
    (rawText: string) => {
      const text = rawText.trim();
      if (!text || isTyping) return;
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        text,
        createdAt: Date.now(),
      };
      const next = [...messagesRef.current, userMsg];
      setMessages(next);
      void runInference(next);
    },
    [isTyping, runInference],
  );

  const retry = useCallback(() => {
    if (isTyping) return;
    // On failure we never appended a reply, so the thread already ends with the
    // user's message — just re-run inference on it.
    if (messagesRef.current.length === 0) return;
    void runInference(messagesRef.current);
  }, [isTyping, runInference]);

  const clear = useCallback(() => {
    setMessages([]);
    setErrorText("");
    setAnimatingId("");
  }, []);

  const onAnimationDone = useCallback((id: string) => {
    setAnimatingId((current) => (current === id ? "" : current));
  }, []);

  return {
    messages,
    isTyping,
    errorText,
    animatingId,
    send,
    retry,
    clear,
    onAnimationDone,
  };
}

function uid(): string {
  return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function failureMessage(kind: AssistantResponse["error"]): string {
  switch (kind) {
    case "network":
      return "You appear to be offline. Check your connection and try again.";
    case "config":
      return "The assistant isn’t available right now.";
    case "blocked":
      return "I can’t help with that one. Let’s try something else.";
    case "rate_limit":
      return "The assistant is very popular right now. Please try again in a moment.";
    default:
      return "Something went wrong. Please try again.";
  }
}
