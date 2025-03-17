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
