"use server";

import {
  getPublicListings,
  type PublicListingsQuery,
  type PublicListingsResult,
} from "@/lib/queries";

/**
 * Server action the traveller space calls to page through / filter listings.
 * All the heavy lifting (DB-side filter + range + count) lives in
 * `getPublicListings`, so the browser only ever receives one page.
 */
export async function loadPublicListings(
  query: PublicListingsQuery,
): Promise<PublicListingsResult> {
  return getPublicListings(query);
}
