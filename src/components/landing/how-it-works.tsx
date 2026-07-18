import { Reveal } from "./reveal";
import { Parallax } from "./parallax";

/**
 * "How it works" — the story of one listing, told in four beats. Each step is
 * written from the perspective of the person doing the action, with concrete
 * verbs, real objects, and honest limits ("under 3 minutes", "one tap"). No
 * abstract nouns like "streamlining" or "empowerment".
 *
 * Layout: a vertical numbered spine on desktop, stacked cards on mobile. The
 * numbers get a light parallax kick — they drift a bit faster than the copy so
 * the eye tracks them as the section enters the viewport.
 */

const STEPS = [
  {
    n: "01",
    title: "You publish the home. Once.",
    body:
      "Drop the address on the map, upload eight photos, and tag the essentials — bedrooms, floor, air-con, pet policy, and whether it rents by the night or by the month. The workspace fills the rest from the address (neighborhood, metro line, sea distance). Under 3 minutes per listing, on desktop or phone.",
    tag: "agency workspace",
  },
  {
    n: "02",
    title: "We turn photos into a walkthrough.",
    body:
      "Nesty stitches the same photos into an immersive 3D tour — room by room, in the browser, no headset. You approve it, we push it live. Renters see the truth of the space before they even pack a bag.",
    tag: "3D tour engine",
  },
  {
    n: "03",
    title: "Renters tour, save, and reserve.",
    body:
      "In the app they filter by neighborhood, walk through in 3D, save the top three, then either book a short stay (check-in / check-out) or request a long-term lease. Every request lands in your inbox with the person, the dates, and the exact slot they picked.",
    tag: "mobile app",
  },
  {
    n: "04",
    title: "The calendar tells the truth to everyone.",
    body:
      "You confirm in one tap; the app updates the same second. The team sees the same reality — no double check-ins, no overlapping leases. A monthly export goes to your accountant, unprompted.",
    tag: "live calendar",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative border-t border-white/[0.06] py-24 md:py-32"
    >
      <Parallax
        speed={-0.2}
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 flex justify-start"
      >
        <span
          className="aurora-glow opacity-50"
          style={{ position: "static", width: 560, height: 560 }}
        />
      </Parallax>

      <div className="mx-auto max-w-wide px-5 md:px-8">
        <div className="grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
          {/* Left rail — sticky heading on desktop */}
          <Reveal>
            <div className="md:sticky md:top-28">
              <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
                how it works
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-5xl">
                One listing.
                <br />
                <span className="text-white/50">Four honest steps.</span>
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/55">
                From ‘we&rsquo;ve got a new place&rsquo; to ‘the keys are
                handed over&rsquo; — this is the walk. No hidden phases, no
                accounts we open behind your back.
              </p>
            </div>
          </Reveal>

          {/* Right column — the steps */}
          <ol className="relative space-y-6">
            {/* the vertical hairline running through the numbers */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[26px] top-4 bottom-4 hidden w-px bg-gradient-to-b from-white/20 via-white/8 to-transparent md:block"
            />
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <li className="group relative flex gap-5 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04] md:p-7">
                  <Parallax
                    speed={0.12}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/12 bg-ink font-display text-[15px] font-semibold text-paper"
                  >
                    <span>{s.n}</span>
                  </Parallax>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                      {s.tag}
                    </span>
                    <h3 className="mt-1.5 font-display text-[19px] font-semibold leading-snug text-paper md:text-[22px]">
                      {s.title}
                    </h3>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed text-white/55">
                      {s.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
