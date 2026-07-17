import { Compass, Eye, Zap } from "lucide-react";
import { Reveal } from "./reveal";

const BELIEFS = [
  {
    icon: Eye,
    title: "Trust before the doorstep",
    body: "No blurry photos, no wasted Saturdays. If a home is on Nesty, you can walk it in 3D and trust what you see.",
  },
  {
    icon: Zap,
    title: "Calm, not cluttered",
    body: "One quiet workspace instead of five noisy tools. Fewer clicks, clearer decisions, faster closings.",
  },
  {
    icon: Compass,
    title: "Built for Tunisia, made to scale",
    body: "Local from day one — Tunis to Djerba — on an architecture ready for the region beyond.",
  },
];

/**
 * The emotional core — Nesty's objective and point of view. A full-bleed ink
 * statement so it reads as the confident, human center of the page.
 */
export function Manifesto() {
  return (
    <section id="why" className="py-12">
      <div className="mx-auto max-w-wide px-6">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-[36px] bg-ink px-8 py-16 text-paper md:px-14 md:py-20">
            <div aria-hidden="true" className="aura-blob aura-brand -left-20 -top-20 h-80 w-80 opacity-50" />
            <div
              aria-hidden="true"
              className="aura-blob aura-brand -bottom-24 right-0 h-96 w-96 opacity-40"
              style={{ animationDelay: "-5s" }}
            />

            <div className="relative">
              <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand">
                Our objective
              </span>
              <h2 className="mt-4 max-w-4xl text-3xl font-bold leading-[1.08] md:text-[52px]">
                Renting a home in 2026 should feel like{" "}
                <span className="text-brand">certainty</span>, not a gamble.
              </h2>
              <p className="mt-5 max-w-2xl text-lg text-white/70">
                Nesty is our answer — a trust-first, 3D-first platform that turns
                a fragmented, photo-guessing market into something calm, verified,
                and genuinely modern. That&rsquo;s the revolution we&rsquo;re building.
              </p>

              <div className="mt-12 grid gap-8 md:grid-cols-3">
                {BELIEFS.map((b, i) => (
                  <Reveal key={b.title} delay={i * 90}>
                    <div>
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/15 text-brand">
                        <b.icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 text-lg font-bold">{b.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-white/65">
                        {b.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
