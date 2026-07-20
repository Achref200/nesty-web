import { cn } from "@/lib/utils";

/**
 * The nested-curves brand mark, drawing itself on a loop — Nesty's branded
 * loading state. Monochrome: inherits `currentColor` (ink on paper, paper on
 * ink), so it drops into any surface — set the text colour on the caller.
 * Animation classes live in globals.css.
 */
export function NestyLoader({
  size = 92,
  showWordmark = true,
  className,
}: {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "nesty-loader flex flex-col items-center gap-3.5",
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <svg
        viewBox="0 0 200 140"
        style={{ width: size, height: size * 0.7 }}
        aria-hidden="true"
      >
        <path
          className="draw draw-outer"
          strokeWidth={8}
          d="M20 120 C20 45 55 20 100 20 C145 20 180 45 180 120"
        />
        <path
          className="draw draw-middle"
          strokeWidth={6.5}
          d="M42 125 C42 62 65 42 100 42 C135 42 158 62 158 125"
        />
        <path
          className="draw draw-inner"
          strokeWidth={5}
          d="M62 130 C62 80 78 62 100 62 C122 62 138 80 138 130"
        />
      </svg>
      {showWordmark && (
        <span className="wordmark font-display text-lg font-semibold tracking-tight">
          nesty.
        </span>
      )}
    </div>
  );
}

/** Full-screen centered loader for route/app loading fallbacks. */
export function NestyLoaderScreen() {
  return (
    <div className="grid min-h-screen w-full place-items-center bg-paper text-ink">
      <NestyLoader />
    </div>
  );
}

/**
 * Fixed, full-viewport dim overlay with the branded loader — for blocking
 * client waits (form submits, language switches, `router.refresh()`). Render it
 * conditionally on a pending flag. Defaults to an ink mark on a paper scrim;
 * pass `className="bg-ink/70 text-paper"` on dark surfaces like the landing.
 */
export function NestyLoaderOverlay({
  label = "Loading",
  size = 72,
  className,
}: {
  label?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center bg-paper/70 text-ink backdrop-blur-sm",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <NestyLoader size={size} />
    </div>
  );
}
