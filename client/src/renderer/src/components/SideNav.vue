<script setup lang="ts">
import { useGameStore } from '../stores/useGameStore.js';
import { useServerAddressStore } from '../stores/useServerAddress.js';

const gameStore = useGameStore();
const serverAddressStore = useServerAddressStore();

const isSelectedGame = (gameId: number): boolean => {
  return gameStore.selectedGame?.id === gameId;
};
</script>

<template>
  <div class="w-90 h-[calc((100vh-130px))] bg-base-100 shadow-lg flex flex-col scroll_enabled">
    <div
      v-for="game in gameStore.games"
      :key="game.id"
      class="flex gap-4 p-4 cursor-pointer"
      :class="{
        'bg-base-200': isSelectedGame(game.id),
      }"
      @click="gameStore.selectGame(game.id)"
    >
      <img
        v-if="game.icon"
        :src="serverAddressStore.serverAddress + game.icon"
        alt="game image"
        class="h-12 w-12"
      />
      <div v-else class="h-12 w-12"></div>

      <div class="flex flex-col justify-center items-start">
        <h2
          class="font-bold"
          :class="{
            'text-primary': isSelectedGame(game.id),
          }"
        >
          {{ game.name }}
        </h2>
        <span class="badge" :class="game.type === 'zip' ? 'badge-primary' : 'badge-secondary'">
          {{ game.type }}</span
        >
      </div>
    </div>
  </div>
</template>
