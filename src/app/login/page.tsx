"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, Mail, Lock } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { NestyLoader } from "@/components/brand/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, type AuthState } from "@/lib/actions/auth";
import { site } from "@/lib/site";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <NestyLoader size={22} showWordmark={false} />
          Signing in…
        </span>
      ) : (
        "Sign in"
      )}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState<AuthState, FormData>(signIn, {});

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 inline-flex">
          <Logo />
        </Link>

        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Agency sign-in
        </h1>
        <p className="mt-1.5 text-[15px] text-muted">
          Your Nesty dashboard — listings, visits and reservations in one place.
        </p>

        <form action={formAction} className="mt-6 flex flex-col gap-3">
          <Field icon={Mail}>
            <Input
              name="email"
              type="email"
              placeholder="you@agency.tn"
              autoComplete="email"
              required
            />
          </Field>
          <Field icon={Lock}>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              required
            />
          </Field>

          {state?.error && (
            <p className="flex items-center gap-1.5 text-sm text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </p>
          )}

          <div className="mt-1">
            <SubmitButton />
          </div>
        </form>

        <div className="mt-6 rounded-2xl border border-separator bg-card p-4 text-sm text-muted">
          Agency accounts are set up by Nesty — there&rsquo;s no sign-up here.
          Need access?{" "}
          <a href={`mailto:${site.email}`} className="font-semibold text-ink">
            Talk to us
          </a>
          .
        </div>

        <div className="mt-8 rounded-2xl border border-separator bg-paper p-4">
          <p className="text-sm font-semibold text-ink">Looking for a home?</p>
          <p className="mt-1 text-[13px] text-muted">
            The Nesty app for renters is arriving soon.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <StoreButton store="apple" />
            <StoreButton store="google" />
          </div>
        </div>
      </div>
    </main>
  );
}

function StoreButton({ store }: { store: "apple" | "google" }) {
  const label = store === "apple" ? "App Store" : "Google Play";
  return (
    <span
      aria-disabled="true"
      title="Coming soon"
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-separator bg-paper px-3 py-2.5 text-[12.5px] font-semibold text-ink/70"
    >
      {store === "apple" ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M16.365 1.43c0 1.14-.417 2.196-1.245 3.163-.997 1.163-2.257 1.834-3.522 1.735-.16-1.113.395-2.29 1.16-3.222.847-1.033 2.293-1.827 3.607-1.676zM20.5 17.03c-.635 1.44-.94 2.087-1.76 3.36-1.146 1.782-2.762 4.005-4.767 4.023-1.784.017-2.24-1.163-4.66-1.15-2.42.014-2.923 1.171-4.708 1.155-2.004-.018-3.534-2.028-4.68-3.81C-.966 16.85-1.35 11.87.988 9.026 2.64 6.998 5.29 5.802 7.78 5.802c2.55 0 4.14 1.395 6.24 1.395 2.036 0 3.276-1.397 6.223-1.397 2.238 0 4.606 1.222 6.29 3.333-5.53 3.03-4.626 10.95-6.033 7.898z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M3.6 2.4a1.6 1.6 0 0 0-.4 1.1v17c0 .4.15.79.4 1.1l10-9.6-10-9.6zm11.2 10.8-2.5 2.4L5.4 22.1c.4.15.85.1 1.24-.12l11.36-6.6-3.2-2.18zm7.6-2.5-3-1.74-3.5 3.34 3.5 3.35 3-1.75c1-.6 1-2.6 0-3.2zM6.64 2.02c-.39-.22-.85-.27-1.24-.12l7.9 8.5 3.2-3.35L6.64 2.02z" />
        </svg>
      )}
      <span className="flex flex-col leading-tight">
        <span className="text-[9.5px] font-medium uppercase tracking-[0.12em] text-muted">
          coming soon
        </span>
        <span>{label}</span>
      </span>
    </span>
  );
}

function Field({
  icon: Icon,
  children,
}: {
  icon: typeof Mail;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
      <div className="[&_input]:pl-11">{children}</div>
    </div>
  );
}
