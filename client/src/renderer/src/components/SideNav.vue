<script setup lang="ts">
import { useGameStore } from '../stores/useGameStore.js';
import { useServerAddressStore } from '../stores/useServerAddress.js';
import { useRunningStore } from '@renderer/stores/useRunning.js';

const gameStore = useGameStore();
const serverAddressStore = useServerAddressStore();
const runningStore = useRunningStore();

const isSelectedGame = (gameId: number): boolean => {
  return gameStore.selectedGame?.id === gameId;
};

const isGameRunning = (executable: string): boolean => {
  return runningStore.isRunning(executable);
};

const isGameReady = (game: any): boolean => {
  // For Steam games, assume they're ready if it's a steam game
  // In the future, we could add Steam installation detection
  if (game.type === 'steam') {
    return true; // Could be enhanced to check if Steam is installed
  }
  
  // For archive games, check if they're installed
  if (game.type === 'archive') {
    return game.isInstalled === true;
  }
  
  // For other types, assume ready by default
  return true;
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
        'opacity-50': !isGameReady(game),
      }"
      @click="gameStore.selectGame(game.id)"
    >
      <img
        v-if="game.icon"
        :src="serverAddressStore.serverAddress + game.icon"
        alt="game image"
        class="h-12 w-12"
        :class="{
          'grayscale': !isGameReady(game),
        }"
      />
      <div v-else class="h-12 w-12"></div>

      <div class="flex flex-col justify-center items-start">
        <h2
          class="font-bold"
          :class="{
            'text-primary': isSelectedGame(game.id),
            'text-gray-400': !isGameReady(game),
          }"
        >
          {{ game.name }}
        </h2>
        <div class="flex gap-2 mt-1">
          <span class="badge" :class="game.type === 'archive' ? 'badge-secondary' : 'badge-primary'">
            {{ game.type }}
          </span>
          <span
            v-if="isGameRunning(game.executable)"
            class="badge badge-accent"
          >
            In Game
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
