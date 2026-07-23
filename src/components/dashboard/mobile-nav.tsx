"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, LogOut } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";
import { DASHBOARD_NAV } from "./dashboard-nav";

/**
 * Mobile-only navigation: a hamburger button (shown below `md`) that opens a
 * slide-in drawer with the same nav as the desktop sidebar. Closes on route
 * change, backdrop tap, or Escape.
 */
export function MobileNav({ pending = 0 }: { pending?: number }) {
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const [open, setOpen] = useState(false);

  // Close whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock background scroll and support Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("openMenu")}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-separator bg-card text-ink hover:bg-fill md:hidden"
      >
        <Menu className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label={t("closeMenu")}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[82%] flex-col border-r border-separator bg-paper px-4 py-6 shadow-2xl">
            <div className="flex items-center justify-between px-2">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("closeMenu")}
                className="grid h-9 w-9 place-items-center rounded-xl text-muted hover:bg-fill hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 flex flex-1 flex-col gap-1">
              {DASHBOARD_NAV.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition-colors",
                      active
                        ? "bg-primary text-primary-fg"
                        : "text-muted hover:bg-fill hover:text-ink",
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    <span className="flex-1">{t(`nav.${item.key}`)}</span>
                    {item.key === "requests" && pending > 0 && (
                      <span
                        className={cn(
                          "grid h-5 min-w-5 place-items-center rounded-pill px-1 text-xs font-bold",
                          active
                            ? "bg-primary-fg text-primary"
                            : "bg-primary text-primary-fg",
                        )}
                      >
                        {pending}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted hover:bg-fill hover:text-ink"
              >
                <LogOut className="h-4 w-4" />
                {t("signOut")}
              </button>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
