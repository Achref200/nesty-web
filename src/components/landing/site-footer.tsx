import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { site } from "@/lib/site";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Live inventory", href: "/#listings" },
      { label: "Mobile app", href: "/#app" },
      { label: "Agency workspace", href: "/#platform" },
      { label: "How it works", href: "/#how" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "One platform", href: "/#ecosystem" },
      { label: "Why Nesty", href: "/#why" },
      { label: "Agency stories", href: "/#stories" },
      { label: "Agency login", href: "/login" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-separator bg-paper">
      <div className="mx-auto max-w-wide px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted">{site.tagline}</p>
            <a
              href="mailto:hello@nesty.tn?subject=Nesty%20Agency%20Access"
              className="mt-5 inline-flex items-center gap-2 rounded-pill border border-separator bg-card px-4 py-2 text-sm font-semibold text-ink shadow-card transition-colors hover:bg-fill"
            >
              <Mail className="h-4 w-4" /> hello@nesty.tn
            </a>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted-soft">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-1 text-muted transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-separator pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <span>
            &copy; {new Date().getFullYear()} {site.name} &middot; Made in Tunisia
          </span>
          <a
            href="mailto:hello@nesty.tn?subject=Nesty%20Agency%20Access"
            className="inline-flex items-center gap-1 font-semibold text-brand transition-opacity hover:opacity-70"
          >
            Request agency access <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
