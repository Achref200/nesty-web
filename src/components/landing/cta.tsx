import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "./reveal";
import { Parallax } from "./parallax";
import { site, agencyAccessMailto } from "@/lib/site";

/**
 * Final call-to-action. One headline that names the specific ask, a short
 * paragraph that sets the expectation ("we open access agency by agency"),
 * and two buttons — one for new agencies, one for people already in.
 *
 * A big aurora drifts up behind the text on parallax so the closing feels
 * cinematic without needing a hero image.
 */
export function Cta() {
  const t = useTranslations("cta");
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] py-24 md:py-32">
      <Parallax
        speed={-0.4}
        className="pointer-events-none absolute inset-x-0 -bottom-32 -z-10 flex justify-center"
      >
        <span
          className="aurora-glow"
          style={{ position: "static", width: 820, height: 820 }}
        />
      </Parallax>

      <div className="mx-auto max-w-content px-5 text-center md:px-8">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
            {t("eyebrow")}
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-paper md:text-[4rem]">
            {t("title1")}
            <br />
            <span className="text-white/50">{t("title2")}</span>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/55 md:text-base">
            {t("body")}
          </p>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={agencyAccessMailto}
              className="group inline-flex items-center justify-center gap-2 rounded-pill bg-paper px-6 py-3.5 text-[14px] font-semibold text-ink transition-transform hover:-translate-y-px"
            >
              {t("requestAccess")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-pill border border-white/15 bg-transparent px-6 py-3.5 text-[14px] font-semibold text-paper transition-colors hover:bg-white/[0.06]"
            >
              {t("haveAccount")}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-8 text-[12px] uppercase tracking-[0.18em] text-white/35">
            {t("replyLine", { email: site.email })}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
