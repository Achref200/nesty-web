import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/logo";
import { site, agencyAccessMailto } from "@/lib/site";
import { FooterSignIn } from "./footer-sign-in";

/**
 * Minimalist dark footer — logo + one line + a slim link row + copy. No columns,
 * no newsletter, no social grid. All the essentials, none of the clutter.
 */
export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="border-t border-white/[0.06] bg-ink text-paper">
      <div className="mx-auto max-w-wide px-5 py-14 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-[14px] leading-relaxed text-white/50">
              {t("tagline")}
            </p>
            <a
              href={agencyAccessMailto}
              className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-paper underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-paper"
            >
              {site.email}
            </a>
          </div>

          <FooterSignIn />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 text-[12px] text-white/40 sm:flex-row sm:items-center">
          <span>
            {t("copyright", { year: new Date().getFullYear(), name: site.name })}
          </span>
          <span className="uppercase tracking-[0.18em]">{t("rightNote")}</span>
        </div>
      </div>
    </footer>
  );
}
