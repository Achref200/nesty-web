import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = "Nesty — B2B Property Experience Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Dynamic social share card so links look premium when shared/sponsored. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#FCFCFB",
          backgroundImage:
            "radial-gradient(1000px 600px at 100% -10%, rgba(20,20,20,0.07), transparent 60%), radial-gradient(800px 500px at -10% 10%, rgba(20,20,20,0.05), transparent 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              backgroundColor: "#141414",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FCFCFB"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
            </svg>
          </div>
          <span style={{ fontSize: 40, fontWeight: 800, color: "#141414" }}>
            Nesty
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#7A7A78",
            }}
          >
            B2B-first real-estate operating system
          </span>
          <span
            style={{
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.05,
              color: "#141414",
              maxWidth: 900,
            }}
          >
            {site.tagline}
          </span>
        </div>

        <span style={{ fontSize: 26, color: "#3C3C3B" }}>
          Publish verified inventory · Route every visit · Grow across Tunisia
        </span>
      </div>
    ),
    { ...size },
  );
}
