"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChipGroup, type ChipOption } from "@/components/ui/chip-group";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { cn, formatDinars } from "@/lib/utils";
import {
  AMENITIES,
  CANCELLATION_POLICIES,
  LIMITS,
  LISTING_TAGS,
  PAYMENT_METHODS,
  PAYMENT_POLICIES,
  PHOTO_MAX,
  PHOTO_MIN,
  PRICING_MODELS,
  PROPERTY_TYPES,
  type Errors,
  type ListingDraft,
} from "@/lib/listings/schema";
// Leaflet needs the browser, so load the picker client-side only.
const LocationPicker = dynamic(
  () =>
    import("@/components/dashboard/location-picker").then(
      (m) => m.LocationPicker,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full animate-pulse rounded-2xl bg-fill" />
    ),
  },
);
/* ─────────────────────────── Shared field chrome ─────────────────────────── */

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
      {hint && !error && <span className="text-[13px] text-muted">{hint}</span>}
      {error && <span className="text-[13px] text-danger">{error}</span>}
    </label>
  );
}

function Stepper({
  label,
  value,
  min = 0,
  onChange,
  error,
}: {
  label: string;
  value: number;
  min?: number;
  onChange: (n: number) => void;
  error?: string;
}) {
  return (
    <Field label={label} error={error}>
      <div className="inline-flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid h-9 w-9 place-items-center rounded-xl bg-fill text-ink hover:bg-separator"
          aria-label="−"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-lg font-bold tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="grid h-9 w-9 place-items-center rounded-xl bg-fill text-ink hover:bg-separator"
          aria-label="+"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </Field>
  );
}

export interface StepProps {
  draft: ListingDraft;
  patch: (p: Partial<ListingDraft>) => void;
  errors: Errors;
}

const textareaCls =
  "w-full rounded-xl border border-separator bg-card p-4 text-base text-ink outline-none transition-colors placeholder:text-muted-soft focus:border-ink";

/* ─────────────────────────── Step 1 — General ─────────────────────────── */

