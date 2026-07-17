import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TESTIMONIALS } from "@/data/showcase";
import { Reveal } from "./reveal";

/** Agency voices — decision-maker social proof, kept soft and monochrome. */
export function Testimonials() {
  return (
    <section id="stories" className="py-20">
      <div className="mx-auto max-w-wide px-6">
        <Reveal>
          <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-brand">
            Agency stories
          </span>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold md:text-[42px]">
            Teams close faster when everything lives in one calm workspace.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90} variant="up">
              <Card className="flex h-full flex-col justify-between gap-6 p-7">
                <div>
                  <Quote className="h-7 w-7 text-brand" />
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                    “{t.quote}”
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-separator pt-5">
                  <span className="grid h-11 w-11 place-items-center rounded-pill bg-ink text-sm font-extrabold text-paper">
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{t.name}</p>
                    <p className="text-xs text-muted">
                      {t.role}, {t.agency}
                    </p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
