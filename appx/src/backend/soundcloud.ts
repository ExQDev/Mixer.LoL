/* eslint-disable @typescript-eslint/ban-ts-comment */
import musicmap from '../data/musicmap'

export default class Soundcloud {
  // Neutralino: any;
  // audio: Audio | null = null

  // constructor() {
  //   this.Neutralino = Neutralino
  // }

  play (id: string, fullSkinId: number) {
    const skinId = fullSkinId % 1000
    // @ts-ignore
    const champLists = musicmap[id]
    // console.log('champLists', champLists)
    if (champLists) {
      let playlist = champLists[`${skinId}` || champLists.default]
      // console.log('playlist for skin', playlist)
      if (!playlist) {
        playlist = champLists[champLists.default]
      }
      // console.log('trying default playlist', playlist)
      if (!playlist) {
        Neutralino.os.showMessageBox('Error', 'No playlist for this champ(')
      }
      console.log('Playback started')
      // console.log(this.spotifyApi.getAccessToken())
      Neutralino.extensions.dispatch('org.exqdev.soundcloud', 'play', { playlist })
    }
  }
}