export function GeneralStep({ draft, patch, errors }: StepProps) {
  const t = useTranslations("dashboard.wizard.general");
  const et = useTranslations("dashboard.wizard.err");
  const ot = useTranslations("dashboard.wizard.opt.property");

  const typeOptions: ChipOption[] = PROPERTY_TYPES.map((v) => ({
    value: v,
    label: ot(v),
  }));

  return (
    <Card className="flex flex-col gap-5">
      <Field
        label={t("title")}
        error={errors.title ? et(errors.title) : undefined}
      >
        <Input
          value={draft.title}
          maxLength={LIMITS.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder={t("titlePlaceholder")}
        />
      </Field>

      <Field label={t("propertyType")} error={errors.propertyType ? et(errors.propertyType) : undefined}>
        <ChipGroup
          single
          options={typeOptions}
          value={[draft.propertyType]}
          onChange={(v) => patch({ propertyType: v[0] as ListingDraft["propertyType"] })}
        />
      </Field>

      <Field
        label={t("phone")}
        error={errors.contactPhone ? et(errors.contactPhone) : undefined}
      >
        <Input
          type="tel"
          value={draft.contactPhone}
          onChange={(e) => patch({ contactPhone: e.target.value })}
          placeholder={t("phonePlaceholder")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 min-[380px]:grid-cols-3">
        <Stepper
          label={t("maxGuests")}
          value={draft.maxGuests}
          min={1}
          onChange={(n) => patch({ maxGuests: n })}
          error={errors.maxGuests ? et(errors.maxGuests) : undefined}
        />
        <Stepper
          label={t("bedrooms")}
          value={draft.bedrooms}
          onChange={(n) => patch({ bedrooms: n })}
          error={errors.bedrooms ? et(errors.bedrooms) : undefined}
        />
        <Stepper
          label={t("bathrooms")}
          value={draft.bathrooms}
          onChange={(n) => patch({ bathrooms: n })}
          error={errors.bathrooms ? et(errors.bathrooms) : undefined}
        />
      </div>

      <Field
        label={t("description")}
        error={errors.description ? et(errors.description) : undefined}
        hint={`${draft.description.length} / ${LIMITS.description}`}
      >
        <textarea
          rows={4}
          value={draft.description}
          maxLength={LIMITS.description}
          onChange={(e) => patch({ description: e.target.value })}
          placeholder={t("descriptionPlaceholder")}
          className={textareaCls}
        />
      </Field>
    </Card>
  );
}

/* ─────────────────────────── Step 2 — Photos ─────────────────────────── */

export function PhotosStep({ draft, patch, errors }: StepProps) {
  const t = useTranslations("dashboard.wizard.photos");
  const et = useTranslations("dashboard.wizard.err");
  return (
    <Card className="flex flex-col gap-3">
      <p className="text-[15px] font-bold">{t("heading")}</p>
      <p className="text-[13px] text-muted">
        {t("hint", { min: PHOTO_MIN, max: PHOTO_MAX })}
      </p>
      <ImageUpload
        initialUrls={draft.gallery}
        onChange={(urls) => patch({ gallery: urls, cover: urls[0] ?? null })}
      />
      <p
        className={cn(
          "text-[13px]",
          draft.gallery.length < PHOTO_MIN ? "text-danger" : "text-muted",
        )}
      >
        {t("count", { n: draft.gallery.length, min: PHOTO_MIN })}
      </p>
      {errors.gallery && (
        <p className="text-[13px] text-danger">{et(errors.gallery)}</p>
      )}
    </Card>
  );
}

/* ─────────────────────────── Step 3 — Location ─────────────────────────── */

export function LocationStep({ draft, patch, errors }: StepProps) {
  const t = useTranslations("dashboard.wizard.location");
  const et = useTranslations("dashboard.wizard.err");
  return (
    <Card className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("city")} error={errors.city ? et(errors.city) : undefined}>
          <Input
            value={draft.city}
            onChange={(e) => patch({ city: e.target.value })}
            placeholder={t("cityPlaceholder")}
          />
        </Field>
        <Field label={t("district")}>
          <Input
            value={draft.district}
            onChange={(e) => patch({ district: e.target.value })}
            placeholder={t("districtPlaceholder")}
          />
        </Field>
      </div>
      <Field
        label={t("address")}
        error={errors.address ? et(errors.address) : undefined}
      >
        <Input
          value={draft.address}
          maxLength={LIMITS.address}
          onChange={(e) => patch({ address: e.target.value })}
          placeholder={t("addressPlaceholder")}
        />
      </Field>
      <Field
        label={t("pinHeading")}
        error={errors.map ? et(errors.map) : undefined}
      >
        <LocationPicker
          value={
            draft.latitude != null && draft.longitude != null
              ? { lat: draft.latitude, lng: draft.longitude }
              : null
          }
          onChange={(pos) =>
            patch({ latitude: pos?.lat ?? null, longitude: pos?.lng ?? null })
          }
        />
      </Field>
    </Card>
  );
}

/* ────────────────────── Step 4 — Amenities / tags / rules ────────────────────── */

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 rounded-xl bg-fill px-4 py-3 text-left"
    >
      <span className="text-sm font-semibold">{label}</span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-ink" : "bg-separator",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-all",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

export function AmenitiesStep({ draft, patch, errors }: StepProps) {
  const t = useTranslations("dashboard.wizard.amenities");
  const et = useTranslations("dashboard.wizard.err");
  const at = useTranslations("dashboard.wizard.opt.amenity");
  const tt = useTranslations("dashboard.wizard.opt.tag");

  const amenityOptions: ChipOption[] = AMENITIES.map((v) => ({
    value: v,
    label: at(v),
  }));
  const tagOptions: ChipOption[] = LISTING_TAGS.map((v) => ({
    value: v,
    label: tt(v),
  }));

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-bold">{t("heading")}</p>
          <div className="flex gap-3 text-[13px] font-semibold">
            <button
              type="button"
              className="text-muted hover:text-ink"
              onClick={() => patch({ amenities: [...AMENITIES] })}
            >
              {t("selectAll")}
            </button>
            <button
              type="button"
              className="text-muted hover:text-ink"
              onClick={() => patch({ amenities: [] })}
            >
              {t("clearAll")}
            </button>
          </div>
        </div>
        <ChipGroup
          showCheck
          options={amenityOptions}
          value={draft.amenities}
          onChange={(v) => patch({ amenities: v })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[15px] font-bold">{t("tagsHeading")}</p>
        <ChipGroup
          options={tagOptions}
          value={draft.tags}
          onChange={(v) => patch({ tags: v })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[15px] font-bold">{t("rulesHeading")}</p>
        <div className="grid gap-2 sm:grid-cols-3">
          <Toggle
            label={t("pets")}
            checked={draft.rules.pets}
            onChange={(v) => patch({ rules: { ...draft.rules, pets: v } })}
          />
          <Toggle
            label={t("smoking")}
            checked={draft.rules.smoking}
            onChange={(v) => patch({ rules: { ...draft.rules, smoking: v } })}
          />
          <Toggle
            label={t("party")}
            checked={draft.rules.party}
            onChange={(v) => patch({ rules: { ...draft.rules, party: v } })}
          />
        </div>
        <Field
          label={t("instructions")}
          error={errors.instructions ? et(errors.instructions) : undefined}
          hint={`${draft.rules.instructions.length} / ${LIMITS.instructions}`}
        >
          <textarea
            rows={3}
            value={draft.rules.instructions}
            maxLength={LIMITS.instructions}
            onChange={(e) =>
              patch({ rules: { ...draft.rules, instructions: e.target.value } })
            }
            placeholder={t("instructionsPlaceholder")}
            className={textareaCls}
          />
        </Field>
      </div>
    </Card>
  );
}

/* ─────────────────────── Step 5 — Pricing & conditions ─────────────────────── */

export function PricingStep({ draft, patch, errors }: StepProps) {
  const t = useTranslations("dashboard.wizard.pricing");
  const et = useTranslations("dashboard.wizard.err");
  const mt = useTranslations("dashboard.wizard.opt.pricingModel");
  const pm = useTranslations("dashboard.wizard.opt.payMethod");
  const pp = useTranslations("dashboard.wizard.opt.payPolicy");
  const ct = useTranslations("dashboard.wizard.opt.cancellation");

  const p = draft.pricing;
  const c = draft.conditions;
  const setP = (patchP: Partial<typeof p>) =>
    patch({ pricing: { ...p, ...patchP } });
  const setC = (patchC: Partial<typeof c>) =>
    patch({ conditions: { ...c, ...patchC } });

  return (
    <Card className="flex flex-col gap-5">
      <Field label={t("model")} error={errors.model ? et(errors.model) : undefined}>
        <ChipGroup
          single
          options={PRICING_MODELS.map((v) => ({ value: v, label: mt(v) }))}
          value={[p.model]}
          onChange={(v) => setP({ model: v[0] as typeof p.model })}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label={t("amount")}
          error={errors.amount ? et(errors.amount) : undefined}
        >
          <Input
            type="number"
            min={0}
            value={p.amount || ""}
            onChange={(e) => setP({ amount: Number(e.target.value) })}
            placeholder="120"
          />
        </Field>
        <Field
          label={t("minNights")}
          error={errors.minNights ? et(errors.minNights) : undefined}
        >
          <Input
            type="number"
            min={1}
            value={p.minNights}
            onChange={(e) => setP({ minNights: Number(e.target.value) })}
          />
        </Field>
        <Field
          label={t("discount")}
          error={errors.longStayDiscountPct ? et(errors.longStayDiscountPct) : undefined}
        >
          <Input
            type="number"
            min={0}
            max={100}
            value={p.longStayDiscountPct || ""}
            onChange={(e) => setP({ longStayDiscountPct: Number(e.target.value) })}
            placeholder="0"
          />
        </Field>
        <Field
          label={t("extraFee")}
          error={errors.extraFee ? et(errors.extraFee) : undefined}
        >
          <Input
            type="number"
            min={0}
            value={p.extraFee || ""}
            onChange={(e) => setP({ extraFee: Number(e.target.value) })}
            placeholder="0"
          />
        </Field>
      </div>

      <Field label={t("cancellation")}>
        <ChipGroup
          single
          options={CANCELLATION_POLICIES.map((v) => ({ value: v, label: ct(v) }))}
          value={[c.cancellation]}
          onChange={(v) => setC({ cancellation: v[0] as typeof c.cancellation })}
        />
      </Field>

      <Field
        label={t("paymentMethods")}
        error={errors.paymentMethods ? et(errors.paymentMethods) : undefined}
      >
        <ChipGroup
          showCheck
          options={PAYMENT_METHODS.map((v) => ({ value: v, label: pm(v) }))}
          value={c.paymentMethods}
          onChange={(v) => setC({ paymentMethods: v as typeof c.paymentMethods })}
        />
      </Field>

      <Field label={t("paymentPolicy")}>
        <ChipGroup
          single
          options={PAYMENT_POLICIES.map((v) => ({ value: v, label: pp(v) }))}
          value={[c.paymentPolicy]}
          onChange={(v) => setC({ paymentPolicy: v[0] as typeof c.paymentPolicy })}
        />
      </Field>

      <Field
        label={t("advance")}
        error={errors.advancePct ? et(errors.advancePct) : undefined}
        hint={t("advanceHint")}
      >
        <Input
          type="number"
          min={0}
          max={100}
          value={c.advancePct || ""}
          onChange={(e) => setC({ advancePct: Number(e.target.value) })}
          placeholder="0"
        />
      </Field>
    </Card>
  );
}

/* ─────────────────────────── Step 6 — Review ─────────────────────────── */

export function ReviewStep({
  draft,
  goTo,
}: {
  draft: ListingDraft;
  goTo: (step: number) => void;
}) {
  const t = useTranslations("dashboard.wizard.review");
  const ot = useTranslations("dashboard.wizard.opt.property");
  const at = useTranslations("dashboard.wizard.opt.amenity");
  const mt = useTranslations("dashboard.wizard.opt.pricingModel");

  const Section = ({
    title,
    step,
    children,
  }: {
    title: string;
    step: number;
    children: React.ReactNode;
  }) => (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-display text-[15px] font-bold">{title}</p>
        <button
          type="button"
          onClick={() => goTo(step)}
          className="text-[13px] font-semibold text-muted hover:text-ink"
        >
          {t("edit")}
        </button>
      </div>
      {children}
    </Card>
  );

  return (
    <div className="flex flex-col gap-4">
      <Section title={t("gallery")} step={1}>
        {draft.gallery.length === 0 ? (
          <p className="text-[13px] text-muted">—</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {draft.gallery.slice(0, 8).map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt={`${i + 1}`}
                className={cn(
                  "h-20 w-20 rounded-xl object-cover",
                  i === 0 && "ring-2 ring-ink",
                )}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title={t("general")} step={0}>
        <p className="text-lg font-bold">{draft.title || "—"}</p>
        <p className="text-[13px] text-muted">
          {ot(draft.propertyType)} · {draft.maxGuests} · {draft.bedrooms} ·{" "}
          {draft.bathrooms}
        </p>
        {draft.description && (
          <p className="text-[14px] text-muted">{draft.description}</p>
        )}
      </Section>

      <Section title={t("amenities")} step={3}>
        <div className="flex flex-wrap gap-1.5">
          {draft.amenities.length === 0 ? (
            <span className="text-[13px] text-muted">—</span>
          ) : (
            draft.amenities.map((a) => (
              <span
                key={a}
                className="rounded-full bg-fill px-2.5 py-1 text-[13px] font-semibold"
              >
                {at(a)}
              </span>
            ))
          )}
        </div>
      </Section>

      <Section title={t("location")} step={2}>
        <p className="text-[14px]">
          {[draft.address, draft.district, draft.city]
            .filter(Boolean)
            .join(", ") || "—"}
        </p>
      </Section>

      <Section title={t("pricing")} step={4}>
        <p className="text-lg font-bold">
          {formatDinars(draft.pricing.amount)}{" "}
          <span className="text-[13px] font-semibold text-muted">
            / {mt(draft.pricing.model)}
          </span>
        </p>
      </Section>
    </div>
  );
}
