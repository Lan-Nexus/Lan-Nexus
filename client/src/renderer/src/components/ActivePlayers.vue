<template>
  <div v-if="isActiveGameRunning" class="m-2 p-2 bg-green-200 rounded-lg shadow-md flex items-center gap-2">
    <div class="flex items-center gap-1 w-full">
      <div class="avatar">
        <div class="w-6 h-6 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
          <img :src="avatar" alt="Player Avatar" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAvatarStore } from '../stores/useAvatarStore';
import { useGameStore } from '../stores/useGameStore';
import { useRunningStore } from '../stores/useRunning';

const avatarStore = useAvatarStore();
const gameStore = useGameStore();
const runningStore = useRunningStore();

const avatar = computed(() => avatarStore.get());
const selectedGame = computed(() => gameStore.selectedGame);

const isActiveGameRunning = computed(() => {
  const game = selectedGame.value;
  if (!game || !game.executable) return false;
  return runningStore.isRunning(game.executable);
});
</script>
