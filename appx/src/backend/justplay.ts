/* eslint-disable @typescript-eslint/ban-ts-comment */
import musicmap from '../data/musicmap'
import Soundcloud from './soundcloud'
import Spotify from './spotify'

export default class justPlay {
  soundcloud: Soundcloud
  spotify: Spotify
  // Neutralino: any;
  // audio: Audio | null = null

  constructor (soundcloud: Soundcloud, spotify: Spotify) {
    this.soundcloud = soundcloud
    this.spotify = spotify
  }

  play (id: string, fullSkinId: number) {
    const skinId = fullSkinId % 1000
    // @ts-ignore
    const champLists = musicmap[id]
    console.log('champLists', champLists)
    if (champLists) {
      let playlist = champLists[skinId || champLists.default]
      console.log('playlist', playlist, skinId)
      // console.log('playlist for skin', playlist)
      if (!playlist) {
        playlist = champLists[champLists.default]
      }
      console.log('trying default playlist', playlist)
      if (!playlist) {
        Neutralino.os.showMessageBox('Error', 'No playlist for this champ(')
      }
      console.log('Playback started')
      // console.log(this.spotifyApi.getAccessToken())
      if (playlist[0].startsWith('spotify:')) {
        this.spotify.play(id, fullSkinId)
      } else if (playlist[0].startsWith('https://soundcloud.com/')) {
        this.soundcloud.play(id, fullSkinId)
      }
      // Neutralino.extensions.dispatch('org.exqdev.soundcloud', 'play', { playlist })
    }
  }
}
