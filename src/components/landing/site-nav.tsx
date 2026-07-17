"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-separator bg-paper/80 shadow-card backdrop-blur-md backdrop-saturate-150"
          : "border-transparent bg-paper/40 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-wide items-center gap-3 px-6">
        <Link href="/" aria-label="Nesty home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <div className="flex-1" />
        <div className="ml-2 flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Agency login</Link>
          </Button>
          <Button asChild variant="brand" size="sm" className="hidden sm:inline-flex">
            <a href="mailto:hello@nesty.tn?subject=Nesty%20Agency%20Access">
              Request access
            </a>
          </Button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-separator bg-card text-ink md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-separator bg-paper/95 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-wide flex-col gap-1 px-6 py-4 text-sm font-semibold">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-ink-soft hover:bg-fill"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <Link href="/login">Agency login</Link>
              </Button>
              <Button asChild variant="brand" onClick={() => setOpen(false)}>
                <a href="mailto:hello@nesty.tn?subject=Nesty%20Agency%20Access">
                  Request agency access
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
