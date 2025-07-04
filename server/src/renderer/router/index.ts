import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CreateGameView from '@/views/CreateGameView.vue'
import EditGameView from '@/views/UpdateGameView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/game/create',
      name: 'createGame',
      component: CreateGameView,
    },
    {
      path: '/game/edit/:id',
      name: 'editGame',
      component: EditGameView,
    }
  ],
})

export default router
