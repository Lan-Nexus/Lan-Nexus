<script lang="ts" setup>
import { useProgressStore } from '../stores/useProgress.js';

const progressStore = useProgressStore();
</script>

<template>
  <div class="fixed bottom-0 w-full">
    <div
      class="flex justify-between items-center bg-base-200 shadow-md w-full px-8 py-3 rounded-lg h-16"
    >
      <div class="flex-grow"></div>
      <progress
        v-if="progressStore.active"
        class="progress progress-primary w-full h-4 w-1/2"
        :value="progressStore.progress"
        max="100"
      />
      <p v-if="progressStore.active" class="text-primary text-sm font-medium ml-4 w-1/4 truncate">
        {{ progressStore.message }}
      </p>

      <div class="flex-grow"></div>
    </div>
  </div>
</template>

<style>
.scroll_enabled {
  overflow: auto;
  scrollbar-gutter: stable;
}

.scroll_enabled::-webkit-scrollbar {
  width: 20px;
}
.scroll_enabled::-webkit-scrollbar-corner {
  background: rgba(0, 0, 0, 0);
}
.scroll_enabled::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 6px;
  border: 4px solid rgba(0, 0, 0, 0);
  background-clip: content-box;
  min-width: 32px;
  min-height: 32px;
}
.scroll_enabled::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0);
}
</style>
