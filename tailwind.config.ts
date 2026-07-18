import type { Config } from "tailwindcss";

/**
 * Nesty design tokens — a strict black / white / grey monochrome system shared
 * with the mobile app. Ink is the only accent; greys carry all hierarchy.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        card: "#FFFFFF",
        fill: "#F1F1F0",
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)",
          soft: "rgb(var(--c-ink-soft) / <alpha-value>)",
        },
        // Themeable "white" — flips to ink inside the landing light theme so the
        // whole opacity hierarchy (text-white/50, bg-white/[0.02]…) inverts with
        // one scope. Defaults to true white everywhere else.
        white: "rgb(var(--c-white) / <alpha-value>)",
        separator: "#E6E6E4",
        muted: { DEFAULT: "#7A7A78", soft: "#B4B4B1" },
        danger: "#B23A34",
        // Warm terracotta accent — the single pop of colour over the monochrome base.
        brand: {
          DEFAULT: "#EC5E2A",
          soft: "#FCEDE4",
          strong: "#CE4A1B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 30px 60px -30px rgba(0,0,0,0.18)",
        card: "0 1px 2px rgba(0,0,0,0.04)",
        float: "0 24px 50px -24px rgba(20,20,20,0.28)",
        lift: "0 40px 80px -40px rgba(20,20,20,0.35)",
        glow: "0 18px 40px -16px rgba(236,94,42,0.45)",
      },
      maxWidth: {
        content: "1080px",
        wide: "1200px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(22px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "aurora-drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(0,-14px,0) scale(1.04)" },
        },
        "bob": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        blink: "blink 1s steps(1) infinite",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 40s linear infinite",
        "marquee-reverse": "marquee-reverse 40s linear infinite",
        shimmer: "shimmer 2.2s ease-in-out infinite",
        "aurora-drift": "aurora-drift 14s ease-in-out infinite",
        bob: "bob 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
