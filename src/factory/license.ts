import { BigInt } from "@graphprotocol/graph-ts"

import { License, LicensesOwnership } from "../../generated/schema"

export function loadOrCreateLicense(
  licenseId: BigInt
): License {

  let license = License.load(licenseId.toString())

  if (license == null) {
    license = new License(licenseId.toString())
    license.song = getSongId(licenseId).toString()
    license.categoryId = getCategoryId(licenseId)
    license.purposeId = getPurposeId(licenseId)
    license.totalSupply = BigInt.fromI32(0)
    
  }
  return license as License
}

export function loadOrCreateLicenseOwnership(
  licenseOwnershipId: string
): LicensesOwnership {

  let licenseOwnership = LicensesOwnership.load(licenseOwnershipId)

  if (licenseOwnership == null) {
    licenseOwnership = new LicensesOwnership(licenseOwnershipId)
    licenseOwnership.account = getAccountStr(licenseOwnershipId)
    licenseOwnership.license = getLicenseStr(licenseOwnershipId)
    licenseOwnership.quantity = BigInt.fromI32(0)
  }
  
  return licenseOwnership as LicensesOwnership
}

// Helpers

function getSongId(licenseId: BigInt): BigInt {
  // First length - 2 digits (from the left)
  return licenseId.div(BigInt.fromI32(100))
}

function getCategoryId(licenseId: BigInt): BigInt {
  // Second to last digit (from the left)
  return licenseId.mod(BigInt.fromI32(100)).div(BigInt.fromI32(10))
}

function getPurposeId(licenseId: BigInt): BigInt {
  // Last digit (from the left)
  return licenseId.mod(BigInt.fromI32(10))
}

function getLicenseStr(licenseOwnershipId: string): string {
  return licenseOwnershipId.split("-")[0]
}

function getAccountStr(licenseOwnershipId: string): string {
  return licenseOwnershipId.split("-")[1]
}