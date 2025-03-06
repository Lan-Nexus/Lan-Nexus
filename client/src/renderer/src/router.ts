import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'
import GameView from './views/GameView.vue'
import SettingsView from './views/SettingsView.vue'

export const routes = [
  { path: '/', component: HomeView },
  { path: '/games', component: GameView },
  { path: '/settings', component: SettingsView },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
