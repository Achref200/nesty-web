import { useTranslations } from "next-intl";
import { Reveal } from "./reveal";
import { Parallax } from "./parallax";

/**
 * "How it works" — the story of one listing, told in four beats. Copy lives in
 * the message catalogs; the 01–04 numbers are derived from the index.
 */
export function HowItWorks() {
  const t = useTranslations("how");
  const steps = t.raw("steps") as { tag: string; title: string; body: string }[];
  return (
    <section
      id="how"
      className="relative border-t border-white/[0.06] py-24 md:py-32"
    >
      <Parallax
        speed={-0.2}
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 flex justify-start"
      >
        <span
          className="aurora-glow opacity-50"
          style={{ position: "static", width: 560, height: 560 }}
        />
      </Parallax>

      <div className="mx-auto max-w-wide px-5 md:px-8">
        <div className="grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
          {/* Left rail — sticky heading on desktop */}
          <Reveal>
            <div className="md:sticky md:top-28">
              <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
                {t("eyebrow")}
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-5xl">
                {t("title1")}
                <br />
                <span className="text-white/50">{t("title2")}</span>
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/55">
                {t("lead")}
              </p>
            </div>
          </Reveal>

          {/* Right column — the steps */}
          <ol className="relative space-y-6">
            {/* the vertical hairline running through the numbers */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[26px] top-4 bottom-4 hidden w-px bg-gradient-to-b from-white/20 via-white/8 to-transparent md:block"
            />
            {steps.map((s, i) => {
              const n = String(i + 1).padStart(2, "0");
              return (
                <Reveal key={n} delay={i * 80}>
                  <li className="group relative flex gap-5 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04] md:p-7">
                    <Parallax
                      speed={0.12}
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/12 bg-ink font-display text-[15px] font-semibold text-paper"
                    >
                      <span>{n}</span>
                    </Parallax>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                        {s.tag}
                      </span>
                      <h3 className="mt-1.5 font-display text-[19px] font-semibold leading-snug text-paper md:text-[22px]">
                        {s.title}
                      </h3>
                      <p className="mt-2.5 text-[14.5px] leading-relaxed text-white/55">
                        {s.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
