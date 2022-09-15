import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import OAuth from '@/views/OAuth.vue'
import About from '@/views/About.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/oauth',
    component: OAuth
  }
]

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory('/'),
  routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
  console.log('GO> ', from.path, to.path)
  next()
})

export default router
