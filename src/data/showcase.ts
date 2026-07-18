/**
 * Marketing showcase data for the public landing page. These are illustrative
 * "already on the platform" listings, partner agencies, and proof points used
 * to make Nesty feel like a live product rather than a brochure. Kept separate
 * from the operational `Listing` model in `data/types.ts` on purpose.
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
  rating: number;
  reviews: number;
  state: "available" | "reserved";
  badge?: string;
}

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

/** Featured inventory shown in the landing showcase grid. */
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
    rating: 4.9,
    reviews: 128,
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
    rating: 5.0,
    reviews: 74,
    state: "available",
    badge: "Verified",
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
    rating: 4.8,
    reviews: 96,
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
    rating: 4.7,
    reviews: 52,
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
    rating: 4.9,
    reviews: 143,
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
    rating: 4.6,
    reviews: 61,
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
    rating: 4.8,
    reviews: 88,
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
    rating: 4.7,
    reviews: 54,
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
    rating: 5.0,
    reviews: 47,
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
    rating: 4.5,
    reviews: 39,
    state: "available",
    badge: "Verified",
  },
];

export interface Agency {
  name: string;
  city: string;
  listings: number;
  initials: string;
}

/** Partner agencies onboarding during launch phases. */
export const AGENCIES: Agency[] = [
  { name: "Atlas Realty Tunis", city: "Tunis", listings: 148, initials: "AR" },
  { name: "Carthage Prime Homes", city: "Carthage", listings: 92, initials: "CP" },
  { name: "Medina Keys Agency", city: "Tunis", listings: 76, initials: "MK" },
  { name: "Cap Bon Living", city: "Hammamet", listings: 64, initials: "CB" },
  { name: "Sidi Bou Said Stays", city: "Sidi Bou Saïd", listings: 41, initials: "SB" },
  { name: "Lac Business Realty", city: "Les Berges du Lac", listings: 58, initials: "LB" },
  { name: "Sousse Coastline Estates", city: "Sousse", listings: 83, initials: "SC" },
  { name: "Djerba Island Homes", city: "Djerba", listings: 37, initials: "DI" },
];

export interface Stat {
  value: string;
  label: string;
  hint: string;
}

/** Proof-point metrics for the stats band. */
export const PLATFORM_STATS: Stat[] = [
  { value: "1 200+", label: "Verified listings", hint: "Curated across partner agencies" },
  { value: "40+", label: "Partner agencies", hint: "Onboarding through launch phases" },
  { value: "9", label: "Cities covered", hint: "Tunis to Djerba and growing" },
  { value: "18k", label: "Monthly visit requests", hint: "Routed to the right agent in minutes" },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  agency: string;
  initials: string;
}

/** Agency voices — social proof for decision-makers. */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We used to lose two weekends a month to double-booked keys. Since we moved our short-stay calendar onto Nesty, that number is zero — and the 3D tours cut the tyre-kicker visits by half.",
    name: "Amine Rekik",
    role: "Head of Sales",
    agency: "Atlas Realty · Tunis",
    initials: "AR",
  },
  {
    quote:
      "Owners see their villa the way renters see it. That&rsquo;s what unlocked the exclusive-mandate conversations in Sidi Bou.",
    name: "Sana Khaldi",
    role: "Agency Director",
    agency: "Carthage Prime Homes",
    initials: "SK",
  },
  {
    quote:
      "The visit request lands on the agent&rsquo;s phone with the lease term already filled in. Our reply is a two-tap ‘confirm’ instead of a phone call.",
    name: "Yassine Rahmani",
    role: "Operations",
    agency: "Lac Business Realty · Tunis",
    initials: "YR",
  },
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
    title: "Immersive 3D tours",
    body: "Walk every room in 360° — a real walkthrough, not a slideshow. What you see is what you get.",
  },
  {
    icon: CalendarCheck,
    title: "Book a visit or reserve",
    body: "Pick a viewing slot, or hold your summer dates with a clear check-in and check-out.",
  },
  {
    icon: ShieldCheck,
    title: "Verified & trusted",
    body: "Every listing and owner is verified before it goes live, so there are no surprises on arrival.",
  },
  {
    icon: Heart,
    title: "Saved homes",
    body: "Shortlist the places you love and compare them side by side, on your own time.",
  },
  {
    icon: MapPin,
    title: "Neighbourhood intel",
    body: "Transport, schools, and lifestyle scores around every home — the context photos never show.",
  },
  {
    icon: Bell,
    title: "Instant updates",
    body: "Know the moment a visit is confirmed or an agent replies. No refreshing, no waiting.",
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
    body: "Publish inventory, manage requests, and track reservations on a live calendar.",
  },
  {
    icon: Smartphone,
    tag: "For seekers",
    title: "Mobile app",
    body: "Discover verified homes, tour them in 3D, then book a visit or reserve in a couple of taps.",
  },
  {
    icon: Box,
    tag: "Engine",
    title: "Tour3D",
    body: "Turns ordinary room photos into an immersive walkthrough — no special hardware needed.",
  },
  {
    icon: Sparkles,
    tag: "Realtime",
    title: "One source of truth",
    body: "A booking on mobile updates the agency calendar instantly. Everyone sees the same truth.",
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
  /** Approximate stays available in the app (illustrative). */
  stays: number;
  /** Lowest monthly asking price shown on the card (TND). */
  fromMonthly: number;
  /** Lowest nightly rate shown as the secondary line (TND). */
  fromNightly: number;
  /** Short editorial line about the neighborhood or vibe. */
  vibe: string;
}

export const DESTINATIONS: Destination[] = [
  {
    city: "La Marsa",
    region: "Tunis · Corniche",
    image: U("1600585154340-be6161a56a0c"),
    stays: 148,
    fromMonthly: 2400,
    fromNightly: 180,
    vibe: "Sea walks, morning coffee, easy metro into Tunis.",
  },
  {
    city: "Sidi Bou Saïd",
    region: "Blue & white village",
    image: U("1613490493576-7fde63acd811"),
    stays: 62,
    fromMonthly: 3800,
    fromNightly: 320,
    vibe: "Postcard streets, painters' balconies, mint tea sunsets.",
  },
  {
    city: "Hammamet",
    region: "Yasmine · seafront",
    image: U("1512917774080-9991f1c4c750"),
    stays: 96,
    fromMonthly: 1800,
    fromNightly: 140,
    vibe: "Long summers, walkable beaches, easy family stays.",
  },
  {
    city: "Djerba",
    region: "Sidi Mahrez · island",
    image: U("1502672260266-1c1ef2d93688"),
    stays: 74,
    fromMonthly: 1500,
    fromNightly: 120,
    vibe: "Palm groves, whitewashed houses, waves two minutes away.",
  },
  {
    city: "Sousse",
    region: "Medina & coast",
    image: U("1600047509807-ba8f99d2cdde"),
    stays: 83,
    fromMonthly: 1200,
    fromNightly: 95,
    vibe: "Old medina energy on one side, wide beach on the other.",
  },
  {
    city: "Carthage",
    region: "Byrsa · Salammbô",
    image: U("1570129477492-45c003edd2be"),
    stays: 47,
    fromMonthly: 4200,
    fromNightly: 340,
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

