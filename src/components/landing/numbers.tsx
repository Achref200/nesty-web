import { useTranslations } from "next-intl";
import { Reveal } from "./reveal";
import { Parallax } from "./parallax";
import { PLATFORM_STATS } from "@/data/showcase";

/**
 * Quiet stats band. Numeric values come from the data module; labels and hints
 * are translated (aligned by index).
 */
export function Numbers() {
  const t = useTranslations("numbers");
  const stats = t.raw("stats") as { label: string; hint: string }[];
  return (
    <section className="relative border-t border-white/[0.06] py-24 md:py-28">
      <div className="mx-auto max-w-wide px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-5xl">
            {t("title1")}
            <br />
            <span className="text-white/50">{t("title2")}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid divide-white/[0.08] md:grid-cols-4 md:divide-x md:divide-y-0">
          {PLATFORM_STATS.map((s, i) => (
            <Reveal
              key={i}
              delay={i * 80}
              className={
                "border-t border-white/[0.08] py-8 md:border-t-0 md:px-8 md:first:pl-0 md:last:pr-0" +
                (i === 0 ? " md:pl-0" : "")
              }
            >
              <Parallax speed={0.08}>
                <p className="font-display text-[2.6rem] font-semibold tracking-tight text-paper md:text-5xl">
                  {s.value}
                </p>
              </Parallax>
              <p className="mt-2 text-[13px] font-semibold text-paper/85">
                {stats[i].label}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/45">
                {stats[i].hint}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
