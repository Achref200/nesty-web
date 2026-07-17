"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, CalendarCheck, Star, TrendingUp } from "lucide-react";
import { formatDinars } from "@/lib/utils";
import { FEATURED_LISTINGS } from "@/data/showcase";

const hero = FEATURED_LISTINGS[0];

/**
 * The hero visual: a primary property card with soft, mouse-reactive floating
 * chips around it. Purely decorative depth — respects reduced-motion and never
 * blocks pointer events on the underlying content.
 */
export function HeroStage() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = wrapRef.current?.querySelectorAll<HTMLElement>("[data-depth]");
    if (!nodes || nodes.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      nodes.forEach((p) => {
        const d = parseFloat(p.dataset.depth || "0.2");
        p.style.transform = `translate3d(${cx * d * -26}px, ${cy * d * -26}px, 0)`;
      });
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-[440px]">
      {/* Primary property card */}
      <div
        data-depth="0.08"
        className="relative overflow-hidden rounded-[28px] border border-separator bg-card shadow-lift"
      >
        <div className="relative aspect-[5/4]">
          <Image
            src={hero.image}
            alt={`${hero.title}, ${hero.city}`}
            fill
            sizes="440px"
            priority
            unoptimized
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent"
          />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-pill bg-paper/90 px-3 py-1 text-[11px] font-bold text-ink shadow-card backdrop-blur">
            <span className="shimmer-line inline-flex h-1.5 w-1.5 rounded-pill bg-brand" />
            Live on Nesty
          </span>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-paper">
            <div>
              <p className="text-lg font-bold leading-tight">{hero.title}</p>
              <p className="text-sm text-white/80">
                {hero.area}, {hero.city}
              </p>
            </div>
            <span className="rounded-pill bg-paper/90 px-3 py-1 text-sm font-extrabold text-ink">
              {formatDinars(hero.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Floating: new visit booked */}
      <div
        data-depth="0.42"
        className="float-slow absolute -left-6 top-16 hidden rounded-2xl border border-separator bg-card/95 px-4 py-3 shadow-float backdrop-blur sm:block"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-fill">
            <CalendarCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-bold text-ink">New visit booked</p>
            <p className="text-[11px] text-muted">Today · 15:30 · Menzah</p>
          </div>
        </div>
      </div>

      {/* Floating: rating */}
      <div
        data-depth="0.3"
        className="float-medium absolute -right-5 top-6 hidden rounded-2xl border border-separator bg-card/95 px-4 py-3 shadow-float backdrop-blur sm:block"
      >
        <div className="flex items-center gap-1 text-ink">
          <Star className="h-4 w-4 fill-ink" />
          <span className="text-sm font-extrabold">{hero.rating.toFixed(1)}</span>
        </div>
        <p className="mt-0.5 text-[11px] text-muted">{hero.reviews} guest reviews</p>
      </div>

      {/* Floating: pipeline pulse */}
      <div
        data-depth="0.5"
        className="float-fast absolute -bottom-6 right-4 hidden rounded-2xl border border-separator bg-card/95 px-4 py-3 shadow-float backdrop-blur sm:flex sm:items-center sm:gap-3"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
          <TrendingUp className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-extrabold text-ink">+22%</p>
          <p className="text-[11px] text-muted">qualified pipeline</p>
        </div>
      </div>

      {/* Floating: mini occupancy */}
      <div
        data-depth="0.36"
        className="float-medium absolute -bottom-4 -left-4 hidden w-[150px] rounded-2xl border border-separator bg-card/95 px-4 py-3 shadow-float backdrop-blur md:block"
      >
        <div className="flex items-center justify-between text-[11px] text-muted">
          <span className="inline-flex items-center gap-1 font-semibold text-ink-soft">
            <ArrowUpRight className="h-3 w-3" /> Occupancy
          </span>
          <span className="font-bold text-ink">82%</span>
        </div>
        <div className="mt-2 h-1.5 rounded-pill bg-fill">
          <div className="h-full w-[82%] rounded-pill bg-brand" />
        </div>
      </div>
    </div>
  );
}
