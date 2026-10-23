/**
 * Sample listing cards used in marketing previews. They are not live inventory
 * or real agency records and must not be used as availability or review data.
 */
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Box,
  CalendarCheck,
  Compass,
  Heart,
  Layers,
  MapPin,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
export interface ShowcaseListing {
  id: string;
  title: string;
  city: string;
  area: string;
  price: number;
  term: "shortTerm" | "longTerm";
  beds: number;
  baths: number;
  sqm: number;
  image: string;
  agency: string;
  state: "available" | "reserved";
  badge?: string;
}
const U = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
/** Featured sample cards shown in the landing showcase preview. */
export const FEATURED_LISTINGS: ShowcaseListing[] = [
  {
    id: "marsa-corniche-loft",
    title: "Corniche Sea-View Loft",
    city: "La Marsa",
    area: "Corniche",
    price: 3200,
    term: "shortTerm",
    beds: 2,
    baths: 2,
    sqm: 118,
    image: U("1600585154340-be6161a56a0c"),
    agency: "Atlas Realty Tunis",
    state: "available",
    badge: "3D tour",
  },
  {
    id: "sidi-bou-said-villa",
    title: "Blue & White Garden Villa",
    city: "Sidi Bou Saïd",
    area: "Village",
    price: 6400,
    term: "longTerm",
    beds: 4,
    baths: 3,
    sqm: 240,
    image: U("1613490493576-7fde63acd811"),
    agency: "Sidi Bou Said Stays",
    state: "available",
    badge: "Preview",
  },
  {
    id: "gammarth-pool-house",
    title: "Gammarth Pool House",
    city: "Gammarth",
    area: "Les Côtes",
    price: 5100,
    term: "shortTerm",
    beds: 3,
    baths: 3,
    sqm: 205,
    image: U("1580587771525-78b9dba3b914"),
    agency: "Carthage Prime Homes",
    state: "reserved",
    badge: "Featured",
  },
  {
    id: "lac2-smart-office",
    title: "Lac 2 Smart Office Suite",
    city: "Tunis",
    area: "Les Berges du Lac 2",
    price: 4200,
    term: "longTerm",
    beds: 0,
    baths: 2,
    sqm: 160,
    image: U("1600607687939-ce8a6c25118c"),
    agency: "Lac Business Realty",
    state: "available",
    badge: "Commercial",
  },
  {
    id: "hammamet-summer-villa",
    title: "Hammamet Summer Villa",
    city: "Hammamet",
    area: "Yasmine",
    price: 3800,
    term: "shortTerm",
    beds: 3,
    baths: 2,
    sqm: 175,
    image: U("1512917774080-9991f1c4c750"),
    agency: "Cap Bon Living",
    state: "available",
    badge: "Sea 8 min",
  },
  {
    id: "menzah-park-residence",
    title: "Menzah Park Residence",
    city: "Tunis",
    area: "El Menzah",
    price: 2400,
    term: "longTerm",
    beds: 3,
    baths: 2,
    sqm: 135,
    image: U("1568605114967-8130f3a36994"),
    agency: "Medina Keys Agency",
    state: "available",
    badge: "New",
  },
  {
    id: "sousse-medina-riad",
    title: "Sousse Medina Riad",
    city: "Sousse",
    area: "Medina",
    price: 2900,
    term: "shortTerm",
    beds: 3,
    baths: 2,
    sqm: 150,
    image: U("1600047509807-ba8f99d2cdde"),
    agency: "Sousse Coastline Estates",
    state: "available",
    badge: "3D tour",
  },
  {
    id: "djerba-beach-studio",
    title: "Djerba Beachfront Studio",
    city: "Djerba",
    area: "Sidi Mahrez",
    price: 1900,
    term: "shortTerm",
    beds: 1,
    baths: 1,
    sqm: 68,
    image: U("1502672260266-1c1ef2d93688"),
    agency: "Djerba Island Homes",
    state: "available",
    badge: "Sea 2 min",
  },
  {
    id: "carthage-hillside-villa",
    title: "Carthage Hillside Villa",
    city: "Carthage",
    area: "Byrsa",
    price: 7200,
    term: "longTerm",
    beds: 5,
    baths: 4,
    sqm: 320,
    image: U("1570129477492-45c003edd2be"),
    agency: "Carthage Prime Homes",
    state: "reserved",
    badge: "Signature",
  },
  {
    id: "ennasr-family-duplex",
    title: "Ennasr Family Duplex",
    city: "Tunis",
    area: "Ennasr 2",
    price: 2600,
    term: "longTerm",
    beds: 4,
    baths: 3,
    sqm: 190,
    image: U("1560448204-e02f11c3d0e2"),
    agency: "Atlas Realty Tunis",
    state: "available",
    badge: "Preview",
  },
];
export interface Stat {
  value: string;
  label: string;
  hint: string;
}
/** Market-opportunity metrics for the stats band — sourced from the Product
 *  Discovery study (BCT / ONTT 2025), not fabricated platform traction. */
