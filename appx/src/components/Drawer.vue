<template>
  <div
    v-if="isAuthorized"
    class="flex flex-column sidebar-fullheight justify-content-between">
    Is authorized
    <Spacer />
    <Button
      icon="pi pi-power-off"
      :label="$t('actions.drawer.logout')"
      class="p-button-danger p-button-outlined"
      @click="handleLogout" />
  </div>
  <div
    v-else
    class="flex flex-column sidebar-fullheight justify-content-between">
    <Button
      icon="pi pi-power-on"
      :label="$t('actions.drawer.login')"
      @click="handleGotoSignin" />
    <Spacer />
    <p>Not authorized</p>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { authThunk, appThunk } from '@/store'

@Options({})
export default class Drawer extends Vue {
  /**
   * is authorized? from store
   */
  get isAuthorized (): boolean {
    return authThunk.isAuthorized
  }

  handleLogout (): void {
    // authThunk.signOut()
  }

  handleGotoSignin (): void {
    appThunk.setDrawer(false)
    this.$router.push('/signin')
  }
}
</script>

<style scoped>
.sidebar-fullheight {
  height: 100%;
  min-height: 90vh;
}
</style>
