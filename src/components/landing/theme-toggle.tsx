"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "nesty-landing-theme";
const ROOT_ID = "nesty-landing";

/**
 * Light/dark switch for the landing page. Toggles the `.theme-light` class on
 * the landing root (which flips the colour tokens) and remembers the choice.
 * The initial class is set by a blocking inline script in the page, so this
 * component just mirrors + updates it — no flash of the wrong theme.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const root = document.getElementById(ROOT_ID);
    setLight(root?.classList.contains("theme-light") ?? false);
  }, []);

  function toggle() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    const next = !root.classList.contains("theme-light");
    root.classList.toggle("theme-light", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "light" : "dark");
    } catch {
      /* storage blocked — theme still applies for this session */
    }
    setLight(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      title={light ? "Dark mode" : "Light mode"}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-paper transition-colors hover:bg-white/[0.08]",
        className,
      )}
    >
      {light ? (
        <Moon className="h-4 w-4" strokeWidth={1.9} />
      ) : (
        <Sun className="h-4 w-4" strokeWidth={1.9} />
      )}
    </button>
  );
}
