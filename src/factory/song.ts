import {
  ipfs,
  JSONValue,
  json,
  Result,
  Bytes,
  log,
} from "@graphprotocol/graph-ts";

import { Song } from "../../generated/schema"

export function loadOrCreateSong(
  songId: string
): Song {

  let song = Song.load(songId)

  if (song == null) {
    song = new Song(songId)
  }
  
  return song as Song
}

export function fillMetaDataFromIPFS(song: Song): void {
  let ipfsParts: string[] = song.metadataUrl.split("/")
  let ipfsHash: string = ipfsParts[ipfsParts.length - 1]
  if (ipfsParts.length > 0) {
    log.warning("fill {}", [ipfsHash])
    let data = ipfs.cat("/ipfs/" + ipfsHash)
    if (data === null) {
      // Retry might fix it
      data = ipfs.cat("/ipfs/" + ipfsHash)
    }
    if (data !== null) {
      let result: Result<JSONValue, boolean> = json.try_fromBytes(
        data as Bytes
      );
      if (result.isOk) {
        let jsonData = result.value;
        let jsonObject = jsonData.toObject();
        song.title = jsonObject.get("name").toString();
        log.warning("fill {}", [song.title])
        song.description = jsonObject.get("description").toString()
        if (jsonObject.get("image").isNull() === false) {
          song.image = jsonObject.get("image").toString()
        }
        if (jsonObject.get("animation_url").isNull() === false) {
          song.url = jsonObject.get("animation_url").toString()
        }
      }
    }
  }
}
