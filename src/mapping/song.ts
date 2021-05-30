import { Address } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  Transfer
} from "../../generated/EthunesSongs/EthunesSongs"
import { ZERO_ADDRESS } from "../constants"
import { loadOrCreateAccount } from "../factory/account"
import { fillMetaDataFromIPFS, loadOrCreateSong } from "../factory/song"

export function handleApproval(event: Approval): void {}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleTransfer(event: Transfer): void {
  let from = loadOrCreateAccount(event.params.from.toHexString())
  let to = loadOrCreateAccount(event.params.to.toHexString())
  let tokenId = event.params.tokenId

  let song = loadOrCreateSong(tokenId.toString())
  song.owner = to.id
  
  if (from.id == ZERO_ADDRESS) {
    // Genesis
    song.creator = to.id
    fillMetaDataFromIPFS(song)
  }
  from.save()
  to.save()
  song.save()
}
