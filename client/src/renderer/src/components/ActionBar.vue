<script lang="ts" setup>
import { onMounted, onUnmounted, useTemplateRef, computed } from 'vue';
import { useGameStore } from '../stores/useGameStore.js';

const actionBarPanel = useTemplateRef<HTMLElement>('actionBarPanel');
const gameStore = useGameStore();
const height = 72;

const isInstalled = computed(() => {
  return gameStore.selectedGame?.isInstalled ?? false;
});

const isloading = computed(() => {
  return gameStore.loading ?? false;
});

const isIngame = computed(() => {
  return gameStore.openGameId !== null && gameStore.openGameId !== undefined;
});


onMounted(() => {
  if (actionBarPanel.value) {
    actionBarPanel.value.closest('.parallax')?.addEventListener('scroll', updateShadow);
  }
});

onUnmounted(() => {
  if (actionBarPanel.value) {
    actionBarPanel.value.closest('.parallax')?.removeEventListener('scroll', updateShadow);
  }
});

function updateShadow() {
  if (actionBarPanel.value) {
    const t = actionBarPanel.value.getBoundingClientRect();
    if (t.y == height) {
      actionBarPanel.value.classList.add('shadow-md');
    } else {
      actionBarPanel.value.classList.remove('shadow-md');
    }
  }
}
</script>

<template>
  <div
    ref="actionBarPanel"
    class="flex flex-row gap-4 border-2 border-base-200 p-4 justify-between items-center sticky top-0 z-10"
  >
    <div v-if="gameStore.selectedGame?.type === 'archive'" class="flex gap-2 items-center w-full">
      <div class="flex gap-2 flex-1">
        <button
          class="btn btn-primary w-24"
          @click="gameStore.installArchive"
          :disabled="isInstalled || isloading || isIngame"
        >
          Install
        </button>
        <button
          class="btn btn-error w-24"
          @click="gameStore.uninstallArchive"
          :disabled="!isInstalled || isloading || isIngame"
        >
          Uninstall
        </button>
        <button
          class="btn btn-warning"
          @click="gameStore.play"
          :disabled="!isInstalled || isloading || isIngame"
        >
          Play
        </button>
      </div>
      <div class="badge badge-secondary ml-4">
        {{ gameStore.selectedGame?.gamekey?.key || 'No Game Key' }}
      </div>
    </div>
    <div v-else>
      <button
        class="btn btn-warning"
        @click="gameStore.play"
      >
        Launch in {{ gameStore.selectedGame?.type }}
      </button>
    </div>
  </div>
</template>
