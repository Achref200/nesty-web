import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { site } from "@/lib/site";

/**
 * Minimalist dark footer — logo + one line + a slim link row + copy. No columns,
 * no newsletter, no social grid. All the essentials, none of the clutter.
 */
export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink text-paper">
      <div className="mx-auto max-w-wide px-5 py-14 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-[14px] leading-relaxed text-white/50">
              {site.tagline}
            </p>
            <a
              href="mailto:hello@nesty.tn?subject=Nesty%20Agency%20Access"
              className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-paper underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-paper"
            >
              hello@nesty.tn
            </a>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium text-white/60">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-paper"
              >
                {item.label}
              </a>
            ))}
            <Link href="/login" className="transition-colors hover:text-paper">
              Sign in
            </Link>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 text-[12px] text-white/40 sm:flex-row sm:items-center">
          <span>
            &copy; {new Date().getFullYear()} {site.name} · Made in Tunisia
          </span>
          <span className="uppercase tracking-[0.18em]">
            Real estate, in black &amp; white.
          </span>
        </div>
      </div>
    </footer>
  );
}
