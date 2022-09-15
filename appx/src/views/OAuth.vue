<template>
  <div>Auth</div>
</template>

<script lang="ts">
// import Spotify from '@/backend/spotify'
import { Options, Vue } from 'vue-class-component'

@Options({
  name: 'OAuth'
})
export default class OAuth extends Vue {
  mounted (): void {
    console.log(this.$route.query)
  }
}
</script>

<style>

</style>
