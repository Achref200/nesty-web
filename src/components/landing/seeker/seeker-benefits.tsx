"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck, Box, Wallet, CalendarCheck } from "lucide-react";
import { Reveal } from "../reveal";

const ICONS = [ShieldCheck, Box, Wallet, CalendarCheck];

/** Traveller-facing value props for the seeker space. */
export function SeekerBenefits() {
  const t = useTranslations("seeker.benefits");
  const items = t.raw("items") as { title: string; body: string }[];

  return (
    <section className="relative border-t border-white/[0.06] py-20 md:py-28">
      <div className="mx-auto max-w-wide px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-4xl">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <Reveal key={item.title} delay={i * 70}>
                <div className="h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-paper">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-paper">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/55">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
