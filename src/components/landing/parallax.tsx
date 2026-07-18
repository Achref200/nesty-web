"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Small parallax primitive. Translates its child on the Y axis as the element
 * crosses the viewport — negative speed for background/behind layers, positive
 * for foreground drift. Uses rAF to coalesce scroll events (never fires more
 * than once per frame) and quietly disables itself when the OS asks us to.
 *
 * Kept intentionally cheap: one transform per element, no layout thrash,
 * `will-change` set once. Server-rendered content stays static (SEO-safe).
 */
export function Parallax({
  children,
  className,
  speed = 0.2,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Negative pushes with the scroll (background), positive against it. */
  speed?: number;
  as?: keyof JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let lastY = -1;

    const tick = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight || 800;
      // -1 when the element is a full viewport below the fold,
      //  0 when centered,
      // +1 when a full viewport above.
      const progress =
        (rect.top + rect.height / 2 - winH / 2) / (winH * 0.85);
      const y = -progress * speed * 120;
      if (Math.abs(y - lastY) < 0.25) return;
      lastY = y;
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };

    el.style.willChange = "transform";
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  const Component = Tag as any;
  return (
    <Component ref={ref} className={cn(className)}>
      {children}
    </Component>
  );
}
