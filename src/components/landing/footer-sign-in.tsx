"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSpace } from "./space-context";

/**
 * The footer "Sign in" link is only relevant to hosts/agencies (it goes to the
 * agency admin login), so it's hidden in the seeker space.
 */
export function FooterSignIn() {
  const t = useTranslations("footer");
  const { space } = useSpace();
  if (space !== "agency") return null;

  return (
    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium text-white/60">
      <Link href="/login" className="transition-colors hover:text-paper">
        {t("signIn")}
      </Link>
    </nav>
  );
}
