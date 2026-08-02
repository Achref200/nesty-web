"use server";

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AuthState = { error?: string };

/**
 * Agency sign-in. The B2B portal has no self-registration — accounts are
 * provisioned by Nesty, so this only ever signs an existing agency in.
 */
export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const t = await getTranslations("login.errors");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: t("invalidEmail") };
  }
  if (password.length < 1) {
    return { error: t("enterPassword") };
  }

  // /login renders without credentials, so this action is reachable before
  // Supabase is configured. Say so plainly instead of throwing out of the
  // client factory and showing an unhandled runtime error.
  if (!isSupabaseConfigured) {
    return { error: t("notConfigured") };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // One generic message for every failure mode (#19). Distinguishing "wrong
    // password" from "no such account" — or echoing Supabase's raw text — leaks
    // whether an agency email exists and exposes internal provisioning detail
    // on a public page. The real cause goes to the server log instead.
    console.error("[auth] agency sign-in failed:", error.message);
    return { error: t("invalidCredentials") };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
