import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Brand favicon — the Nesty house mark on ink. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#141414",
          borderRadius: 7,
        }}
      >
        <svg
          width="22"
          height="15"
          viewBox="0 0 200 140"
          fill="none"
          stroke="#FCFCFB"
          strokeWidth={14}
          strokeLinecap="round"
        >
          <path d="M20 120 C20 45 55 20 100 20 C145 20 180 45 180 120" />
          <path d="M42 125 C42 62 65 42 100 42 C135 42 158 62 158 125" />
          <path d="M62 130 C62 80 78 62 100 62 C122 62 138 80 138 130" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
