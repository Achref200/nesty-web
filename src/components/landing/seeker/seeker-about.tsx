"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "../reveal";

/** Short "about us" block that closes the traveller space. */
export function SeekerAbout() {
  const t = useTranslations("seeker.about");

  return (
    <section id="about" className="relative border-t border-white/[0.06] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[15.5px] leading-relaxed text-white/60">
            {t("body")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
