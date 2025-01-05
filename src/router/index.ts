import { createRouter, createWebHistory } from 'vue-router'
import Map from '../components/Map.vue'
import LocationDetail from '../views/LocationDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Map
    },
    {
      path: '/location/:id',
      name: 'LocationDetail',
      component: LocationDetail
    }
  ]
})

export default router 