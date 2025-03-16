<script lang="ts" setup>
import { computed } from 'vue';
import SideNav from '../components/SideNav.vue';
import ActionBar from '../components/ActionBar.vue';
import { useGameStore } from '../stores/useGameStore';

const gameStore = useGameStore();

gameStore.loadGames();
const selectedGame = computed(() => {
  return gameStore.selectedGame;
});
</script>

<template>
  <div class="flex flex-col h-full w-full flex flex-row">
    <SideNav />
    <div class="flex flex-col flex-1" style="height: 87vh; overflow: overlay" v-if="selectedGame">
      <div class="w-full h-60 relative">
        <img
          v-if="selectedGame.heroImage"
          :src="'data:image/jpeg;base64,' + selectedGame.heroImage"
          alt="game"
          class="w-full object-cover"
        />
        <img
          v-if="selectedGame.logo"
          :src="'data:image/jpeg;base64,' + selectedGame.logo"
          class="top-1/2 absolute w-1/3"
        />
      </div>
      <div class="p-4 pt-52">
        <div class="flex gap-4 items-center pb-4">
          <img
            v-if="selectedGame.icon"
            :src="'data:image/jpeg;base64,' + selectedGame.icon"
            alt="game icon"
            class="h-12 w-12"
          />
          <h1 class="text-2xl">{{ selectedGame?.name }}</h1>
          <span
            class="badge"
            :class="selectedGame.type === 'zip' ? 'badge-primary' : 'badge-secondary'"
          >
            {{ selectedGame.type }}
          </span>
        </div>
        <ActionBar />
        <div class="mt-4 flex flex-row gap-4">
          <div v-html="selectedGame?.description"></div>
        </div>
      </div>
    </div>
  </div>
</template>
