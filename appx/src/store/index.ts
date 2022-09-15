import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import AuthThunk from './AuthThunk'
// import UserThunk from './UserThunk'
import AppThunk from './AppThunk'
import { getModule } from 'vuex-module-decorators'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['auth', 'user']
})

const Store = createStore({
  modules: {
    // user: UserThunk,
    auth: AuthThunk,
    app: AppThunk
  },
  plugins: [vuexLocal.plugin]
})

export default Store

// export const userThunk: UserThunk = getModule(UserThunk, Store)
export const authThunk: AuthThunk = getModule(AuthThunk, Store)
export const appThunk: AppThunk = getModule(AppThunk, Store)
