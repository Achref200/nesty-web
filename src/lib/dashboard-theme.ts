/**
 * Per-agency dashboard theme. Stored in localStorage (no migration needed) and
 * applied by overriding the CSS colour tokens on the dashboard root element.
 * Defaults reproduce the ink monochrome exactly.
 */
export interface DashTheme {
  primary: string; // hex — buttons, active nav, avatar
  secondary: string; // hex — icon accents
  tertiary: string; // hex — highlights, badges, dots
  text: string; // hex — maps to --c-ink (body text / headings)
  background: string; // hex — maps to --c-paper (page canvas)
}

export const DEFAULT_DASH_THEME: DashTheme = {
  primary: "#141414",
  secondary: "#141414",
  tertiary: "#141414",
  text: "#141414",
  background: "#FCFCFB",
};

export const DASH_THEME_KEY = "nesty-dash-theme";
export const DASH_ROOT_ID = "nesty-dash";

export const DASH_PRESETS: { key: string; theme: DashTheme }[] = [
  { key: "mono", theme: DEFAULT_DASH_THEME },
  {
    key: "ocean",
    theme: {
      primary: "#1E5EFF",
      secondary: "#0EA5A5",
      tertiary: "#7C3AED",
      text: "#0F172A",
      background: "#F7FAFF",
    },
  },
  {
    key: "forest",
    theme: {
      primary: "#166534",
      secondary: "#4D7C0F",
      tertiary: "#B45309",
      text: "#16201A",
      background: "#F7FBF6",
    },
  },
  {
    key: "sunset",
    theme: {
      primary: "#EA580C",
      secondary: "#DB2777",
      tertiary: "#7C3AED",
      text: "#1F1300",
      background: "#FFFAF5",
    },
  },
];

/** "#1E5EFF" → "30 94 255" (the space-separated RGB the tokens expect). */
export function hexToRgbTriplet(hex: string): string {
  let h = (hex || "").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h || "141414", 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** Pick a readable foreground (near-black or near-white) for a background hex. */
export function contrastTriplet(hex: string): string {
  const [r, g, b] = hexToRgbTriplet(hex)
    .split(" ")
    .map((v) => Number(v) / 255);
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return lum > 0.5 ? "20 20 20" : "252 252 251";
}

export function applyDashTheme(theme: DashTheme, root?: HTMLElement | null) {
  const el =
    root ??
    (typeof document !== "undefined"
      ? document.getElementById(DASH_ROOT_ID)
      : null);
  if (!el) return;
  el.style.setProperty("--c-primary", hexToRgbTriplet(theme.primary));
  el.style.setProperty("--c-primary-fg", contrastTriplet(theme.primary));
  el.style.setProperty("--c-secondary", hexToRgbTriplet(theme.secondary));
  el.style.setProperty("--c-tertiary", hexToRgbTriplet(theme.tertiary));
  el.style.setProperty("--c-ink", hexToRgbTriplet(theme.text));
  el.style.setProperty("--c-paper", hexToRgbTriplet(theme.background));
}

export function loadDashTheme(): DashTheme {
  if (typeof window === "undefined") return DEFAULT_DASH_THEME;
  try {
    const raw = window.localStorage.getItem(DASH_THEME_KEY);
    if (!raw) return DEFAULT_DASH_THEME;
    return { ...DEFAULT_DASH_THEME, ...(JSON.parse(raw) as Partial<DashTheme>) };
  } catch {
    return DEFAULT_DASH_THEME;
  }
}

export function saveDashTheme(theme: DashTheme) {
  try {
    window.localStorage.setItem(DASH_THEME_KEY, JSON.stringify(theme));
  } catch {
    /* storage blocked — theme still applies for this session */
  }
}

/** Blocking inline script — applies the saved theme before paint (no flash). */
export const DASH_THEME_SCRIPT = `(function(){try{var raw=localStorage.getItem('${DASH_THEME_KEY}');if(!raw)return;var t=JSON.parse(raw);var el=document.getElementById('${DASH_ROOT_ID}');if(!el)return;function trip(h){h=(h||'').replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c}).join('');var n=parseInt(h,16);return ((n>>16)&255)+' '+((n>>8)&255)+' '+(n&255);}function fg(h){h=(h||'').replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c}).join('');var n=parseInt(h,16);var r=((n>>16)&255)/255,g=((n>>8)&255)/255,b=(n&255)/255;function L(c){return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}var lum=0.2126*L(r)+0.7152*L(g)+0.0722*L(b);return lum>0.5?'20 20 20':'252 252 251';}if(t.primary){el.style.setProperty('--c-primary',trip(t.primary));el.style.setProperty('--c-primary-fg',fg(t.primary));}if(t.secondary)el.style.setProperty('--c-secondary',trip(t.secondary));if(t.tertiary)el.style.setProperty('--c-tertiary',trip(t.tertiary));if(t.text)el.style.setProperty('--c-ink',trip(t.text));if(t.background)el.style.setProperty('--c-paper',trip(t.background));}catch(e){}})();`;
