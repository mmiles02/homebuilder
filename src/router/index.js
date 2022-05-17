import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Builder from '@/views/Builder.vue'
import About from '@/views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: 'Home' }
  },
  {
    path: '/builder',
    name: 'builder',
    component: Builder,
    props: true,
    meta: { title: 'Builder' }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    props: true,
    meta: { title: 'About' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Cause the page title to update
router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title
  })
})

export default router
