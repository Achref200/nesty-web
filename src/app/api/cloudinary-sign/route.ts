import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Signs a Cloudinary upload server-side so the API secret never reaches the
 * browser. The client then uploads directly to Cloudinary with the returned
 * signature — no unsigned preset required.
 */
export async function POST() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  }

  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) {
    console.error("[cloudinary-sign] failed to resolve uploader role:", profileError.message);
    return NextResponse.json({ error: "Could not verify account." }, { status: 503 });
  }
  if (profile?.role !== "host" && profile?.role !== "partner") {
    return NextResponse.json({ error: "Agency access required." }, { status: 403 });
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!apiKey || !apiSecret || !cloudName) {
    return NextResponse.json(
      { error: "Cloudinary is not configured on the server." },
      { status: 500 },
    );
  }

  // Scope uploads to the authenticated account; never sign a caller-supplied folder.
  const folder = `nesty/listings/${user.id}`;
  const timestamp = Math.round(Date.now() / 1000);

  // Params to sign must be sorted alphabetically, joined, then hashed with the
  // secret appended (Cloudinary's signature scheme).
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");

  return NextResponse.json({ timestamp, signature, apiKey, cloudName, folder });
}
