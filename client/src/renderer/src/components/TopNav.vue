<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCog, faArrowsRotate, faHome, faGamepad } from '@fortawesome/free-solid-svg-icons';

import { useGameStore } from '../stores/useGameStore.js';

const gameStore = useGameStore();
</script>
<template>
  <div
    class="flex justify-between items-center bg-base-content shadow-lg absolute w-full pe-4 gap-4"
  >
    <h1 class="text-4xl font-bold text-center p-4 text-primary-content">Lan-Launch</h1>
    <div class="flex-grow"></div>
    <button
      class="btn"
      :class="{ 'btn-primary': $route.fullPath === '/' }"
      hidden
      @click="$router.push('/')"
    >
      <font-awesome-icon :icon="faHome" class="text-2xl" />
    </button>

    <button
      class="btn"
      hidden
      :class="{ 'btn-primary': $route.fullPath === '/games' }"
      @click="$router.push('/games')"
    >
      <FontAwesomeIcon :icon="faGamepad" class="text-2xl" />
    </button>

    <button
      class="btn"
      hidden
      :class="{ 'btn-primary': $route.fullPath === '/settings' }"
      @click="$router.push('/settings')"
    >
      <FontAwesomeIcon :icon="faCog" class="text-2xl" />
    </button>
    <div class="flex-grow"></div>

    <button class="btn btn-ghost text-neutral-content">
      <font-awesome-icon :icon="faArrowsRotate" class="text-2xl" @click="gameStore.reload" />
    </button>
  </div>
</template>
