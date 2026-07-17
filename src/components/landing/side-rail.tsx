"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Home,
  Layers,
  Mail,
  MessageSquareQuote,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: "top", label: "Home", icon: Home },
  { id: "listings", label: "Listings", icon: Building2 },
  { id: "app", label: "Mobile app", icon: Smartphone },
  { id: "platform", label: "Platform", icon: Layers },
  { id: "stories", label: "Stories", icon: MessageSquareQuote },
  { id: "contact", label: "Contact", icon: Mail },
] as const;

/**
 * Floating vertical icon rail (desktop) — the primary section navigation. A
 * scroll-spy keeps the active section highlighted in ink. Purely additive to
 * the slim top bar, which still carries the brand + CTAs on every screen.
 */
export function SideRail() {
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const sections = ITEMS.map((i) => document.getElementById(i.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the viewport center that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((el) => io.observe(el));

    const onScroll = () => {
      if (window.scrollY < 200) setActive("top");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 md:block"
    >
      <div className="flex flex-col items-center gap-1.5 rounded-pill border border-separator bg-card/80 p-2 shadow-float backdrop-blur-md">
        {ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={`#${item.id}`}
              aria-label={item.label}
              aria-current={isActive ? "true" : undefined}
              className="group relative grid h-11 w-11 place-items-center"
            >
              <span
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-2xl transition-all duration-300",
                  isActive
                    ? "bg-brand text-white shadow-glow"
                    : "text-muted hover:bg-fill hover:text-ink",
                )}
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
              </span>
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-[3.4rem] whitespace-nowrap rounded-xl bg-ink px-2.5 py-1.5 text-xs font-semibold text-paper opacity-0 shadow-float transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
