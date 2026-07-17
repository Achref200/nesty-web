import { AGENCIES } from "@/data/showcase";

/**
 * An infinite, edge-faded strip of partner agencies. The track is duplicated so
 * the CSS marquee loops seamlessly; hovering pauses it.
 */
export function TrustMarquee() {
  const row = [...AGENCIES, ...AGENCIES];
  return (
    <section aria-label="Partner agencies" className="border-y border-separator py-10">
      <div className="mx-auto max-w-wide px-6">
        <p className="text-center text-[13px] font-bold uppercase tracking-[0.14em] text-muted-soft">
          Trusted by agencies publishing across Tunisia
        </p>
      </div>
      <div className="marquee-mask marquee-pause mt-7 overflow-hidden">
        <div className="marquee-track gap-3 pr-3">
          {row.map((agency, i) => (
            <div
              key={`${agency.name}-${i}`}
              className="inline-flex shrink-0 items-center gap-3 rounded-2xl border border-separator bg-card px-4 py-3 shadow-card"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-xs font-extrabold text-paper">
                {agency.initials}
              </span>
              <span className="whitespace-nowrap">
                <span className="block text-sm font-bold text-ink">{agency.name}</span>
                <span className="block text-xs text-muted">
                  {agency.city} · {agency.listings} listings
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
