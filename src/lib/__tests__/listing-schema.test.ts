import { describe, expect, it } from "vitest";
import {
  emptyDraft,
  isInTunisia,
  isValidPhone,
  normalizeStatus,
  validateAll,
  validateGeneral,
  validateLocation,
  validatePhotos,
  validatePricing,
  type ListingDraft,
} from "@/lib/listings/schema";

/** A fully valid draft used as the baseline for negative-case tests. */
function validDraft(): ListingDraft {
  return {
    ...emptyDraft(),
    title: "Bright sea-view apartment",
    description: "A lovely place.",
    propertyType: "apartment",
    contactPhone: "+21620000000",
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    gallery: ["a", "b", "c", "d", "e"],
    cover: "a",
    city: "Tunis",
    address: "Rue du Lac",
    latitude: 36.8,
    longitude: 10.18,
    pricing: {
      model: "night",
      amount: 120,
      minNights: 1,
      longStayDiscountPct: 0,
      extraFee: 0,
    },
  };
}

describe("normalizeStatus", () => {
  it("maps legacy values to the lifecycle vocabulary", () => {
    expect(normalizeStatus("active")).toBe("published");
    expect(normalizeStatus("hidden")).toBe("disabled");
  });
  it("passes through known lifecycle values", () => {
    expect(normalizeStatus("draft")).toBe("draft");
    expect(normalizeStatus("published")).toBe("published");
  });
  it("defaults unknown/empty to draft", () => {
    expect(normalizeStatus(null)).toBe("draft");
    expect(normalizeStatus("nonsense")).toBe("draft");
  });
});

describe("isValidPhone", () => {
  it("accepts Tunisian numbers with and without prefix", () => {
    expect(isValidPhone("20000000")).toBe(true);
    expect(isValidPhone("+216 20 000 000")).toBe(true);
    expect(isValidPhone("21620000000")).toBe(true);
  });
  it("rejects malformed numbers", () => {
    expect(isValidPhone("123")).toBe(false);
    expect(isValidPhone("abcdefgh")).toBe(false);
  });
});

describe("isInTunisia", () => {
  it("accepts coordinates inside the country", () => {
    expect(isInTunisia(36.8, 10.18)).toBe(true);
  });
  it("rejects coordinates outside the country", () => {
    expect(isInTunisia(48.85, 2.35)).toBe(false); // Paris
  });
});

describe("validateGeneral", () => {
  it("passes a valid draft", () => {
    expect(validateGeneral(validDraft())).toEqual({});
  });
  it("flags a missing title and invalid phone", () => {
    const e = validateGeneral({ ...validDraft(), title: "", contactPhone: "x" });
    expect(e.title).toBe("titleRequired");
    expect(e.contactPhone).toBe("phoneInvalid");
  });
});

describe("validatePhotos", () => {
  it("requires at least five photos", () => {
    expect(validatePhotos({ ...validDraft(), gallery: ["a"] }).gallery).toBe(
      "photosTooFew",
    );
  });
  it("rejects more than thirty photos", () => {
    const gallery = Array.from({ length: 31 }, (_, i) => `p${i}`);
    expect(validatePhotos({ ...validDraft(), gallery }).gallery).toBe(
      "photosTooMany",
    );
  });
});

describe("validateLocation", () => {
  it("requires a pin inside Tunisia", () => {
    const e = validateLocation({
      ...validDraft(),
      latitude: 48.85,
      longitude: 2.35,
    });
    expect(e.map).toBe("pinOutsideTunisia");
  });
});

describe("validatePricing", () => {
  it("requires a positive price", () => {
    const e = validatePricing({
      ...validDraft(),
      pricing: { ...validDraft().pricing, amount: 0 },
    });
    expect(e.amount).toBe("priceRequired");
  });
});

describe("validateAll", () => {
  it("returns no errors for a complete valid draft", () => {
    expect(validateAll(validDraft())).toEqual({});
  });
  it("aggregates errors across steps", () => {
    const errors = validateAll(emptyDraft());
    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });
});
