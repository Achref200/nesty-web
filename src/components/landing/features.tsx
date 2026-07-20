import {
  ShieldCheck,
  Box,
  CalendarClock,
  Inbox,
  Users,
  Signal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "./reveal";

/**
 * The one section that goes into detail. Copy lives in the message catalogs;
 * the icon and grid span for each of the six cards stay here, aligned by index.
 */
const FEATURE_META: { icon: typeof ShieldCheck; span?: string }[] = [
  { icon: ShieldCheck, span: "md:col-span-2" },
  { icon: Box },
  { icon: CalendarClock },
  { icon: Inbox, span: "md:col-span-2" },
  { icon: Users },
  { icon: Signal },
];

export function Features() {
  const t = useTranslations("features");
  const items = t.raw("items") as { title: string; body: string; note: string }[];
  return (
    <section
      id="features"
      className="relative border-t border-white/[0.06] py-24 md:py-32"
    >
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

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {items.map((f, i) => {
            const meta = FEATURE_META[i];
            const Icon = meta.icon;
            return (
              <Reveal key={f.title} delay={i * 60} className={meta.span}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04] md:p-7">
                  <div className="mb-5 flex items-start justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-paper">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    </div>
                    <span className="rounded-pill border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">
                      {t("shipped")}
                    </span>
                  </div>

                  <h3 className="font-display text-[19px] font-semibold leading-snug text-paper md:text-xl">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/55">
                    {f.body}
                  </p>

                  <p className="mt-6 border-t border-white/[0.06] pt-4 text-[12px] italic text-white/40">
                    {f.note}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
