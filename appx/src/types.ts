import AuthThunk from './store/AuthThunk'
// import UserThunk from './store/UserThunk'

export type RootState = {
  AuthThunk: AuthThunk
  // UserThunk: UserThunk
}

export type AppState = {
  drawerIsOpen: boolean
}
