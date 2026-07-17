import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  Layers,
  Mail,
  Plus,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "./reveal";

function SectionHead({
  kicker,
  title,
  sub,
  center = false,
}: {
  kicker: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : undefined}>
      <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-brand">
        {kicker}
      </span>
      <h2 className="mt-3 text-3xl font-bold md:text-[42px]">{title}</h2>
      {sub && (
        <p
          className={
            center
              ? "mx-auto mt-3 max-w-2xl text-[17px] text-muted"
              : "mt-3 max-w-2xl text-[17px] text-muted"
          }
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}

const PIPELINE_ROWS = [
  { name: "Le Kram Marina Loft", status: "3D complete", owner: "Atlas Realty" },
  { name: "Menzah Park Residence", status: "Visit booked", owner: "Medina Keys" },
  { name: "Hammamet Summer Villa", status: "Reserved", owner: "Cap Bon Living" },
  { name: "Lac 2 Smart Office", status: "Lead review", owner: "Lac Business" },
];

const STEPS = [
  {
    icon: Layers,
    n: "01",
    title: "We set up your portfolio",
    body: "Send us what you have — we migrate your listings, photos, and availability into one tidy workspace for you.",
  },
  {
    icon: Users,
    n: "02",
    title: "Your team works as one",
    body: "Agents, managers, and marketing share a single timeline, so no request ever slips between inboxes.",
  },
  {
    icon: ChartNoAxesCombined,
    n: "03",
    title: "Go live, city by city",
    body: "Launch when your inventory looks great, then open discovery to seekers on the app — one market at a time.",
  },
];

export const FAQS = [
  {
    q: "Is there a mobile app for renters?",
    a: "Yes. Agencies publish on the web workspace; seekers browse, tour homes in 3D, and book a visit or reserve in the Nesty app. The two stay in sync in real time.",
  },
  {
    q: "Is Nesty a B2B platform first?",
    a: "Yes. Agencies and property teams onboard first and publish inventory, then discovery opens to seekers once the content quality is high.",
  },
  {
    q: "How do the 3D tours work?",
    a: "Our Tour3D engine turns ordinary room photos into an immersive walkthrough — no special camera or hardware required.",
  },
  {
    q: "Can multiple agents collaborate in one workspace?",
    a: "Absolutely. Teams share listing ownership, request handling, and booking follow-up on one timeline, without switching tools.",
  },
  {
    q: "Can we launch city by city?",
    a: "Yes. Inventory can go live in phases, so your marketing and sponsorship always match the homes that are actually ready.",
  },
];

export function Features() {
  return (
    <section id="platform" className="py-20">
      <div className="mx-auto max-w-wide px-6">
        <SectionHead
          kicker="Agency workspace"
          title="A soft interface with serious operational depth."
          sub="From the first photo to the final signature, every module is built for clarity and speed — the calm on the surface is doing real work underneath."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <Reveal variant="left">
            <Card className="h-full p-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-bold">Listing pipeline board</h3>
                <Badge variant="soft">
                  <span className="shimmer-line mr-1 inline-flex h-1.5 w-1.5 rounded-pill bg-brand" />
                  Live simulation
                </Badge>
              </div>
              <div className="space-y-2.5">
                {PIPELINE_ROWS.map((row) => (
                  <div
                    key={row.name}
                    className="grid grid-cols-[1fr_auto] gap-3 rounded-2xl border border-separator bg-card px-4 py-3 transition-colors hover:border-ink/20"
                  >
                    <div>
                      <p className="font-semibold text-ink">{row.name}</p>
                      <p className="text-xs text-muted">{row.owner}</p>
                    </div>
                    <span className="self-center rounded-pill bg-fill px-2.5 py-1 text-xs font-semibold text-ink-soft">
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          <div className="grid gap-5">
            <Reveal delay={70} variant="right">
              <Card className="p-7">
                <h3 className="text-lg font-bold">Occupancy pulse</h3>
                <p className="mt-1.5 text-sm text-muted">Q3 forecast by segment</p>
                <div className="mt-5 space-y-3">
                  {([
                    ["Family homes", 74],
                    ["Summer rentals", 61],
                    ["Corporate units", 83],
                  ] as const).map(([label, pct]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs text-muted-soft">
                        <span>{label}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-2 rounded-pill bg-fill">
                        <div
                          className="h-full rounded-pill bg-brand"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>

            <Reveal delay={120} variant="right">
              <Card className="p-7">
                <h3 className="text-lg font-bold">Cross-team handoff</h3>
                <p className="mt-1.5 text-sm text-muted">
                  Marketing to sales handoff in one timeline.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  {["AM", "SK", "YR", "HB"].map((person) => (
                    <span
                      key={person}
                      className="grid h-9 w-9 place-items-center rounded-pill border border-separator bg-fill text-xs font-bold text-ink"
                    >
                      {person}
                    </span>
                  ))}
                  <span className="ml-1 text-xs text-muted">+8 teammates</span>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Steps() {
  return (
    <section id="how" className="py-20">
      <div className="mx-auto max-w-wide px-6">
        <SectionHead
          kicker="Getting started"
          title="Live in days, not quarters."
          sub="A calm rollout that respects your market timing — deploy cleanly, launch confidently, and open access when your inventory already looks its best."
        />
        <div className="relative mt-10 grid gap-5 md:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-[38px] hidden h-px bg-separator md:block"
          />
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 90} variant="up">
              <Card hover className="relative h-full p-7">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-ink text-paper">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="font-display text-sm font-extrabold text-muted-soft">
                  {step.n}
                </span>
                <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-[15px] text-muted">{step.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="py-20">
      <div className="mx-auto max-w-wide px-6">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-[32px] border border-separator bg-paper p-8 md:p-12">
            <div aria-hidden="true" className="aura-blob aura-brand -right-16 -top-16 h-72 w-72 opacity-70" />
            <div className="relative grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl font-bold md:text-[40px]">
                  Ready to run your agency on Nesty?
                </h2>
                <p className="mt-3 max-w-md text-[17px] text-muted">
                  We configure your portfolio, team roles, and launch sequence to
                  match your market plan — then open discovery when you&rsquo;re ready.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild variant="brand" size="lg">
                    <a href="mailto:hello@nesty.tn?subject=Nesty%20Agency%20Access">
                      <Mail className="h-4 w-4" /> Request agency access
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href="/login">
                      Agency login <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="grid gap-3">
                {[
                  {
                    icon: Building2,
                    t: "Dedicated agency workspace",
                    s: "Portfolio, roles, and branding configured for your team.",
                  },
                  {
                    icon: Check,
                    t: "Verified-first rollout",
                    s: "Launch city by city with content ready before traffic.",
                  },
                  {
                    icon: BadgeCheck,
                    t: "Guided onboarding",
                    s: "We migrate your listings and media for you.",
                  },
                ].map((item) => (
                  <div
                    key={item.t}
                    className="flex items-start gap-3 rounded-2xl border border-separator bg-card p-4 shadow-card"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-fill">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink">{item.t}</p>
                      <p className="text-[13px] text-muted">{item.s}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-content px-6">
        <SectionHead
          kicker="FAQ"
          title="Answers for product, growth, and deployment teams."
          center
        />
        <div className="mx-auto mt-8 max-w-3xl divide-y divide-separator rounded-3xl border border-separator bg-card">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 50}>
              <details className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink marker:hidden">
                  {faq.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-pill bg-fill text-ink transition-transform group-open:rotate-45">
                    <Plus className="h-4 w-4 group-open:hidden" />
                    <ChevronDown className="hidden h-4 w-4 group-open:block" />
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
