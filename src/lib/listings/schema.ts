/**
 * Central, framework-free source of truth for the Host Listing Management
 * module: field constants, the wizard's draft shape, and pure per-step
 * validators. Kept side-effect free (like `availability.ts`) so it can be
 * imported by both server actions and client components and unit-tested in
 * isolation. Never duplicate these rules elsewhere.
 */

/* ─────────────────────────── Lifecycle ─────────────────────────── */

export const LISTING_STATUSES = [
  "draft",
  "completed",
  "submitted",
  "pending_moderation",
  "published",
  "disabled",
  "deleted",
] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

/** Legacy 2-value status still stored on rows before the lifecycle migration. */
export type LegacyStatus = "active" | "hidden";

/** Normalise any stored status (legacy or new) to the lifecycle vocabulary. */
export function normalizeStatus(raw: string | null | undefined): ListingStatus {
  if (raw === "active") return "published";
  if (raw === "hidden") return "disabled";
  if ((LISTING_STATUSES as readonly string[]).includes(raw ?? "")) {
    return raw as ListingStatus;
  }
  return "draft";
}

/** Whether a listing may be opened in the edit wizard. Only drafts are editable. */
export function isEditable(status: ListingStatus): boolean {
  return status === "draft" || status === "completed";
}

/* ─────────────────────────── Field options ─────────────────────────── */

export const PROPERTY_TYPES = [
  "apartment",
  "villa",
  "house",
  "studio",
  "room",
  "riad",
  "other",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const AMENITIES = [
  "wifi",
  "ac",
  "heating",
  "hotWater",
  "kitchen",
  "fridge",
  "washer",
  "tv",
  "parking",
  "pool",
  "balcony",
  "garden",
  "elevator",
  "babyBed",
  "workspace",
] as const;
export type Amenity = (typeof AMENITIES)[number];

/** Basic amenities preselected by default in the wizard. */
export const DEFAULT_AMENITIES: Amenity[] = ["wifi", "hotWater", "kitchen"];

export const LISTING_TAGS = [
  "seaView",
  "beachfront",
  "cityCenter",
  "quietArea",
  "nearBeach",
  "nearShops",
  "luxury",
  "family",
  "romantic",
  "remoteWork",
  "nature",
  "authenticTunisian",
] as const;
export type ListingTag = (typeof LISTING_TAGS)[number];

export const PRICING_MODELS = ["night", "week", "month"] as const;
export type PricingModel = (typeof PRICING_MODELS)[number];

export const PAYMENT_METHODS = ["cash", "card", "bankTransfer"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_POLICIES = ["mandatoryAdvance", "optionalAdvance"] as const;
export type PaymentPolicy = (typeof PAYMENT_POLICIES)[number];

export const CANCELLATION_POLICIES = ["flexible", "moderate", "strict"] as const;
export type CancellationPolicy = (typeof CANCELLATION_POLICIES)[number];

/* ─────────────────────────── Photo rules ─────────────────────────── */

export const PHOTO_MIN = 5;
export const PHOTO_MAX = 30;
export const PHOTO_ACCEPT = ["image/jpeg", "image/png", "image/webp"];
export const PHOTO_ACCEPT_ATTR = ".jpg,.jpeg,.png,.webp";

/* ─────────────────────────── Character limits ─────────────────────────── */

export const LIMITS = {
  title: 80,
  description: 2000,
  instructions: 500,
  address: 200,
} as const;

/* ─────────────────────────── Tunisia bounds ─────────────────────────── */

export const TUNISIA_BOUNDS = {
  minLat: 30.2,
  maxLat: 37.7,
  minLng: 7.4,
  maxLng: 11.7,
} as const;

export function isInTunisia(lat: number, lng: number): boolean {
  return (
    lat >= TUNISIA_BOUNDS.minLat &&
    lat <= TUNISIA_BOUNDS.maxLat &&
    lng >= TUNISIA_BOUNDS.minLng &&
    lng <= TUNISIA_BOUNDS.maxLng
  );
}

/** Lenient Tunisian phone check: 8 local digits, optional +216 / 216 prefix. */
export function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/[\s().-]/g, "");
  return /^(\+?216)?\d{8}$/.test(digits);
}

/* ─────────────────────────── Draft shape ─────────────────────────── */

export interface HouseRules {
  pets: boolean;
  smoking: boolean;
  party: boolean;
  instructions: string;
}

export interface Pricing {
  model: PricingModel;
  amount: number;
  minNights: number;
  /** Percentage discount for long stays (0–100). */
  longStayDiscountPct: number;
  /** Flat additional fee (e.g. cleaning), in TND. */
  extraFee: number;
}

export interface BookingConditions {
  cancellation: CancellationPolicy;
  paymentMethods: PaymentMethod[];
  paymentPolicy: PaymentPolicy;
  /** Advance percentage required/suggested (0–100). */
  advancePct: number;
}

/** The full working object the wizard edits and every validator reads. */
export interface ListingDraft {
  id?: string;
  // Step 1 — General
  title: string;
  description: string;
  propertyType: PropertyType;
  contactPhone: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  // Step 2 — Photos
  gallery: string[];
  cover: string | null;
  // Step 3 — Location
  city: string;
  district: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  // Step 4 — Amenities / tags / rules
  amenities: string[];
  tags: string[];
  rules: HouseRules;
  // Step 5 — Pricing & conditions
  pricing: Pricing;
  conditions: BookingConditions;
}

