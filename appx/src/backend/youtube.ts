import ytdl from 'ytdl-core'

export default class Youtube {
  async play (url: string) {
    const player = await ytdl(url)
    // const res = createAudioResource(player, { inputType: StreamType.Arbitrary })
  }
}
