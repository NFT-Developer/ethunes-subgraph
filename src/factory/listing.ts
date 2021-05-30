import { Listing } from "../../generated/schema"

export function loadOrCreateListing(
  listingId: string
): Listing {

  let listing = Listing.load(listingId)

  if (listing == null) {
    listing = new Listing(listingId)
  }
  
  return listing as Listing
}
