"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Dark, minimalist landing header. Sticky, translucent on scroll, no clutter —
 * logo left, three anchors + one CTA right. Mobile drawer collapses into a
 * calm vertical stack. Inverted colour scheme (paper text on ink surface).
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-white/10 bg-ink/70 backdrop-blur-md backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-wide items-center gap-3 px-5 md:px-8">
        <Link
          href="/"
          aria-label="Nesty home"
          onClick={() => setOpen(false)}
          className="text-paper"
        >
          <Logo />
        </Link>

        <nav className="ml-8 hidden items-center gap-7 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-white/60 transition-colors hover:text-paper"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-pill px-3.5 py-2 text-[13px] font-semibold text-white/70 transition-colors hover:text-paper"
          >
            Sign in
          </Link>
          <a
            href="mailto:hello@nesty.tn?subject=Nesty%20Agency%20Access"
            className="inline-flex items-center gap-2 rounded-pill bg-paper px-4 py-2 text-[13px] font-semibold text-ink transition-transform hover:-translate-y-px"
          >
            Request access
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-paper md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-white/10 bg-ink/95 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-wide flex-col gap-1 px-5 py-4 text-sm">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-paper"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/12 bg-transparent px-4 py-3 text-center text-sm font-semibold text-paper transition-colors hover:bg-white/[0.06]"
              >
                Sign in
              </Link>
              <a
                href="mailto:hello@nesty.tn?subject=Nesty%20Agency%20Access"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-paper px-4 py-3 text-center text-sm font-semibold text-ink"
              >
                Request agency access
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
