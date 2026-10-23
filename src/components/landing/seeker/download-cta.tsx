"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "../reveal";
import { StoreButtons } from "./store-buttons";

/**
 * "Download the app" CTA — the primary conversion for the traveller space.
 */
export function DownloadCta() {
  const t = useTranslations("seeker.download");

  return (
    <section className="relative border-t border-white/[0.06] py-20 md:py-28">
      <div className="mx-auto max-w-wide px-5 md:px-8" id="download">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.03] px-6 py-12 text-center md:px-12 md:py-16">
            <div
              aria-hidden="true"
              className="dark-grid pointer-events-none absolute inset-0 -z-10 opacity-40"
            />
            <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
              {t("eyebrow")}
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-5xl">
              {t("title")}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/55">
              {t("body")}
            </p>

            <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3">
              <StoreButtons className="w-full" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
