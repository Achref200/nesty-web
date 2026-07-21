"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error?: string; success?: boolean };

/**
 * Updates the signed-in agency's basic profile (display name + avatar). The
 * sign-in email is tied to Supabase auth and stays read-only here — changing it
 * needs a confirmation flow, so agencies contact Nesty for that.
 */
export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const t = await getTranslations("dashboard.settings.profile.errors");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t("signedOut") };

  const fullName = String(formData.get("fullName") ?? "").trim();
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();
  if (!fullName) return { error: t("nameRequired") };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, avatar_url: avatarUrl || null })
    .eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard", "layout");
  return { success: true };
}
