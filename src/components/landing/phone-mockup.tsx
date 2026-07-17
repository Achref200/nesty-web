import { cn } from "@/lib/utils";

/**
 * A clean monochrome phone frame. Children render as the screen content. Kept
 * presentational so it can hold any app mock.
 */
export function PhoneMockup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-[280px] rounded-[2.6rem] border-[10px] border-ink bg-ink shadow-lift",
        className,
      )}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-2 z-10 h-6 w-32 -translate-x-1/2 rounded-pill bg-ink" />
      {/* Screen */}
      <div className="relative aspect-[9/19] overflow-hidden rounded-[2rem] bg-paper">
        {children}
      </div>
    </div>
  );
}
