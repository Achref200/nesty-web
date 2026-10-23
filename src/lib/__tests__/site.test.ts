import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("site URL", () => {
  it("uses the stable public alias for production canonical URLs", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_URL", "nesty-build-abc.vercel.app");
    vi.resetModules();

    const { site } = await import("../site");
    expect(site.url).toBe("https://nesty-tn.vercel.app");
  });

  it("uses the deployment URL for preview builds", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "nesty-preview-abc.vercel.app");
    vi.resetModules();

    const { site } = await import("../site");
    expect(site.url).toBe("https://nesty-preview-abc.vercel.app");
  });

  it("prefers an explicitly configured custom domain", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.nesty.tn/");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_URL", "nesty-build-abc.vercel.app");
    vi.resetModules();

    const { site } = await import("../site");
    expect(site.url).toBe("https://www.nesty.tn/");
  });
});
