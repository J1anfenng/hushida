import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Map from '../components/Map.vue'
import LocationDetail from '../views/LocationDetail.vue'
import CircleView from '../views/CircleView.vue'
import PersonalView from '../views/PersonalView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'map',
          component: Map
        },
        {
          path: 'location/:id',
          name: 'LocationDetail',
          component: LocationDetail
        },
        {
          path: 'circle',
          name: 'circle',
          component: CircleView
        },
        {
          path: 'personal',
          name: 'personal',
          component: PersonalView
        }
      ]
    }
  ]
})

export default router 