export function emptyDraft(): ListingDraft {
  return {
    title: "",
    description: "",
    propertyType: "apartment",
    contactPhone: "",
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    gallery: [],
    cover: null,
    city: "",
    district: "",
    address: "",
    latitude: null,
    longitude: null,
    amenities: [...DEFAULT_AMENITIES],
    tags: [],
    rules: { pets: false, smoking: false, party: false, instructions: "" },
    pricing: {
      model: "night",
      amount: 0,
      minNights: 1,
      longStayDiscountPct: 0,
      extraFee: 0,
    },
    conditions: {
      cancellation: "flexible",
      paymentMethods: ["cash"],
      paymentPolicy: "optionalAdvance",
      advancePct: 0,
    },
  };
}

/**
 * Merge a partial/untrusted draft (restored from localStorage or an older
 * schema) over a fresh empty draft so every nested object is always present.
 * Prevents runtime errors when a stale shape reaches the server.
 */
export function mergeDraft(
  partial: Partial<ListingDraft> | null | undefined,
): ListingDraft {
  const base = emptyDraft();
  if (!partial || typeof partial !== "object") return base;
  return {
    ...base,
    ...partial,
    rules: { ...base.rules, ...(partial.rules ?? {}) },
    pricing: { ...base.pricing, ...(partial.pricing ?? {}) },
    conditions: {
      ...base.conditions,
      ...(partial.conditions ?? {}),
      paymentMethods:
        partial.conditions?.paymentMethods ?? base.conditions.paymentMethods,
    },
    gallery: Array.isArray(partial.gallery) ? partial.gallery : base.gallery,
    amenities: Array.isArray(partial.amenities)
      ? partial.amenities
      : base.amenities,
    tags: Array.isArray(partial.tags) ? partial.tags : base.tags,
  };
}

/* ─────────────────────────── Validation ─────────────────────────── */

/** Field → error-key map. Empty object means the step is valid. */
export type Errors = Record<string, string>;

export const WIZARD_STEPS = [
  "general",
  "photos",
  "location",
  "amenities",
  "pricing",
  "review",
] as const;
export type WizardStepId = (typeof WIZARD_STEPS)[number];

export function validateGeneral(d: ListingDraft): Errors {
  const e: Errors = {};
  if (!d.title.trim()) e.title = "titleRequired";
  else if (d.title.length > LIMITS.title) e.title = "titleTooLong";
  if (d.description.length > LIMITS.description) e.description = "descriptionTooLong";
  if (!(PROPERTY_TYPES as readonly string[]).includes(d.propertyType))
    e.propertyType = "propertyTypeRequired";
  if (!d.contactPhone.trim()) e.contactPhone = "phoneRequired";
  else if (!isValidPhone(d.contactPhone)) e.contactPhone = "phoneInvalid";
  if (!Number.isFinite(d.maxGuests) || d.maxGuests < 1) e.maxGuests = "guestsInvalid";
  if (!Number.isFinite(d.bedrooms) || d.bedrooms < 0) e.bedrooms = "bedroomsInvalid";
  if (!Number.isFinite(d.bathrooms) || d.bathrooms < 0) e.bathrooms = "bathroomsInvalid";
  return e;
}

export function validatePhotos(d: ListingDraft): Errors {
  const e: Errors = {};
  if (d.gallery.length < PHOTO_MIN) e.gallery = "photosTooFew";
  else if (d.gallery.length > PHOTO_MAX) e.gallery = "photosTooMany";
  return e;
}

export function validateLocation(d: ListingDraft): Errors {
  const e: Errors = {};
  if (!d.city.trim()) e.city = "cityRequired";
  if (!d.address.trim()) e.address = "addressRequired";
  else if (d.address.length > LIMITS.address) e.address = "addressTooLong";
  if (d.latitude == null || d.longitude == null) e.map = "pinRequired";
  else if (!isInTunisia(d.latitude, d.longitude)) e.map = "pinOutsideTunisia";
  return e;
}

export function validateAmenities(d: ListingDraft): Errors {
  const e: Errors = {};
  if (d.rules.instructions.length > LIMITS.instructions)
    e.instructions = "instructionsTooLong";
  return e;
}

export function validatePricing(d: ListingDraft): Errors {
  const e: Errors = {};
  if (!(PRICING_MODELS as readonly string[]).includes(d.pricing.model))
    e.model = "pricingModelRequired";
  if (!Number.isFinite(d.pricing.amount) || d.pricing.amount <= 0)
    e.amount = "priceRequired";
  if (!Number.isFinite(d.pricing.minNights) || d.pricing.minNights < 1)
    e.minNights = "minNightsInvalid";
  if (d.pricing.longStayDiscountPct < 0 || d.pricing.longStayDiscountPct > 100)
    e.longStayDiscountPct = "discountInvalid";
  if (d.pricing.extraFee < 0) e.extraFee = "feeInvalid";
  if (d.conditions.paymentMethods.length === 0)
    e.paymentMethods = "paymentMethodRequired";
  if (d.conditions.advancePct < 0 || d.conditions.advancePct > 100)
    e.advancePct = "advanceInvalid";
  return e;
}

/** Ordered validators, aligned with `WIZARD_STEPS` (review has none of its own). */
export const STEP_VALIDATORS: Record<
  Exclude<WizardStepId, "review">,
  (d: ListingDraft) => Errors
> = {
  general: validateGeneral,
  photos: validatePhotos,
  location: validateLocation,
  amenities: validateAmenities,
  pricing: validatePricing,
};

/** Run every step validator; returns the merged error map (empty = valid). */
export function validateAll(d: ListingDraft): Errors {
  return {
    ...validateGeneral(d),
    ...validatePhotos(d),
    ...validateLocation(d),
    ...validateAmenities(d),
    ...validatePricing(d),
  };
}
