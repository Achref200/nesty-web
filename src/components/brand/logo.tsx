import { cn } from "@/lib/utils";

/** The Nesty house mark + wordmark, in one place. */
export function Logo({
  className,
  showWordmark = true,
  size = 26,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className="grid place-items-center rounded-lg bg-ink text-paper"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          fill="currentColor"
          style={{ width: size * 0.62, height: size * 0.62 }}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24 80 L24 47 Q24 43 27 40 L46 24 Q50 20.5 54 24 L73 40 Q76 43 76 47 L76 80 Q76 82 74 82 L26 82 Q24 82 24 80 Z M61.5 54 A11.5 11.5 0 1 0 38.5 54 A11.5 11.5 0 1 0 61.5 54 Z"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="font-display text-xl font-extrabold tracking-tight">
          Nesty
        </span>
      )}
    </span>
  );
}
