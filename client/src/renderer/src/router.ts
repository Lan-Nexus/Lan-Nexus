import { createMemoryHistory, createRouter } from 'vue-router';

// import HomeView from './views/HomeView.vue';
import GameView from './views/GameView.vue';
import SettingsView from './views/SettingsView.vue';

export const routes = [
  // { path: '/', component: HomeView }, // Home moved to /home
  { path: '/', component: GameView },
  { path: '/settings', component: SettingsView },
  { path: '/avatar', component: () => import('./views/AvatarView.vue') },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
