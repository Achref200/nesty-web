"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { LanguageToggle } from "@/components/landing/language-toggle";
import { Avatar } from "@/components/dashboard/avatar";

/** Maps a dashboard pathname to its `dashboard.nav.*` translation key. */
function titleKey(pathname: string): string {
  if (pathname.startsWith("/dashboard/listings")) return "listings";
  if (pathname.startsWith("/dashboard/calendar")) return "calendar";
  if (pathname.startsWith("/dashboard/requests")) return "requests";
  if (pathname.startsWith("/dashboard/support")) return "support";
  if (pathname.startsWith("/dashboard/settings")) return "settings";
  return "overview";
}

export function Topbar({
  pending = 0,
  initial = "A",
  avatarUrl = null,
}: {
  pending?: number;
  initial?: string;
  avatarUrl?: string | null;
}) {
  const pathname = usePathname();
  const t = useTranslations("dashboard");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-separator bg-paper/80 px-6 backdrop-blur-md">
      <h1 className="font-display text-xl font-bold tracking-tight">
        {t(`nav.${titleKey(pathname)}`)}
      </h1>
      <div className="flex-1" />
      <LanguageToggle variant="light" />
      <button
        type="button"
        aria-label={t("notifications")}
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-separator bg-card text-ink hover:bg-fill"
      >
        <Bell className="h-[18px] w-[18px]" />
        {pending > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-pill bg-tertiary ring-2 ring-paper" />
        )}
      </button>
      <Link href="/dashboard/settings" aria-label={t("account")} className="shrink-0">
        <Avatar src={avatarUrl} name={initial} size={40} />
      </Link>
    </header>
  );
}
