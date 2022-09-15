/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import SpotifyAPI from 'spotify-web-api-js'
import { DateTime } from 'luxon'
import md5 from 'md5'
import { SpotifyAuthJSONSchema } from '@/sharedTypes'
import musicmap from '../data/musicmap'
import { authThunk } from '@/store'

const authURL = process.env.authURL
const tokenURL = process.env.tokenURL
const redirect_uri = process.env.redirectURL
const clientId = process.env.clientID
const clientSecret = process.env.clientSecret
const scopes = 'user-modify-playback-state user-read-playback-position user-read-playback-state'
// const playlist = '5wOkEbjmGkeiWzDzZRgXzR'

export default class Spotify {
  spotifyApi: SpotifyAPI.SpotifyWebApiJs;
  // tokenLive = false;
  Neutralino: any;
  state: string;
  openedWindow: Window | null = null;

  constructor () {
    const spotyApi = new SpotifyAPI()
    this.spotifyApi = spotyApi
    this.Neutralino = Neutralino
    // console.log(authThunk.checkToken)
    this.checkToken()
  }

  public checkToken (): boolean {
    // const expires = localStorage.getItem('expires_in')
    if (authThunk.spotyAuth.expires) {
      const diff = DateTime.fromMillis(authThunk.spotyAuth.expires).diffNow('milliseconds').as('milliseconds')
      if (diff > 0) {
        if (this.spotifyApi) {
          this.spotifyApi.setAccessToken(authThunk.spotyAuth.accessToken)
        }
      }
    }
    return authThunk.isAuthorized
  }

  public canRefreshToken (): boolean {
    const expires = authThunk.spotyAuth.expires
    const refreshToken = authThunk.spotyAuth.refreshToken
    if (expires) {
      const diff = DateTime.fromMillis(expires).diffNow('milliseconds').as('milliseconds')
      return diff > 0 && !!refreshToken
    } else {
      return false
    }
  }

  public async refreshToken (): Promise<string|null> {
    const refresh_token = authThunk.spotyAuth.refreshToken
    if (!refresh_token) {
      return null
    }
    if (!tokenURL) {
      return null
    }

    const body = {
      grant_type: 'refresh_token',
      refresh_token
    }
    const params = (new URLSearchParams(body)).toString()

    const response = await fetch(tokenURL, {
      method: 'POST',
      body: params,
      headers: {
        Authorization: 'Basic ' + (Buffer.from(`${clientId}:${clientSecret}`).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const data: SpotifyAuthJSONSchema = await response.json()
    this.setData(data)
    return data.access_token
  }

  public setData (data: SpotifyAuthJSONSchema): void {
    authThunk.setSpotyAuth({
      expires: DateTime.now().plus(data.expires_in * 1000).toMillis(),
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      scope: data.scope,
      tokenType: data.token_type
    })
    this.spotifyApi.setAccessToken(data.access_token)
  }

  public isAuthorized (): boolean {
    return this.checkToken()
  }

  public applyCode (code: string, state: string): void {
    if (this.openedWindow) {
      this.openedWindow.close()
    }
    if (!tokenURL || !redirect_uri) {
      return
    }
    console.log(state, this.state)
    if (state === this.state) {
      this.state = ''
      const body = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirect_uri
      }
      const params = (new URLSearchParams(body)).toString()

      fetch(tokenURL, {
        method: 'POST',
        body: params,
        headers: {
          Authorization: 'Basic ' + (Buffer.from(`${clientId}:${clientSecret}`).toString('base64')),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(response => {
        return response.text()
      }).then(json => {
        const data: SpotifyAuthJSONSchema = JSON.parse(json)
        this.setData(data)
      })
    } else {
      this.Neutralino.os.showMessageBox('Error', 'Different states')
    }
  }

  public async authorize (): Promise<void> {
    if (!this.checkToken()) {
      if (this.canRefreshToken()) {
        const token = await this.refreshToken()
        if (token) {
          this.spotifyApi.setAccessToken(token)
          return
        }
      }
    }
    if (!redirect_uri || !clientId) {
      return
    }
    this.state = md5(DateTime.now().toString())
    const url = (new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scopes,
      redirect_uri: redirect_uri,
      state: this.state
    })).toString()
    this.openedWindow = window.open(authURL + url)
  }

  public async play (id: string, fullSkinId: number) {
    // if (!this.checkToken()) {
    //   if (this.canRefreshToken()) {
    //     const token = await this.refreshToken()
    //     if (token) {
    //       this.spotifyApi.setAccessToken(token)
    //     } else {
    //       this.authorize()
    //       return
    //     }
    //   } else {
    //     this.authorize()
    //     return
    //   }
    // }

    await this.authorize()

    const devices = await this.spotifyApi.getMyDevices()
    console.log('devices', devices)
    const skinId = fullSkinId % 1000
    // @ts-ignore
    const champLists = musicmap[id]
    console.log('champLists', champLists)
    if (champLists) {
      let playlist = champLists[`${skinId}` || champLists.default]
      console.log('playlist for skin', playlist)
      if (!playlist) {
        playlist = champLists[champLists.default]
      }
      console.log('trying default playlist', playlist)
      if (!playlist) {
        this.Neutralino.os.showMessageBox('Error', 'No playlist for this champ(')
      }
      console.log('Playback started')
      const params: SpotifyApi.PlayParameterObject = {
        uris: playlist // data.body.items.map(item => item.track.uri)
      }
      if (devices && devices.devices.length > 0) {
        params.device_id = devices.devices[0].id ? devices.devices[0].id : undefined
      }
      // console.log(this.spotifyApi.getAccessToken())
      this.spotifyApi.play(params).catch(err => {
        console.log(err)
        const parsed = JSON.parse(err.responseText)
        console.log(parsed)
        this.Neutralino.os.showMessageBox('Error', parsed.error.message)
      })
    }
    // this.spotifyApi.getPlaylistTracks(playlist)
    //   .then((data: any) => {
    // }
    // , (err: any) => {
    //   // if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    //   console.log('Something went wrong!', err)
    // })
  }

  public async stop (): Promise<void> {
    // if (!this.checkToken()) {
    //   if (this.canRefreshToken()) {
    //     const token = await this.refreshToken()
    //     if (token) {
    //       this.spotifyApi.setAccessToken(token)
    //     } else {
    //       this.authorize()
    //       return
    //     }
    //   } else {
    //     this.authorize()
    //     return
    //   }
    // }
    await this.authorize()
    this.spotifyApi.pause()
  }
}

// const start = () => {
//   // spotify.connect().then((v) => {
//   //   console.log('connected')
//   //   spotify.play("spotify:track:4LYt31Tg51qsQqWOaZn4C6", "spotify:artist:5byg90wTxATnhB6kK253DF").then(v => {
//   //     console.log("Played");
//   //     spotify.startListener(["play", "pause"]).on("event", data => {
//   //         console.log(JSON.stringify(data, null, 4));
//   //     });
//   //   }, err => {
//   //       console.error(err);
//   //   });
//   // })
// }
