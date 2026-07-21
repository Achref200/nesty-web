"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Smartphone,
  Building2,
  Check,
  ArrowRight,
  ShieldCheck,
  Box,
  CalendarCheck,
} from "lucide-react";
import { Reveal } from "../reveal";
import { AppModal } from "../seeker/app-modal";

const BENEFIT_ICONS = [ShieldCheck, Box, CalendarCheck];

/**
 * The host onboarding space. A light, airy intro to the benefits of hosting on
 * Nesty, then two clearly differentiated paths: individuals (→ mobile app) and
 * agencies (→ the web workspace / login). Booking-side content stays minimal.
 */
export function HostSpace() {
  const t = useTranslations("host");
  const benefits = t.raw("benefits") as { title: string; body: string }[];
  const individualPoints = t.raw("individual.points") as string[];
  const agencyPoints = t.raw("agency.points") as string[];
  const [appOpen, setAppOpen] = useState(false);

  return (
    <>
      <main>
        {/* Intro */}
        <section className="relative isolate grain overflow-hidden pb-10 pt-10 md:pb-14 md:pt-14">
          <div
            aria-hidden="true"
            className="dark-grid pointer-events-none absolute inset-0 -z-10"
          />
          <div className="mx-auto max-w-content px-5 text-center md:px-8">
            <span className="inline-flex items-center gap-2 rounded-pill border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium uppercase tracking-wide text-white/70 backdrop-blur-sm">
              {t("eyebrow")}
            </span>
            <h1 className="mx-auto mt-7 max-w-2xl font-display text-[2.1rem] font-semibold leading-[1.05] tracking-tight text-paper sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/60 md:text-lg">
              {t("lead")}
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="mx-auto max-w-wide px-5 md:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {benefits.map((b, i) => {
              const Icon = BENEFIT_ICONS[i] ?? ShieldCheck;
              return (
                <Reveal key={b.title} delay={i * 70}>
                  <div className="h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-paper">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-paper">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-white/55">
                      {b.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Two paths */}
        <section className="mx-auto max-w-wide px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Individual — soft glass card */}
            <Reveal>
              <div className="flex h-full flex-col rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-8">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-pill border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white/70">
                  <Smartphone className="h-3.5 w-3.5" strokeWidth={2} />
                  {t("individual.tag")}
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-paper">
                  {t("individual.title")}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-white/60">
                  {t("individual.body")}
                </p>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {individualPoints.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-[14px] text-white/70">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-pill bg-white/[0.06] text-paper">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setAppOpen(true)}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-pill bg-paper px-5 py-2.5 text-[14px] font-bold text-ink transition-transform hover:-translate-y-px"
                >
                  {t("individual.cta")}
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </div>
            </Reveal>

            {/* Agency — inverted solid card */}
            <Reveal delay={100}>
              <div className="flex h-full flex-col rounded-[2rem] bg-paper p-8 text-ink shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)]">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-pill bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-paper">
                  <Building2 className="h-3.5 w-3.5" strokeWidth={2} />
                  {t("agency.tag")}
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">
                  {t("agency.title")}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                  {t("agency.body")}
                </p>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {agencyPoints.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-[14px] text-ink/80">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-pill bg-ink text-paper">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-pill bg-ink px-5 py-2.5 text-[14px] font-bold text-paper transition-transform hover:-translate-y-px"
                >
                  {t("agency.cta")}
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <AppModal open={appOpen} onClose={() => setAppOpen(false)} />
    </>
  );
}
