import { Address } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  Transfer
} from "../../generated/EthunesSongs/EthunesSongs"
import { ZERO_ADDRESS } from "../constants"
import { loadOrCreateSong } from "../factory/song"

export function handleApproval(event: Approval): void {}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleTransfer(event: Transfer): void {
  let from = event.params.from
  let to = event.params.to
  let tokenId = event.params.tokenId

  let song = loadOrCreateSong(tokenId.toString())
  song.owner = to.toHexString()
  
  if (from == Address.fromString(ZERO_ADDRESS)) {
    // Genesis
    song.creator = to.toHexString()
  }
}
