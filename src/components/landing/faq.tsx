import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "./reveal";

/**
 * FAQ accordion. Questions/answers live in the message catalogs
 * (messages/{en,fr}.json → "faq.items"), so the visible copy and the FAQPage
 * JSON-LD (built from the same catalog in app/page.tsx) stay in sync and both
 * localize. Answers are plain strings so they can be reused verbatim in the
 * structured data.
 */
type FaqItem = { q: string; a: string };

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];
  return (
    <section
      id="faq"
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

        <div className="mx-auto mt-14 max-w-3xl">
          {items.map((item, i) => (
            <Reveal key={item.q} delay={i * 40}>
              <details className="group border-b border-white/[0.08] py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-[17px] font-semibold leading-snug text-paper md:text-lg">
                    {item.q}
                  </span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-white/60 transition-colors group-open:border-white/25 group-open:text-paper">
                    <Plus
                      className="h-4 w-4 transition-transform duration-300 group-open:rotate-45"
                      strokeWidth={2}
                    />
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 pr-12 text-[14.5px] leading-relaxed text-white/55">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
