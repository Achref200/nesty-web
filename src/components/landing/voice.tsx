import { Reveal } from "./reveal";
import { Parallax } from "./parallax";
import { TESTIMONIALS } from "@/data/showcase";

/**
 * Single pull quote from a partner agency. The quote sits on a hairline that
 * expands on reveal. Aurora drifts behind at a slow parallax speed so the
 * words feel anchored while the room breathes.
 */
export function Voice() {
  const t = TESTIMONIALS[0];
  if (!t) return null;

  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] py-24 md:py-32">
      <Parallax
        speed={-0.25}
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 flex justify-center"
      >
        <span
          className="aurora-glow opacity-70"
          style={{ position: "static", width: 620, height: 620 }}
        />
      </Parallax>

      <div className="mx-auto max-w-content px-5 text-center md:px-8">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
            from an agency floor in tunis
          </p>
        </Reveal>

        <Reveal delay={80}>
          <blockquote className="mx-auto mt-8 max-w-3xl font-display text-2xl font-medium leading-snug tracking-tight text-paper md:text-[2.5rem] md:leading-[1.15]">
            <span className="mr-1 align-top text-white/30">&ldquo;</span>
            {t.quote}
            <span className="ml-1 align-top text-white/30">&rdquo;</span>
          </blockquote>
        </Reveal>

        <Reveal delay={140}>
          <div className="mx-auto mt-8 h-px w-16 bg-white/25" />
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-pill border border-white/12 bg-white/[0.05] text-[12px] font-bold text-paper">
              {t.initials}
            </span>
            <div className="text-left">
              <p className="text-[13px] font-semibold text-paper">{t.name}</p>
              <p className="text-[12px] text-white/50">
                {t.role} · {t.agency}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
