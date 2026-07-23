import type { Listing } from "@/data/types";
import {
  PROPERTY_TYPES,
  emptyDraft,
  type ListingDraft,
  type PropertyType,
} from "./schema";

/** Convert a stored listing into the wizard's editable draft shape. */
export function listingToDraft(l: Listing): ListingDraft {
  const base = emptyDraft();
  const propertyType: PropertyType =
    l.propertyType && (PROPERTY_TYPES as readonly string[]).includes(l.propertyType)
      ? l.propertyType
      : "apartment";
  return {
    ...base,
    id: l.id,
    title: l.title,
    description: l.description ?? "",
    propertyType,
    contactPhone: l.contactPhone ?? "",
    maxGuests: l.maxGuests || base.maxGuests,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    gallery: l.gallery,
    cover: l.cover,
    city: l.city,
    district: l.district ?? "",
    address: l.address ?? "",
    latitude: l.latitude,
    longitude: l.longitude,
    amenities: l.amenities.length ? l.amenities : base.amenities,
    tags: l.tags,
    rules: l.rules ?? base.rules,
    pricing: l.pricing ?? {
      ...base.pricing,
      amount: l.pricePerMonth,
      model: "month",
    },
    conditions: l.conditions ?? base.conditions,
  };
}
