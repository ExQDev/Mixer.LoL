/* eslint-disable no-undef */
import { createApp } from 'vue'
import store from '@/store'
import 'neutralinojs-types'
import Spotify from '@/backend/spotify'
import Soundcloud from '@/backend/soundcloud'
import JustPlay from '@/backend/justplay'

import router from '@/router'
import i18n from '@/i18n'

import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Breadcrumb from 'primevue/breadcrumb'
import ContextMenu from 'primevue/contextmenu'
import Menubar from 'primevue/menubar'
import Toolbar from 'primevue/toolbar'
import Sidebar from 'primevue/sidebar'
import Checkbox from 'primevue/checkbox'
import Spacer from '@/components/Spacer.vue'
import Drawer from '@/components/Drawer.vue'

// console.log(process)

import 'primevue/resources/primevue.min.css'
// TODO: reduce weight by filter imports of prime flex
import App from './App.vue'
import 'primeicons/primeicons.css'
import '@/assets/theme.scss'
import '@/assets/dark-orange.theme.scss'
import 'primeflex/primeflex.css'

const app = createApp(App)
const spotify = new Spotify()
const soundcloud = new Soundcloud()
const justplay = new JustPlay(soundcloud, spotify)
app.config.globalProperties.spotify = spotify
app.config.globalProperties.soundcloud = soundcloud
app.config.globalProperties.justplay = justplay
app.config.globalProperties.Neutralino = Neutralino

const start = () => {
  app.use(PrimeVue)
    .use(i18n)
    .use(store)
    .use(ToastService)
    .use(router)
    .component('Drawer', Drawer)
    .component('InputText', InputText)
    .component('Button', Button)
    .component('Toast', Toast)
    .component('Card', Card)
    .component('Divider', Divider)
    .component('Breadcrumb', Breadcrumb)
    .component('ContextMenu', ContextMenu)
    .component('Menubar', Menubar)
    .component('Toolbar', Toolbar)
    .component('Sidebar', Sidebar)
    .component('Spacer', Spacer)
    .component('Checkbox', Checkbox)

  app.mount('#app')
}
// console.log(Neutralino)
function onWindowClose () {
  Neutralino.app.exit()
}
try {
  Neutralino.init()
  // Neutralino.events.on('windowClose', onWindowClose)
  Neutralino.events.on('code', (data: any) => {
    console.log('CODE', data)
    // Neutralino.os.showMessageBox('Code', data.detail.code)
    spotify.applyCode(data.detail.code, data.detail.state)
  })
  Neutralino.events.on('log', (data: any) => {
    console.log('LOG', data.detail)
    // Neutralino.os.showMessageBox('Code', data.detail.code)
    // spotify.applyCode(data.detail.code, data.detail.state)
  })
  Neutralino.events.on('msg', (data: any) => {
    // console.log('LOG', data.detail)
    Neutralino.os.showMessageBox('MSG', data.detail)
    // spotify.applyCode(data.detail.code, data.detail.state)
  })
  Neutralino.events.on('token', (data) => {
    console.log('TOKEN', data)
    // Neutralino.os.showMessageBox('Code', data.detail.code)
    // spotify.applyCode(data.detail.code, data.detail.state)
  })
  Neutralino.events.on('champStarted', (data: any) => {
    console.log('CHAMP', data)
    // Neutralino.os.showMessageBox('You selected', data.detail.championName)
    justplay.play(data.detail.id, data.detail.selectedSkinId)
    // spotify.play(data.detail.id, data.detail.selectedSkinId)
    Neutralino.window.hide()
    // spotify.applyCode(data.detail.code, data.detail.state)
  })
  Neutralino.events.on('ready', start).catch(() => {
    start()
  })
  Neutralino.os.setTray({
    icon: '/assets/logo.png',
    menuItems: [
      {
        id: 'open',
        text: 'Open'
      },
      {
        text: '-'
      },
      {
        id: 'close',
        text: 'Close'
      }
    ]
  })
  Neutralino.events.on('trayMenuItemClicked', (e) => {
    // console.log('TRAY', e?.detail.id)
    switch (e?.detail.id) {
      case 'close':
        Neutralino.app.exit(0)
        break
      case 'open':
        Neutralino.window.show()
        break
      default:
        break
    }
  }).catch((e) => {
    console.error(e)
  })
  Neutralino.events.on('windowClose', (e) => {
    if (e) {
      console.log(e)
      e.stopImmediatePropagation()
      e.stopPropagation()
      e.preventDefault()
    }
    Neutralino.window.hide()
  }).catch((e) => {
    console.error(e)
  })
  Neutralino.window.hide()
} catch {
  start()
}
