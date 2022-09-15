<template>
  <div>
    <Button @click="showMessage">Show Message</Button>
    <Button @click="stopPlay">Stop playback</Button>
  </div>
</template>

<script lang="ts">
import LoLClient from '@/backend/lolInteract'
// import Soundcloud from '@/backend/soundcloud';
import Spotify from '@/backend/spotify'
import { Options, Vue } from 'vue-class-component'

@Options({
  name: 'Home'
})
export default class Home extends Vue {
  private drawerStatic = false
  Neutralino: any;
  spotify: Spotify;
  lolClient: LoLClient;
  justplay: any;

  mounted (): void {
    this.spotify.authorize()
  }

  stopPlay (): void {
    console.log('Start')
    this.spotify.stop()
  }

  showMessage (): void {
    if (this.Neutralino) {
      // this.lolClient.init()
      // this.Neutralino.os.showMessageBox('Hello', 'From NeuVite!')
      this.justplay.play('Yasuo', 9)
      // this.justplay.play('Corki', 3)
      // this.soundcloud.play()
    }
  }
}

</script>
