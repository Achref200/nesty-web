import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getProfile } from "@/lib/queries";
import { ProfileSettings } from "@/components/dashboard/profile-settings";
import { AppearanceSettings } from "@/components/dashboard/appearance-settings";
import { Avatar } from "@/components/dashboard/avatar";
import { LanguageToggle } from "@/components/landing/language-toggle";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const [profile, t] = await Promise.all([
    getProfile(),
    getTranslations("dashboard.settings"),
  ]);
  if (!profile) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <section className="rounded-3xl border border-separator bg-card p-6">
        <div className="mb-5 flex items-center gap-4">
          <Avatar
            src={profile.avatarUrl}
            name={profile.fullName || profile.email}
            size={56}
          />
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight">
              {t("profile.title")}
            </h2>
            <p className="text-[14px] text-muted">{t("profile.subtitle")}</p>
          </div>
        </div>
        <ProfileSettings profile={profile} />
      </section>

      <section className="rounded-3xl border border-separator bg-card p-6">
        <h2 className="font-display text-lg font-bold tracking-tight">
          {t("appearance.title")}
        </h2>
        <p className="mb-4 mt-1 text-[14px] text-muted">
          {t("appearance.subtitle")}
        </p>
        <AppearanceSettings />
      </section>

      <section className="rounded-3xl border border-separator bg-card p-6">
        <h2 className="font-display text-lg font-bold tracking-tight">
          {t("language.title")}
        </h2>
        <p className="mt-1 text-[14px] text-muted">{t("language.subtitle")}</p>
        <div className="mt-4">
          <LanguageToggle variant="light" />
        </div>
      </section>
    </div>
  );
}
