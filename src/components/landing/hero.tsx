import { ArrowRight, ChevronDown } from "lucide-react";
import { TypingHeadline } from "./typing-headline";
import { HeroStage } from "./hero-stage";
import { Button } from "@/components/ui/button";
import { AGENCIES } from "@/data/showcase";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-16 md:pb-24 md:pt-24">
      {/* Soft monochrome auras + concentric rings backdrop. */}
      <div
        aria-hidden="true"
        className="landing-rings pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px]"
      />
      <div
        aria-hidden="true"
        className="aura-blob aura-brand pointer-events-none -z-10 h-72 w-72 opacity-60"
        style={{ top: "4rem", left: "-4rem" }}
      />

      <div className="mx-auto grid max-w-wide items-center gap-12 px-6 lg:grid-cols-[1.02fr_0.98fr]">
        {/* Copy */}
        <div>
          <span className="mb-6 inline-flex items-center gap-2 rounded-pill bg-brand-soft px-3 py-1.5 text-[13px] font-bold tracking-wide text-brand-strong shadow-card">
            <span className="h-1.5 w-1.5 rounded-pill bg-brand" />
            Made in Tunisia · Trust-first PropTech
          </span>
          <h1 className="text-[2.6rem] font-extrabold leading-[1.04] sm:text-6xl md:text-7xl">
            <TypingHeadline text={site.tagline} />
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted md:text-xl">
            Nesty is the calm control tower for real-estate teams — publish
            premium listings, answer every visit request, and watch inventory
            turn into signed deals. Your agency on the web; your homes alive in
            an app people actually enjoy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="brand" size="lg">
              <a href="mailto:hello@nesty.tn?subject=Nesty%20Agency%20Access">
                Request agency access <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#listings">See live inventory</a>
            </Button>
          </div>

          {/* Trust row */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-2.5">
              {AGENCIES.slice(0, 5).map((a) => (
                <span
                  key={a.name}
                  title={a.name}
                  className="grid h-9 w-9 place-items-center rounded-pill border-2 border-paper bg-ink text-[11px] font-extrabold text-paper"
                >
                  {a.initials}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted">
              <span className="font-bold text-brand-strong">40+ agencies</span> onboarding
              across 9 Tunisian cities
            </p>
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <HeroStage />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="mt-14 hidden justify-center md:flex">
        <a
          href="#listings"
          aria-label="Scroll to explore"
          className="scroll-cue grid h-11 w-11 place-items-center rounded-pill border border-separator bg-card text-muted shadow-card transition-colors hover:text-ink"
        >
          <ChevronDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}
