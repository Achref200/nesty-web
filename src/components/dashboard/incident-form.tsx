"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dots } from "@/components/ui/dots";
import { createIncident, type CreateIncidentState } from "@/lib/actions/incidents";
import { INCIDENT_TYPES } from "@/lib/incidents-config";

const selectClass =
  "h-12 w-full rounded-xl border border-separator bg-card px-3 text-[15px] text-ink outline-none transition-colors focus:border-ink";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("dashboard.incidents.form");
  return (
    <Button type="submit" size="sm" disabled={pending}>
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

export function IncidentForm({ reservationId }: { reservationId: string }) {
  const t = useTranslations("dashboard.incidents");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState<CreateIncidentState, FormData>(
    createIncident,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      toast.success(t("form.success"));
      formRef.current?.reset();
      setOpen(false);
      router.refresh();
    }
  }, [state, router, t]);

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <ShieldAlert className="h-4 w-4" /> {t("report")}
      </Button>
    );
  }

  return (
    <Card className="flex flex-col gap-4">
      <form ref={formRef} action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="reservationId" value={reservationId} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-bold uppercase tracking-wide text-muted">
              {t("form.type")}
            </span>
            <select name="type" className={selectClass} defaultValue="other">
              {INCIDENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(`types.${type}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-bold uppercase tracking-wide text-muted">
              {t("form.occurredOn")}
            </span>
            <Input type="date" name="occurredOn" />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-bold uppercase tracking-wide text-muted">
            {t("form.description")}
          </span>
          <textarea
            name="description"
            rows={3}
            required
            placeholder={t("form.descriptionPlaceholder")}
            className="w-full rounded-xl border border-separator bg-card px-4 py-3 text-[15px] text-ink outline-none placeholder:text-muted-soft focus:border-ink"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-bold uppercase tracking-wide text-muted">
            {t("form.estimatedCost")}
          </span>
          <Input type="number" name="estimatedCost" min="0" step="1" placeholder="0" />
        </label>

        {state.error && (
          <p className="text-sm font-semibold text-danger">{state.error}</p>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
          >
            {t("form.cancel")}
          </Button>
          <SubmitButton />
        </div>
      </form>
    </Card>
  );
}
