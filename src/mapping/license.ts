import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ApprovalForAll,
  TransferSingle,
  TransferBatch,
} from "../../generated/EthunesLicenses/EthunesLicenses"
import { ZERO_ADDRESS } from "../constants";
import { loadOrCreateLicense, loadOrCreateLicenseOwnership } from "../factory/license";

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleTransferSingle(event: TransferSingle): void {

  handleTransfer(
    event.params.id,
    event.params.value,
    event.params.from,
    event.params.to,
    event.transaction.hash.toHexString(),
    event.block.timestamp
  )

}

export function handleTransferBatch(event: TransferBatch): void {

  // For each token ID
  let ids = event.params.ids;
  let values = event.params.values;

  for (let i = 0; i < ids.length; i++) {
  handleTransfer(
    ids[i],
    values[i],
    event.params.from,
    event.params.to,
    event.transaction.hash.toHexString(),
    event.block.timestamp
  )
  }

}

function handleTransfer(licenseId: BigInt, quantity: BigInt, from: Address, to: Address, txnHash: string, timestamp: BigInt): void {

  let license = loadOrCreateLicense(licenseId)
  if (from == Address.fromString(ZERO_ADDRESS)) {
    // If from genesis, increase license counts
    license.totalSupply = license.totalSupply.plus(quantity)
  } 

  // Update receiver
  let licenseOwnershipId = licenseId.toString().concat("-").concat(to.toHexString())
  let licenseOwnership = loadOrCreateLicenseOwnership(licenseOwnershipId)
  licenseOwnership.quantity.plus(quantity)
  // Update sender
  let licenseFromOwnershipId = licenseId.toString().concat("-").concat(from.toHexString())
  let licenseFromOwnership = loadOrCreateLicenseOwnership(licenseFromOwnershipId)
  licenseFromOwnership.quantity.minus(quantity)
  
  licenseOwnership.save()
  licenseFromOwnership.save()
  license.save()
  
}
