"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dots } from "@/components/ui/dots";
import { createListing, type CreateListingState } from "@/lib/actions/listings";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { cn } from "@/lib/utils";

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

const TYPES = [
  { key: "entirePlace", labelKey: "typeEntire" },
  { key: "privateRoom", labelKey: "typePrivate" },
  { key: "sharedRoom", labelKey: "typeShared" },
] as const;

const TERMS = [
  { key: "longTerm", labelKey: "termLong", blurbKey: "termLongBlurb" },
  { key: "shortTerm", labelKey: "termShort", blurbKey: "termShortBlurb" },
] as const;

const AUDIENCE = [
  { key: "adults", labelKey: "audAdults" },
  { key: "children", labelKey: "audChildren" },
  { key: "baby", labelKey: "audBaby" },
  { key: "pets", labelKey: "audPets" },
] as const;

const TAGS = [
  "Furnished",
  "Sea view",
  "Balcony",
  "Parking",
  "Pets ok",
  "Wifi",
  "New",
  "Renovated",
];

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

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("dashboard.newListing");
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          {t("publishing")} <Dots />
        </span>
      ) : (
        t("publish")
      )}
    </Button>
  );
}

export default function NewListingPage() {
  const t = useTranslations("dashboard.newListing");
  const [type, setType] = useState("entirePlace");
  const [term, setTerm] = useState("longTerm");
  const [audience, setAudience] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [state, formAction] = useFormState<CreateListingState, FormData>(
    createListing,
    {},
  );

  const toggleAudience = (key: string) =>
    setAudience((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key],
    );

  const toggleTag = (key: string) =>
    setTags((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key],
    );

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/listings"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> {t("back")}
      </Link>

      <div className="mb-6 rounded-3xl border border-separator bg-card/70 p-6 glass-panel">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-fill px-3 py-1 text-xs font-bold uppercase tracking-wide text-muted">
          <Sparkles className="h-3.5 w-3.5" /> {t("badge")}
        </span>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-1.5 max-w-lg text-[15px] text-muted">
          {t("subtitle")}
        </p>
      </div>

      <form action={formAction} className="mt-6">
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="rentalTerm" value={term} />
        <input type="hidden" name="audience" value={audience.join(",")} />
        <input type="hidden" name="tags" value={tags.join(",")} />
        <Card className="flex flex-col gap-5">
          <Field label={t("fieldTitle")}>
            <Input name="title" placeholder={t("titlePlaceholder")} required />
          </Field>
          <Field label={t("cityArea")}>
            <Input name="city" placeholder={t("cityPlaceholder")} required />
          </Field>
          <Field label={t("address")}>
            <Input name="address" placeholder={t("addressPlaceholder")} />
          </Field>

          <Field label={t("type")}>
            <div className="grid grid-cols-3 gap-2">
              {TYPES.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setType(opt.key)}
                  className={cn(
                    "rounded-xl py-2.5 text-sm font-bold transition-colors",
                    type === opt.key
                      ? "bg-ink text-paper"
                      : "bg-fill text-ink hover:bg-separator",
                  )}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </Field>

          <Field label={t("rentalTerm")}>
            <div className="grid grid-cols-2 gap-2">
              {TERMS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setTerm(opt.key)}
                  className={cn(
                    "flex flex-col items-start rounded-xl px-3 py-2.5 text-left transition-colors",
                    term === opt.key
                      ? "bg-ink text-paper"
                      : "bg-fill text-ink hover:bg-separator",
                  )}
                >
                  <span className="text-sm font-bold">{t(opt.labelKey)}</span>
                  <span
                    className={cn(
                      "text-[11px]",
                      term === opt.key ? "text-paper/80" : "text-muted",
                    )}
                  >
                    {t(opt.blurbKey)}
                  </span>
                </button>
              ))}
            </div>
          </Field>

          <Field label={t("suitableFor")}>
            <div className="flex flex-wrap gap-2">
              {AUDIENCE.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => toggleAudience(a.key)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                    audience.includes(a.key)
                      ? "bg-ink text-paper"
                      : "bg-fill text-ink hover:bg-separator",
                  )}
                >
                  {t(a.labelKey)}
                </button>
              ))}
            </div>
          </Field>

          <Field label={t("tags")}>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                    tags.includes(tag)
                      ? "bg-ink text-paper"
                      : "bg-fill text-ink hover:bg-separator",
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t("priceMonth")}>
              <Input name="price" type="number" min="0" placeholder="1900" />
            </Field>
            <Field label={t("area")}>
              <Input name="area" type="number" min="0" placeholder="68" />
            </Field>
            <Field label={t("bedrooms")}>
              <Input name="bedrooms" type="number" min="0" placeholder="2" />
            </Field>
            <Field label={t("bathrooms")}>
              <Input name="bathrooms" type="number" min="0" placeholder="1" />
            </Field>
          </div>

          <Field label={t("photos")}>
            <ImageUpload />
          </Field>

          <Field label={t("exactLocation")}>
            <LocationPicker />
          </Field>
          <Field label={t("description")}>
            <textarea
              name="description"
              rows={4}
              placeholder={t("descriptionPlaceholder")}
              className="w-full rounded-xl border border-separator bg-card p-4 text-base text-ink outline-none transition-colors placeholder:text-muted-soft focus:border-ink"
            />
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
