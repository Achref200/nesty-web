"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useSpace } from "./space-context";

/**
 * Minimal landing header — just the logo and one adaptive CTA (plus the small
 * language / theme controls). No nav links: the page is short and the audience
 * switch lives in the content below.
 */
export function LandingHeader() {
  const t = useTranslations("space");
  const { space } = useSpace();
  const isSeeker = space === "seeker";

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink/70 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-wide items-center gap-3 px-5 md:px-8">
        <Link href="/" aria-label="Nesty home" className="text-paper">
          <Logo />
        </Link>

        <div className="flex-1" />

        <LanguageToggle />
        <ThemeToggle className="hidden sm:grid" />

        {isSeeker ? (
          <a
            href="#download"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill bg-paper px-4 py-2 text-[13px] font-semibold text-ink transition-transform hover:-translate-y-px"
          >
            {t("getApp")}
          </a>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill bg-paper px-4 py-2 text-[13px] font-semibold text-ink transition-transform hover:-translate-y-px"
          >
            {t("agencyLogin")}
          </Link>
        )}
      </div>
    </header>
  );
}
