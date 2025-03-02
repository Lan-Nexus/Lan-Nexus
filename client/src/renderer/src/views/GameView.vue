<script lang="ts" setup>
import { ref, computed } from 'vue'
import SideNav from '../components/SideNav.vue'
import ActionBar from '../components/ActionBar.vue'
import { useGameStore } from '../stores/useGameStore'

const gameStore = useGameStore()

const selectedGame = computed(() => {
  return gameStore.selectedGame
})
</script>

<template>
  <div class="flex flex-col h-full w-full overflow-hidden flex flex-row">
    <SideNav />
    <div class="flex flex-col flex-1" v-if="selectedGame">
      <img
        v-if="selectedGame.banner"
        :src="selectedGame.banner"
        alt="game banner"
        class="h-48 w-full object-cover"
      />
      <div class="p-4">
        <div class="flex gap-4 items-center pb-4">
          <img
            v-if="selectedGame.icon"
            :src="selectedGame.icon"
            alt="game icon"
            class="h-12 w-12"
          />
          <h1 class="text-2xl">{{ selectedGame?.name }}</h1>
        </div>
        <ActionBar />
        <div class="mt-4 flex flex-row gap-4">
          <p class="mt-2 w-2/3">
            {{ selectedGame?.description }}
          </p>
          <img
            v-if="selectedGame.boxArt"
            :src="selectedGame.boxArt"
            alt="game screenshot"
            class="w-1/3 object-cover h-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

