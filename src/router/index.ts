import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Map from '../components/Map.vue'
import LocationDetail from '../views/LocationDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '',  // 默认子路由
          name: 'map',
          component: Map
        },
        {
          path: 'location/:id',
          name: 'LocationDetail',
          component: LocationDetail
        }
      ]
    }
  ]
})

export default router 