import {
  ShieldCheck,
  Box,
  CalendarClock,
  Inbox,
  Users,
  Signal,
} from "lucide-react";
import { Reveal } from "./reveal";

/**
 * The one section that goes into detail. Each feature explains what it *is*,
 * what it *isn't*, and one specific thing it does that a competitor probably
 * doesn't. Copy stays short but concrete — the goal is trust, not word count.
 */

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified before published",
    body:
      "Every address is checked against a real map, every photo is scanned for stock-image reuse, and every owner ID is manually reviewed before a rental ever appears in the app. No phantom flats, no bait pricing.",
    note: "Reviewed in under 24h, most within 4.",
    span: "md:col-span-2",
  },
  {
    icon: Box,
    title: "Browser-native 3D tours",
    body:
      "Send us eight photos of a room and we return a 360° walkthrough. No cameras to buy, no plugins to install, no app to download for the renter — it opens in a link, on any phone.",
    note: "Powered by Tour3D, our in-house engine.",
  },
  {
    icon: CalendarClock,
    title: "Nightly & monthly, one calendar",
    body:
      "The workspace, the app and every agent’s phone show the same reservation the same second. Short stays and long leases share one calendar — conflicts are impossible by design.",
    note: "Realtime, not ‘refresh to see’.",
  },
  {
    icon: Inbox,
    title: "Requests with SLA timers",
    body:
      "Every visit request, booking or lease inquiry gets a countdown, a suggested reply, and a fallback assignee. If nobody answers in 30 minutes, it re-routes. Your response time stops depending on who happens to be on WhatsApp.",
    note: "Median response cut from 4h to 11min.",
    span: "md:col-span-2",
  },
  {
    icon: Users,
    title: "Roles for the whole team",
    body:
      "Owners see only their rentals. Agents see only their assignments. Managers see everything, plus a weekly digest of what moved. No more shared logins on a sticky note.",
    note: "Owner, agent, manager, viewer.",
  },
  {
    icon: Signal,
    title: "Offline-first mobile",
    body:
      "The app remembers your last search, your saved rentals, and any 3D tour you opened — so a rider on the metro or a beach in Djerba can still browse the shortlist without a bar of signal.",
    note: "Because 4G in Sidi Bou isn’t magic.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative border-t border-white/[0.06] py-24 md:py-32"
    >
      <div className="mx-auto max-w-wide px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/40">
            the specifics
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-5xl">
            Six things Nesty does
            <br />
            <span className="text-white/50">the way you&rsquo;d hope.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 60} className={f.span}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04] md:p-7">
                  <div className="mb-5 flex items-start justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-paper">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    </div>
                    <span className="rounded-pill border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">
                      shipped
                    </span>
                  </div>

                  <h3 className="font-display text-[19px] font-semibold leading-snug text-paper md:text-xl">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/55">
                    {f.body}
                  </p>

                  <p className="mt-6 border-t border-white/[0.06] pt-4 text-[12px] italic text-white/40">
                    {f.note}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
