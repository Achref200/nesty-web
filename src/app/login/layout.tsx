import type { Metadata } from "next";

// Sign-in is a private surface — don't index it and don't let Google reuse the
// homepage title (previously "Nesty — B2B Property Experience Platform").
export const metadata: Metadata = {
  title: "Sign in",
  description: "Agency sign-in for the Nesty workspace.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: "/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
