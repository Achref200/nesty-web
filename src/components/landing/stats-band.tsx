import { PLATFORM_STATS } from "@/data/showcase";
import { Reveal } from "./reveal";

/**
 * A calm proof-point band. Dark ink panel with soft auras so the numbers read
 * as the "powerful" moment between softer, lighter sections.
 */
export function StatsBand() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-wide px-6">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-[32px] bg-ink px-8 py-12 text-paper md:px-12">
            <div aria-hidden="true" className="aura-blob aura-brand -left-16 -top-16 h-64 w-64 opacity-70" />
            <div
              aria-hidden="true"
              className="aura-blob aura-brand -bottom-24 right-0 h-72 w-72 opacity-60"
              style={{ animationDelay: "-4s" }}
            />
            <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {PLATFORM_STATS.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 80}>
                  <div>
                    <p className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm font-bold text-paper">{stat.label}</p>
                    <p className="mt-1 text-[13px] text-white/60">{stat.hint}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
