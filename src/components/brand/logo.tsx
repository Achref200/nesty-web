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
      <svg
        viewBox="0 0 200 140"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        style={{ width: size * 1.3, height: size * 0.91 }}
        aria-hidden="true"
      >
        <path strokeWidth={10} d="M20 120 C20 45 55 20 100 20 C145 20 180 45 180 120" />
        <path strokeWidth={8.5} d="M42 125 C42 62 65 42 100 42 C135 42 158 62 158 125" />
        <path strokeWidth={7} d="M62 130 C62 80 78 62 100 62 C122 62 138 80 138 130" />
      </svg>
      {showWordmark && (
        <span className="font-display text-xl font-extrabold tracking-tight">
          Nesty
        </span>
      )}
    </span>
  );
}
