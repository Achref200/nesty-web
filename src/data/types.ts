/** Domain types shared across the web app — mirrors the mobile app's model. */

import type {
  BookingConditions,
  HouseRules,
  ListingStatus,
  Pricing,
  PropertyType,
} from "@/lib/listings/schema";

export type ListingType = "entirePlace" | "privateRoom" | "sharedRoom";

export type ListingState = "available" | "reserved";

export type RentalTerm = "shortTerm" | "longTerm";

export const RENTAL_TERM_LABEL: Record<RentalTerm, string> = {
  shortTerm: "Short term",
  longTerm: "Long term",
};

export interface Listing {
  id: string;
  hostId: string;
  title: string;
  city: string;
  pricePerMonth: number;
  type: ListingType;
  rentalTerm: RentalTerm;
  audience: string[];
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  cover: string | null;
  gallery: string[];
  rating: number;
  reviewCount: number;
  state: ListingState;
  latitude: number | null;
  longitude: number | null;
  status: ListingStatus;
  tags: string[];
  views: number;
  saves: number;
  tours: number;
  // Host Listing Management wizard fields (additive; null when pre-migration).
  propertyType: PropertyType | null;
  maxGuests: number;
  district: string | null;
  contactPhone: string | null;
  description: string | null;
  address: string | null;
  amenities: string[];
  rules: HouseRules | null;
  pricing: Pricing | null;
  conditions: BookingConditions | null;
}

export type ReservationType = "visit" | "stay";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "expired"
  | "completed";

export interface Reservation {
  id: string;
  listingId: string;
  listingTitle: string;
  city: string;
  /** The seeker (chercheur) who requested the reservation. */
  seekerName: string;
  type: ReservationType;
  /** ISO date (visit: date + time; stay: check-in). */
  start: string;
  /** ISO date (stay check-out). */
  end?: string;
  guests: number;
  status: ReservationStatus;
  note?: string;
  estimatedTotal?: number;
  /** Human-friendly booking reference, e.g. "NBK-1A2B3C". */
  reference: string;
  /** ISO timestamp when a pending soft-lock expires (48h). */
  expiresAt?: string;
  cancellationReason?: string;
  createdAt: string;
}

export const RESERVATION_STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  rejected: "Rejected",
  cancelled: "Cancelled",
  expired: "Expired",
  completed: "Completed",
};

/** A reservation holds its slot only while pending or confirmed. */
export function isActive(status: ReservationStatus): boolean {
  return status === "pending" || status === "confirmed";
}

/** Reservation states an agency can act on. */
export function isOpen(status: ReservationStatus): boolean {
  return status === "pending" || status === "confirmed";
}

/** The four availability states a calendar day can be in. */
export type DayState = "available" | "blocked" | "pending" | "confirmed";

/** An agency-defined blocked period on a listing's calendar. */
export interface AvailabilityBlock {
  id: string;
  listingId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export type IncidentType =
  | "conflict"
  | "double_booking"
  | "unavailable"
  | "access"
  | "payment"
  | "damage"
  | "cleaning"
  | "other";

export type IncidentStatus = "created" | "under_review" | "resolved" | "closed";

export interface ReservationIncident {
  id: string;
  reservationId: string;
  type: IncidentType;
  description: string;
  occurredOn: string;
  status: IncidentStatus;
  estimatedCost?: number;
  attachments: string[];
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationEvent {
  id: string;
  reservationId: string;
  actorRole: string | null;
  eventType: string;
  fromStatus: string | null;
  toStatus: string | null;
  reason: string | null;
  createdAt: string;
}
