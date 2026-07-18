"use client";

import { Sparkles } from "lucide-react";

/** Assistant avatar orb — a soft ink gradient with a sparkle. */
export function AssistantAvatar({ size = 28 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-pill bg-gradient-to-br from-ink to-ink-soft text-paper shadow-sm"
      style={{ width: size, height: size }}
    >
      <Sparkles style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={2} />
    </span>
  );
}

/** Avatar + three pulsing dots, shown while the model is thinking. */
export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <AssistantAvatar />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-fill px-3.5 py-3">
        <span className="dot h-1.5 w-1.5 rounded-pill bg-muted" />
        <span
          className="dot h-1.5 w-1.5 rounded-pill bg-muted"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="dot h-1.5 w-1.5 rounded-pill bg-muted"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
}
