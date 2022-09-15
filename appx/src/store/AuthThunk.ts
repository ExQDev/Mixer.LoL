// import socket from '@/socket/socket'
import type { SpotyAuth, AuthFormData, SpotifyAuthJSONSchema } from '@/sharedTypes'
import SpotifyAPI from 'spotify-web-api-js'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import router from '@/router'
import { DateTime } from 'luxon'

@Module({ name: 'auth', preserveState: true })
export default class AuthThunk extends VuexModule {
  private _SpotyAuth: SpotyAuth = {
    expires: null,
    refreshToken: null,
    accessToken: null,
    scope: null,
    tokenType: null
  }

  private _spTokenLive = false

  get isAuthorized (): boolean {
    const expires = this.spotyAuth.expires
    if (expires) {
      const diff = DateTime.fromMillis(expires).diffNow('milliseconds').as('milliseconds')
      if (diff > 0) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  get spotyAuth (): SpotyAuth {
    return this._SpotyAuth
  }

  @Mutation
  setSpotyAuth (authData: SpotyAuth): void {
    this._SpotyAuth = authData
  }

  // @Action
  // socket_signinOk(authData: Auth): void {
  //   this.setAuth(authData)
  //   router.push('/')
  //   socket.io.opts.extraHeaders = {
  //     Authorization: authData.accessToken || 'null',
  //   }
  //   socket.disconnect()
  //   socket.connect()
  //   // socket.auth = { token: authData.accessToken }
  // }

  // @Action
  // socket_signoutOk(): void {
  //   this.setAuth({
  //     accessToken: null,
  //     expires: null,
  //     refreshToken: null,
  //   })
  //   router.push('/')
  //   socket.io.opts.extraHeaders = {
  //     Authorization: 'null',
  //   }
  //   socket.disconnect()
  //   socket.connect()
  //   // socket.auth = { token: null }
  // }

  // @Action
  // signIn(adata: AuthFormData): void {
  //   socket.emit('signin', adata)
  // }

  // @Action
  // signOut(): void {
  //   socket.emit('signout', this._auth.accessToken)
  // }
}
