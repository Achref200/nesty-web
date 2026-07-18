import { Building2, Smartphone, Box } from "lucide-react";
import { Reveal } from "./reveal";
import { Parallax } from "./parallax";

/**
 * The three surfaces of Nesty, said plainly. Not "features" — surfaces. Each
 * one has a specific audience and a specific reason to exist. The copy admits
 * the boring truth (spreadsheets, WhatsApp) instead of hiding it behind
 * marketing verbs.
 */

const PILLARS = [
  {
    icon: Building2,
    tag: "for agencies",
    title: "A workspace that doesn't feel like a spreadsheet.",
    body:
      "One board for every rental you carry — nightly stays, monthly rentals, yearly leases. Team roles per agent, quick edits from a phone, and a calendar that doesn't need a group chat to stay in sync.",
  },
  {
    icon: Smartphone,
    tag: "for renters",
    title: "An app that respects your afternoon.",
    body:
      "Search by neighborhood, filter by what actually matters (metro line, sea distance, pets), tour the home in 3D, then book by the night or hold the dates for a full month — only when it's already close to a yes.",
  },
  {
    icon: Box,
    tag: "in the middle",
    title: "One truthful calendar, live in both.",
    body:
      "A booking made on mobile lands in the workspace the same second. No double check-ins, no overlapping leases, no ‘let me check with the owner and I'll call you back’.",
  },
];

export function Pillars() {
  return (
    <section
      id="pillars"
      className="relative border-t border-white/[0.06] py-24 md:py-32"
    >
      <Parallax
        speed={-0.15}
        className="pointer-events-none absolute inset-x-0 top-10 -z-10 flex justify-end"
      >
        <span
          className="aurora-glow opacity-60"
          style={{ position: "static", width: 520, height: 520 }}
        />
      </Parallax>

      <div className="mx-auto max-w-wide px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
            three surfaces, one idea
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-5xl">
            Two apps for two people.
            <br />
            <span className="text-white/50">One calendar that never lies.</span>
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/55">
            Nesty is not a CRM you glue to a website. It&rsquo;s a platform
            designed as one thing, split across the three places where real
            estate actually happens.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3 md:gap-6">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={i * 90}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 transition-colors hover:border-white/20 hover:bg-white/[0.04] md:p-8">
                  {/* corner glow on hover */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-pill bg-paper/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="mb-6 flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-paper">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-semibold leading-snug text-paper md:text-[22px]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-white/55">
                    {pillar.body}
                  </p>

                  <span className="mt-8 block h-px w-10 bg-white/20 transition-all group-hover:w-16 group-hover:bg-paper" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
