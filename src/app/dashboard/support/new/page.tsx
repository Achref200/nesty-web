"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { ArrowLeft, AlertCircle, LifeBuoy } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dots } from "@/components/ui/dots";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { createTicket, type CreateTicketState } from "@/lib/actions/tickets";
import {
  TICKET_AREAS,
  TICKET_SEVERITIES,
  TICKET_TYPES,
} from "@/lib/tickets-config";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

const selectClass =
  "h-12 w-full rounded-xl border border-separator bg-card px-3 text-[15px] text-ink outline-none transition-colors focus:border-ink";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("dashboard.support.form");
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          {t("submitting")} <Dots />
        </span>
      ) : (
        t("submit")
      )}
    </Button>
  );
}

export default function NewTicketPage() {
  const t = useTranslations("dashboard.support");
  const [state, formAction] = useFormState<CreateTicketState, FormData>(
    createTicket,
    {},
  );
  const [screens, setScreens] = useState<string[]>([]);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/support"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> {t("form.back")}
      </Link>

      <div className="mb-6 rounded-3xl border border-separator bg-card/70 p-6 glass-panel">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-fill px-3 py-1 text-xs font-bold uppercase tracking-wide text-muted">
          <LifeBuoy className="h-3.5 w-3.5" /> {t("title")}
        </span>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
          {t("form.title")}
        </h1>
        <p className="mt-1.5 max-w-lg text-[15px] text-muted">
          {t("form.subtitle")}
        </p>
      </div>

      <form action={formAction}>
        <input type="hidden" name="attachments" value={screens.join(",")} />
        <Card className="flex flex-col gap-5">
          <Field label={t("form.subject")}>
            <Input
              name="subject"
              placeholder={t("form.subjectPlaceholder")}
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t("form.category")}>
              <select name="area" className={selectClass} defaultValue="other">
                {TICKET_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {t(`areas.${a}`)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("form.type")}>
              <select name="type" className={selectClass} defaultValue="bug">
                {TICKET_TYPES.map((x) => (
                  <option key={x} value={x}>
                    {t(`types.${x}`)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("form.severity")}>
              <select
                name="severity"
                className={selectClass}
                defaultValue="medium"
              >
                {TICKET_SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {t(`severities.${s}`)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={t("form.description")}>
            <textarea
              name="description"
              rows={5}
              required
              placeholder={t("form.descriptionPlaceholder")}
              className="w-full resize-y rounded-xl border border-separator bg-card p-4 text-base text-ink outline-none transition-colors placeholder:text-muted-soft focus:border-ink"
            />
          </Field>

          <Field label={t("form.screenshots")}>
            <ImageUpload onChange={setScreens} />
          </Field>

          {state?.error && (
            <p className="flex items-center gap-1.5 text-sm text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </p>
          )}

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </Card>
      </form>
    </div>
  );
}