export const PLATFORM_STATS: Stat[] = [
  { value: "11M+", label: "Visitors in 2025", hint: "Tunisia’s record tourism year — the demand pool" },
  { value: "7.9B TND", label: "Tourism receipts", hint: "Up 6.3% year on year (BCT, 2025)" },
  { value: "700k+", label: "Tunisians in Europe", hint: "The diaspora — books early, pays in euros" },
  { value: "56%", label: "Still pay in cash", hint: "Why every booking can pay on arrival" },
];
export const TERM_LABEL: Record<ShowcaseListing["term"], string> = {
  shortTerm: "Short term",
  longTerm: "Long term",
};
export interface AppFeature {
  icon: LucideIcon;
  title: string;
  body: string;
}
/**
 * The consumer mobile app (Flutter) is the other half of Nesty. Agencies
 * publish on the web workspace; seekers discover, tour, and book in the app.
 * These mirror the real feature set of the Nesty app.
 */
export const APP_FEATURES: AppFeature[] = [
  {
    icon: Box,
    title: "3D tours when available",
        body: "Open a 3D tour when one has been added to a listing.",
  },
  {
    icon: CalendarCheck,
    title: "Book a visit or reserve",
        body: "Send a visit request or stay enquiry from a published listing.",
  },
  {
    icon: ShieldCheck,
    title: "Listing details",
    body: "Review the property details supplied by each agency and confirm important information before booking.",
  },
  {
    icon: Heart,
    title: "Saved homes",
    body: "Shortlist the places you love and compare them side by side, on your own time.",
  },
  {
    icon: MapPin,
    title: "Area information",
    body: "Review any location information included by the agency on a listing.",
  },
  {
    icon: Bell,
    title: "Request updates",
    body: "Follow up on your stay or visit requests through Nesty.",
  },
];
/** The app's bottom navigation — mirrors the real Nesty app shell. */
export const APP_TABS: { icon: LucideIcon; label: string }[] = [
  { icon: Compass, label: "Explore" },
  { icon: Heart, label: "Saved" },
  { icon: CalendarCheck, label: "Trips" },
  { icon: Smartphone, label: "Profile" },
];
export interface EcosystemNode {
  icon: LucideIcon;
  tag: string;
  title: string;
  body: string;
}
/** The connected platform: one source of truth across web, mobile, and 3D. */
export const ECOSYSTEM: EcosystemNode[] = [
  {
    icon: Layers,
    tag: "For agencies",
    title: "Web workspace",
    body: "Manage published listings and respond to stay or visit requests in one workspace.",
  },
  {
    icon: Smartphone,
    tag: "For seekers",
    title: "Mobile app",
    body: "Browse published listings and send a stay or visit request through the app.",
  },
  {
    icon: Box,
    tag: "Engine",
    title: "Tour3D",
    body: "Shows a tour link on a listing when the agency has added one.",
  },
  {
    icon: Sparkles,
    tag: "Realtime",
    title: "One source of truth",
    body: "Connected Nesty apps use the shared listings database for published inventory.",
  },
];
/* ────────────────────────────────────────────────────────────────── *
 *  Rental destinations & property categories
 *  Used by the landing page to make the "rentals across Tunisia"
 *  story visible on first scroll (Airbnb-style discovery cues).
 * ────────────────────────────────────────────────────────────────── */
export interface Destination {
  city: string;
  region: string;
  image: string;
  /** Short editorial line about the neighborhood or vibe. */
  vibe: string;
}
export const DESTINATIONS: Destination[] = [
  {
    city: "La Marsa",
    region: "Tunis · Corniche",
    image: U("1600585154340-be6161a56a0c"),
    vibe: "Sea walks, morning coffee, easy metro into Tunis.",
  },
  {
    city: "Sidi Bou Saïd",
    region: "Blue & white village",
    image: U("1613490493576-7fde63acd811"),
    vibe: "Postcard streets, painters' balconies, mint tea sunsets.",
  },
  {
    city: "Hammamet",
    region: "Yasmine · seafront",
    image: U("1512917774080-9991f1c4c750"),
    vibe: "Long summers, walkable beaches, easy family stays.",
  },
  {
    city: "Djerba",
    region: "Sidi Mahrez · island",
    image: U("1502672260266-1c1ef2d93688"),
    vibe: "Palm groves, whitewashed houses, waves two minutes away.",
  },
  {
    city: "Sousse",
    region: "Medina & coast",
    image: U("1600047509807-ba8f99d2cdde"),
    vibe: "Old medina energy on one side, wide beach on the other.",
  },
  {
    city: "Carthage",
    region: "Byrsa · Salammbô",
    image: U("1570129477492-45c003edd2be"),
    vibe: "Historic hillside villas, quiet gardens, sea in the distance.",
  },
];
export interface PropertyCategory {
  key: string;
  label: string;
  hint: string;
}
/** The horizontal category rail below the hero search bar. */
export const PROPERTY_CATEGORIES: PropertyCategory[] = [
  { key: "all", label: "All stays", hint: "Every home on Nesty" },
  { key: "villa", label: "Villas", hint: "Private, with a garden or a pool" },
  { key: "apartment", label: "Apartments", hint: "In the heart of the city" },
  { key: "room", label: "Private rooms", hint: "A bed in a shared home" },
  { key: "studio", label: "Studios", hint: "Just you, one clean room" },
  { key: "beachfront", label: "Beachfront", hint: "Sea in under five minutes" },
  { key: "riad", label: "Riads", hint: "Traditional houses, quiet courtyards" },
  { key: "long", label: "Long-term leases", hint: "3 months and up" },
];
