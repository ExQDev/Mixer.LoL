/* eslint-disable camelcase */
import type { AppState } from '@/types'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({ name: 'app' })
export default class AppThunk extends VuexModule {
  private _appstate: AppState = {
    drawerIsOpen: false
  }

  @Mutation
  setDrawer (open: boolean): void {
    this._appstate.drawerIsOpen = open
  }

  @Action
  socket_signoutOk (): void {
    this.setDrawer(false)
  }

  public get appState (): AppState {
    return this._appstate
  }
}
