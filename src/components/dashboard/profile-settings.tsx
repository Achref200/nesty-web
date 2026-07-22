"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dots } from "@/components/ui/dots";
import { Avatar } from "@/components/dashboard/avatar";
import { updateProfile, type ProfileState } from "@/lib/actions/profile";
import type { Profile } from "@/lib/queries";

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

function SaveButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("dashboard.settings.profile");
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          {t("saving")} <Dots />
        </span>
      ) : (
        t("save")
      )}
    </Button>
  );
}

export function ProfileSettings({ profile }: { profile: Profile }) {
  const t = useTranslations("dashboard.settings.profile");
  const [avatar, setAvatar] = useState(profile.avatarUrl ?? "");
  const [state, formAction] = useFormState<ProfileState, FormData>(
    updateProfile,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label={t("fullName")}>
        <Input
          name="fullName"
          defaultValue={profile.fullName}
          placeholder={t("fullNamePlaceholder")}
          autoComplete="organization"
          required
        />
      </Field>

      <Field label={t("email")}>
        <Input
          name="email"
          type="email"
          defaultValue={profile.email}
          disabled
          readOnly
        />
        <span className="text-[12.5px] text-muted">{t("emailHint")}</span>
      </Field>

      <Field label={t("avatar")}>
        <div className="flex items-center gap-3">
          <Avatar
            src={avatar || null}
            name={profile.fullName || profile.email}
            size={44}
          />
          <Input
            name="avatarUrl"
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder={t("avatarPlaceholder")}
            inputMode="url"
            className="flex-1"
          />
        </div>
      </Field>

      {state?.error && (
        <p className="flex items-center gap-1.5 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="flex items-center gap-1.5 text-sm text-ink">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {t("saved")}
        </p>
      )}

      <div className="mt-1">
        <SaveButton />
      </div>
    </form>
  );
}
