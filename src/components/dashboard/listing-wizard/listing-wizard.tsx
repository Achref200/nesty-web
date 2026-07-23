"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Check, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dots } from "@/components/ui/dots";
import { saveListingDraft, submitListing } from "@/lib/actions/listings";
import { clearDraft, loadDraft, saveDraft } from "@/lib/listings/draft";
import {
  STEP_VALIDATORS,
  WIZARD_STEPS,
  emptyDraft,
  mergeDraft,
  validateAll,
  type Errors,
  type ListingDraft,
  type WizardStepId,
} from "@/lib/listings/schema";
import { cn } from "@/lib/utils";
import {
  AmenitiesStep,
  GeneralStep,
  LocationStep,
  PhotosStep,
  PricingStep,
  ReviewStep,
} from "./steps";

const STEP_KEYS = WIZARD_STEPS as readonly WizardStepId[];

/** First wizard step index whose validator reports an error, else -1. */
function firstInvalidStep(draft: ListingDraft): number {
  for (let i = 0; i < STEP_KEYS.length; i++) {
    const id = STEP_KEYS[i];
    if (id === "review") continue;
    if (Object.keys(STEP_VALIDATORS[id](draft)).length > 0) return i;
  }
  return -1;
}

/**
 * The single reusable listing wizard powering both Create (`/listings/new`) and
 * Edit (`/listings/:id/edit`). Create passes no `initial`; Edit passes the
 * loaded draft. Data is preserved between steps and autosaved to localStorage.
 */
export function ListingWizard({
  initial,
  listingId,
}: {
  initial?: ListingDraft;
  listingId?: string;
}) {
  const t = useTranslations("dashboard.wizard");
  const router = useRouter();

  const [draft, setDraft] = useState<ListingDraft>(() =>
    initial ? mergeDraft(initial) : emptyDraft(),
  );
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const dirty = useRef(false);
  const ready = useRef(false);

  // Restore an in-progress local draft on mount (create flow only — Edit trusts
  // the server-loaded values).
  useEffect(() => {
    if (!initial) {
      const stored = loadDraft(listingId);
      if (stored) {
        setDraft(mergeDraft(stored.draft));
        setStep(Math.min(stored.step, STEP_KEYS.length - 1));
        toast.message(t("restored"));
      }
    }
    ready.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave to localStorage on every change (after the initial restore).
  useEffect(() => {
    if (ready.current) saveDraft(listingId, draft, step);
  }, [draft, step, listingId]);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const patch = useCallback((p: Partial<ListingDraft>) => {
    dirty.current = true;
    setDraft((d) => ({ ...d, ...p }));
  }, []);

  const stepId = STEP_KEYS[step];
  const isLast = step === STEP_KEYS.length - 1;

  function validateCurrent(): boolean {
    if (stepId === "review") return true;
    const v = STEP_VALIDATORS[stepId](draft);
    setErrors(v);
    return Object.keys(v).length === 0;
  }

  function next() {
    if (!validateCurrent()) {
      toast.error(t("fixStep"));
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEP_KEYS.length - 1));
  }

  function prev() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function goTo(i: number) {
    setErrors({});
    setStep(i);
  }

  async function onSaveDraft() {
    setSaving(true);
    const res = await saveListingDraft({ ...draft, id: draft.id ?? listingId }, step);
    setSaving(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    if (res.id && !draft.id) setDraft((d) => ({ ...d, id: res.id }));
    dirty.current = false;
    toast.success(t("draftSaved"));
  }

  async function onSubmit() {
    const v = validateAll(draft);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      const invalid = firstInvalidStep(draft);
      if (invalid >= 0) setStep(invalid);
      toast.error(t("fixAll"));
      return;
    }
    setSaving(true);
    const res = await submitListing({ ...draft, id: draft.id ?? listingId });
    setSaving(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    dirty.current = false;
    clearDraft(listingId);
    toast.success(t("finished"));
    router.push("/dashboard/listings");
    router.refresh();
  }

  function cancel() {
    clearDraft(listingId);
    router.push("/dashboard/listings");
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {t(`steps.${stepId}`)}
          </h1>
          <span className="text-[13px] font-semibold text-muted">
            {t("stepOf", { current: step + 1, total: STEP_KEYS.length })}
          </span>
        </div>
        <div className="flex gap-1.5">
          {STEP_KEYS.map((id, i) => (
            <button
              key={id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={t(`steps.${id}`)}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i < step
                  ? "bg-ink"
                  : i === step
                    ? "bg-ink"
                    : "bg-separator",
              )}
            />
          ))}
        </div>
      </div>

      {/* Active step */}
      {stepId === "general" && (
        <GeneralStep draft={draft} patch={patch} errors={errors} />
      )}
      {stepId === "photos" && (
        <PhotosStep draft={draft} patch={patch} errors={errors} />
      )}
      {stepId === "location" && (
        <LocationStep draft={draft} patch={patch} errors={errors} />
      )}
      {stepId === "amenities" && (
        <AmenitiesStep draft={draft} patch={patch} errors={errors} />
      )}
      {stepId === "pricing" && (
        <PricingStep draft={draft} patch={patch} errors={errors} />
      )}
      {stepId === "review" && <ReviewStep draft={draft} goTo={goTo} />}

      {/* Nav */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {step > 0 ? (
          <Button variant="outline" onClick={prev} disabled={saving}>
            <ArrowLeft className="h-4 w-4" /> {t("back")}
          </Button>
        ) : (
          <Button variant="ghost" onClick={cancel} disabled={saving}>
            <X className="h-4 w-4" /> {t("cancel")}
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={onSaveDraft}
          disabled={saving}
          className="ml-auto"
        >
          <Save className="h-4 w-4" /> {t("saveDraft")}
        </Button>

        {isLast ? (
          <Button onClick={onSubmit} disabled={saving}>
            {saving ? (
              <span className="inline-flex items-center gap-2">
                {t("finishing")} <Dots />
              </span>
            ) : (
              <>
                <Check className="h-4 w-4" /> {t("finish")}
              </>
            )}
          </Button>
        ) : (
          <Button onClick={next} disabled={saving}>
            {t("next")} <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
