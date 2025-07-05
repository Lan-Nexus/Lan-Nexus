import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CreateGameView from '@/views/CreateGameView.vue'
import ViewGameView from '@/views/ViewGameView.vue'
import EditGameView from '@/views/UpdateGameView.vue'
import LoginView from '@/views/LoginView.vue'
import CreateGameSteamView from '@/views/CreateGameSteamView.vue'
import FindGameView from '@/views/FindGameView.vue'
import addGameView from '@/views/addGameView.vue'

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
      path: '/game/view/:id',
      name: 'viewGame',
      component: ViewGameView,
    },
    {
      path: '/steam/',
      name: 'createGameSteam',
      component: CreateGameSteamView,
    },
    {
      path: '/game/edit/:id',
      name: 'editGame',
      component: EditGameView,
    },
    {
      path: '/game/find',
      name: 'findGame',
      component: FindGameView,
    },
    {
      path: '/game/find/add/:gameId',
      name: 'addGame',
      component: addGameView,
    },
  ],
})

export default router
