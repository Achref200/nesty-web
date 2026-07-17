import { ECOSYSTEM } from "@/data/showcase";
import { Reveal } from "./reveal";

/**
 * "One platform" — how the agency web workspace, the seeker app, the Tour3D
 * engine, and the realtime backend fit together as a single system.
 */
export function Ecosystem() {
  return (
    <section id="ecosystem" className="py-20">
      <div className="mx-auto max-w-wide px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-brand">
            One platform
          </span>
          <h2 className="mt-3 text-3xl font-bold md:text-[42px]">
            Two apps, one living system.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[17px] text-muted">
            Agencies work on the web. Seekers explore on mobile. A booking on one
            side updates the other in real time — no exports, no double entry.
          </p>
        </Reveal>

        <div className="relative mt-12 grid gap-4 md:grid-cols-4">
          {/* Connecting spine (desktop) */}
          <div
            aria-hidden="true"
            className="absolute left-[12%] right-[12%] top-[42px] hidden h-px bg-gradient-to-r from-transparent via-separator to-transparent md:block"
          />
          {ECOSYSTEM.map((node, i) => (
            <Reveal key={node.title} delay={i * 90} variant="up">
              <div className="relative flex h-full flex-col rounded-3xl border border-separator bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-ink text-paper">
                  <node.icon className="h-6 w-6" />
                </span>
                <span className="mt-5 text-[11px] font-bold uppercase tracking-[0.08em] text-brand">
                  {node.tag}
                </span>
                <h3 className="mt-1 text-lg font-bold text-ink">{node.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  {node.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
