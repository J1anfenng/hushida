import { createRouter, createWebHistory } from 'vue-router'
import Map from '../components/Map.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Map
    }
  ]
})

export default router 