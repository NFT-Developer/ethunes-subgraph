import { Address, BigInt } from "@graphprotocol/graph-ts";
import { EthunesLicenses } from "../../generated/EthunesLicenses/EthunesLicenses";

import { License, LicensesOwnership } from "../../generated/schema";
import { LICENSE_ADDRESS } from "../constants";

export function loadOrCreateLicense(licenseId: BigInt): License {
  let license = License.load(licenseId.toString());

  if (license == null) {
    license = new License(licenseId.toString());
    // Will fill in on the event call so we can use contract.decode
    // license.song = getSongId(licenseId).toString()
    // license.categoryId = getCategoryId(licenseId)
    // license.purposeId = getPurposeId(licenseId)
    let contract = EthunesLicenses.bind(Address.fromString(LICENSE_ADDRESS));
    let decoded = contract.decode(licenseId);
    license.song = decoded.value0.toString();
    // license.categoryId = decoded.value1;
    // license.purposeId = BigInt.fromI32(decoded.value2);
    license.totalSupply = BigInt.fromI32(0);
  }
  return license as License;
}

export function loadOrCreateLicenseOwnership(
  licenseOwnershipId: string
): LicensesOwnership {
  let licenseOwnership = LicensesOwnership.load(licenseOwnershipId);

  if (licenseOwnership == null) {
    licenseOwnership = new LicensesOwnership(licenseOwnershipId);
    licenseOwnership.account = getAccountStr(licenseOwnershipId);
    licenseOwnership.license = getLicenseStr(licenseOwnershipId);
    licenseOwnership.quantity = BigInt.fromI32(0);
  }

  return licenseOwnership as LicensesOwnership;
}

// Helpers
// first byte is the purpose id, next 4 bytes is the categoryId and the remaining is the songId
// return ( _tokenId >> 40, uint32(_tokenId << 216 >> 224), uint8 (_tokenId) );

function getSongId(licenseId: BigInt): BigInt {
  // First length - 2 digits (from the left) (deprecated)
  return licenseId.div(BigInt.fromI32(100));
  // return BigInt.fromI32(licenseId >> 40)
}

function getCategoryId(licenseId: BigInt): BigInt {
  // Second to last digit (from the left) (deprecated)
  return licenseId.mod(BigInt.fromI32(100)).div(BigInt.fromI32(10));
}

function getPurposeId(licenseId: BigInt): BigInt {
  // Last digit (from the left) (deprecated)
  return licenseId.mod(BigInt.fromI32(10));
}

function getLicenseStr(licenseOwnershipId: string): string {
  return licenseOwnershipId.split("-")[0];
}

function getAccountStr(licenseOwnershipId: string): string {
  return licenseOwnershipId.split("-")[1];
}
