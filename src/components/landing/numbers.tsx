import { Reveal } from "./reveal";
import { Parallax } from "./parallax";
import { PLATFORM_STATS } from "@/data/showcase";

/**
 * Quiet stats band. Four numbers, no cards, a thin parallax on the value so
 * the numbers feel like they hover slightly closer to the reader than the
 * hints below them. Divider hairlines only — no boxes.
 */
export function Numbers() {
  return (
    <section className="relative border-t border-white/[0.06] py-24 md:py-28">
      <div className="mx-auto max-w-wide px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
            nesty, so far
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-5xl">
            Small enough to answer your call.
            <br />
            <span className="text-white/50">
              Big enough to move real inventory.
            </span>
          </h2>
        </Reveal>

        <div className="mt-14 grid divide-white/[0.08] md:grid-cols-4 md:divide-x md:divide-y-0">
          {PLATFORM_STATS.map((s, i) => (
            <Reveal
              key={s.label}
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
                {s.label}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/45">
                {s.hint}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
