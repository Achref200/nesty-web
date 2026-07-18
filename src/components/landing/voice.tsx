import { Reveal } from "./reveal";
import { Parallax } from "./parallax";
import { TESTIMONIALS } from "@/data/showcase";

/**
 * Three voices from the agency floor. One anchor quote on the left, two
 * shorter quotes stacked on the right — deliberately asymmetric so the page
 * doesn't read like "single centered testimonial, big number band, done".
 * Aurora drifts behind at a slow parallax speed so the words feel anchored
 * while the room breathes.
 */
export function Voice() {
  const [t1, t2, t3] = TESTIMONIALS;
  if (!t1) return null;

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

      <div className="mx-auto max-w-content px-5 md:px-8">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
            from the agency floor
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-[2.75rem]">
            Not case studies. Three people who&rsquo;d let us call them.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* Anchor quote — left, large */}
          <Reveal delay={140}>
            <FeatureCard t={t1} />
          </Reveal>

          {/* Two smaller quotes stacked */}
          <div className="flex flex-col gap-6">
            {t2 && (
              <Reveal delay={200}>
                <SmallCard t={t2} />
              </Reveal>
            )}
            {t3 && (
              <Reveal delay={260}>
                <SmallCard t={t3} />
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <figure className="relative flex h-full flex-col rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 md:p-10">
      <span
        aria-hidden="true"
        className="absolute left-6 top-2 font-display text-[7rem] leading-none text-white/[0.06]"
      >
        &ldquo;
      </span>
      <blockquote className="relative font-display text-xl font-medium leading-snug tracking-tight text-paper md:text-[1.6rem] md:leading-[1.25]">
        {t.quote}
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-pill border border-white/12 bg-white/[0.06] font-display text-[13px] font-bold text-paper">
          {t.initials}
        </span>
        <div>
          <p className="text-[13.5px] font-semibold text-paper">{t.name}</p>
          <p className="text-[12px] text-white/55">
            {t.role} · {t.agency}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

function SmallCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-7">
      <blockquote className="text-[15px] leading-relaxed text-white/80 md:text-[15.5px]">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-pill border border-white/12 bg-white/[0.05] text-[11.5px] font-bold text-paper">
          {t.initials}
        </span>
        <div>
          <p className="text-[12.5px] font-semibold text-paper">{t.name}</p>
          <p className="text-[11.5px] text-white/50">
            {t.role} · {t.agency}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
