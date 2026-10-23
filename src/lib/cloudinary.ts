/** Cloudinary uploads for the web dashboard. */
/**
 * Uploads a file to Cloudinary and returns its secure delivery URL.
 *
 * Uses a signed upload: the server verifies the agency account and signs an
 * account-scoped folder. An unsigned fallback would bypass that guard.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const signRes = await fetch("/api/cloudinary-sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const sign = await signRes.json().catch(() => null);
  if (!signRes.ok || !sign) {
    throw new Error(sign?.error ?? "Could not authorize image upload.");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sign.apiKey);
  form.append("timestamp", String(sign.timestamp));
  form.append("signature", sign.signature);
  form.append("folder", sign.folder);
  return postToCloudinary(sign.cloudName, form);
}

async function postToCloudinary(
  cloudName: string,
  form: FormData,
): Promise<string> {
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form },
  );
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.secure_url) {
    throw new Error(data?.error?.message ?? `Upload failed (${res.status})`);
  }
  return data.secure_url as string;
}
