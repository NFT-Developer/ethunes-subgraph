import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import {
  ApprovalForAll,
  TransferSingle,
  TransferBatch,
  EthunesLicenses,
} from "../../generated/EthunesLicenses/EthunesLicenses";
import { ZERO_ADDRESS } from "../constants";
import { loadOrCreateAccount } from "../factory/account";
import {
  loadOrCreateLicense,
  loadOrCreateLicenseOwnership,
} from "../factory/license";

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleTransferSingle(event: TransferSingle): void {

  log.warning("License Transfer Single", [])

  handleTransfer(
    event.address,
    event.params.id,
    event.params.value,
    event.params.from,
    event.params.to,
    event.transaction.hash.toHexString(),
    event.block.timestamp
  );
}

export function handleTransferBatch(event: TransferBatch): void {
  // For each token ID
  let ids = event.params.ids;
  let values = event.params.values;

  for (let i = 0; i < ids.length; i++) {
    handleTransfer(
      event.address,
      ids[i],
      values[i],
      event.params.from,
      event.params.to,
      event.transaction.hash.toHexString(),
      event.block.timestamp
    );
  }
}

function handleTransfer(
  eventAddress: Address,
  licenseId: BigInt,
  quantity: BigInt,
  from: Address,
  to: Address,
  txnHash: string,
  timestamp: BigInt
): void {
  log.warning("License Transfer Helper {}", [txnHash])
  let fromAccount = loadOrCreateAccount(from.toHexString());
  let toAccount = loadOrCreateAccount(to.toHexString());

  let license = loadOrCreateLicense(licenseId);
  if (from == Address.fromString(ZERO_ADDRESS)) {
    // Can skip this if already in factory
    let contract = EthunesLicenses.bind(eventAddress);
    let decoded = contract.decode(licenseId);
    license.song = decoded.value0.toString();
    license.categoryId = decoded.value1;
    license.purposeId = BigInt.fromI32(decoded.value2);
    // If from genesis, increase license counts
    license.totalSupply = license.totalSupply.plus(quantity);
  }

  // Update receiver
  let licenseOwnershipId = licenseId
    .toString()
    .concat("-")
    .concat(to.toHexString());
  let licenseOwnership = loadOrCreateLicenseOwnership(licenseOwnershipId);
  licenseOwnership.quantity.plus(quantity);
  // Update sender
  let licenseFromOwnershipId = licenseId
    .toString()
    .concat("-")
    .concat(from.toHexString());
  let licenseFromOwnership = loadOrCreateLicenseOwnership(
    licenseFromOwnershipId
  );
  licenseFromOwnership.quantity.minus(quantity);

  fromAccount.save();
  toAccount.save();
  licenseOwnership.save();
  licenseFromOwnership.save();
  license.save();
}
