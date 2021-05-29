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
