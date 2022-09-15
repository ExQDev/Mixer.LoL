<template>
  <div class="container">
    <Toolbar class="nogutters m0 p0 noborders">
      <template #start>
        <Button
          class="p-button-text p-button-raised p-button-rounded p-button-icon-only"
          @click="toggleDrawer">
          <img alt="Vue logo" src="@/assets/logo.png" height="25" />
        </Button>
      </template>
      <!-- <Divider layout="vertical" class="p0 m0" /> -->
      <template #end>
      </template>
    </Toolbar>
    <router-view />
    <Sidebar v-model:visible="drawerOpen" class="p-sidebar-sm">
      <drawer />
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
    </Sidebar>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { appThunk } from '@/store'

export default class App extends Vue {
  get drawerOpen (): boolean {
    return appThunk.appState.drawerIsOpen
  }

  set drawerOpen (value: boolean) {
    appThunk.setDrawer(value)
  }

  private drawerStatic = false

  toggleDrawer (): void {
    this.drawerOpen = !this.drawerOpen
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
  color: #e7b74e;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
