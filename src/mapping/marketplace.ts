import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import {
  EthunesLicenseAdded,
} from "../../generated/EthunesMarketplace/EthunesMarketplace";

import { loadOrCreateAccount } from "../factory/account";
import {
  loadOrCreateLicense,
} from "../factory/license";
import { loadOrCreateListing } from "../factory/listing";

export function handleEthunesLicenseAdded(event: EthunesLicenseAdded): void {
  
  log.warning("License Added", [])
  let license = loadOrCreateLicense(event.params.LicenseId)
  license.save()

  let listing = loadOrCreateListing(event.params.LicenseId.toString())
  listing.license = event.params.LicenseId.toString()
  listing.price = event.params.price

  let issuer = loadOrCreateAccount(event.params.publisher.toHexString())
  issuer.save()

  listing.issuer = issuer.id
  listing.save()

}


