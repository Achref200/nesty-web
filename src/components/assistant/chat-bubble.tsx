"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssistantSurface, ChatMessage } from "@/lib/assistant/types";
import { AssistantAvatar } from "./typing-indicator";
import { ActionChips } from "./action-chips";

export function ChatBubble({
  message,
  surface,
  animate,
  onAnimationDone,
  onNavigate,
}: {
  message: ChatMessage;
  surface: AssistantSurface;
  animate: boolean;
  onAnimationDone: (id: string) => void;
  onNavigate?: () => void;
}) {
  const shown = useTypewriter(message.text, animate, () => onAnimationDone(message.id));
  const done = shown.length >= message.text.length;

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-[13.5px] leading-relaxed text-paper">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <AssistantAvatar />
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl rounded-bl-md bg-fill px-3.5 py-2.5 text-[13.5px] leading-relaxed text-ink">
          <RichText text={shown} />
          {!done && <span className="caret" aria-hidden="true" />}
        </div>
        {done && (
          <>
            {message.actionKeys && message.actionKeys.length > 0 && (
              <ActionChips
                actionKeys={message.actionKeys}
                surface={surface}
                onNavigate={onNavigate}
              />
            )}
            <CopyButton text={message.text} />
          </>
        )}
      </div>
    </div>
  );
}

/** Progressive reveal (~1.2s regardless of length), matching the mobile app. */
function useTypewriter(text: string, active: boolean, onDone: () => void): string {
  const [count, setCount] = useState(active ? 0 : text.length);

  useEffect(() => {
    if (!active) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const step = Math.min(6, Math.max(1, Math.ceil(text.length / 80)));
    let current = 0;
    const timer = window.setInterval(() => {
      current += step;
      if (current >= text.length) {
        current = text.length;
        window.clearInterval(timer);
        setCount(current);
        onDone();
      } else {
        setCount(current);
      }
    }, 16);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, active]);

  return text.slice(0, count);
}

/** Tiny markdown: paragraphs, "- " bullets, and **bold** — no external lib. */
function RichText({ text }: { text: string }) {
  const blocks = useMemo(() => text.split(/\n{2,}/), [text]);
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => l.trim().startsWith("- ") || l.trim() === "");
        if (isList) {
          return (
            <ul key={bi} className="ml-4 list-disc space-y-0.5">
              {lines
                .filter((l) => l.trim().startsWith("- "))
                .map((l, li) => (
                  <li key={li}>{inline(l.trim().slice(2))}</li>
                ))}
            </ul>
          );
        }
        return (
          <p key={bi} className={bi > 0 ? "mt-2" : undefined}>
            {lines.map((l, li) => (
              <span key={li}>
                {inline(l)}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

function inline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard blocked — no-op */
        }
      }}
      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-muted transition-colors hover:text-ink"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" strokeWidth={2.2} /> Copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" strokeWidth={2} /> Copy
        </>
      )}
    </button>
  );
}
