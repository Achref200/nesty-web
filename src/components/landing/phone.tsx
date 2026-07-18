import { cn } from "@/lib/utils";

/**
 * Slim dark phone frame. Presentational only — children fill the screen.
 * Sized to sit comfortably beside a workspace preview without dominating it.
 */
export function Phone({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-[260px] rounded-[2.4rem] border-[10px] border-[#0A0A0A] bg-[#0A0A0A] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]",
        className,
      )}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-pill bg-[#0A0A0A]" />
      {/* Screen */}
      <div className="relative aspect-[9/19] overflow-hidden rounded-[1.9rem] bg-ink">
        {children}
      </div>
    </div>
  );
}
