/* eslint-disable camelcase */

export type Opt<T> = T | null

export type User = {
  id: Opt<string>
  name: string
  email: string
  binApiKey: string
}

export type SpotifyAuthJSONSchema = {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export type SpotyAuth = {
  accessToken: Opt<string>
  refreshToken: Opt<string>
  expires: Opt<number>
  scope: Opt<string>
  tokenType: Opt<string>
}

export type AuthFormData = {
  email: string
  password: string
  register: boolean
}

export type SocketError = {
  name: string
  message: string
}
