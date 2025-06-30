<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCog, faArrowsRotate, faHome, faGamepad } from '@fortawesome/free-solid-svg-icons';

import { useGameStore } from '../stores/useGameStore.js';
import { useAvatarStore } from '@renderer/stores/useAvatarStore.js';

const avatarStore = useAvatarStore();
const gameStore = useGameStore();
</script>
<template>
  <div
    class="flex justify-between items-center bg-base-content shadow-lg absolute w-full pe-4 gap-4"
  >
    <h1 class="text-4xl font-bold text-center p-4 text-primary-content">LanLauncher</h1>
    <div class="flex-grow"></div>
    <!-- <button
      class="btn"
      :class="{ 'btn-primary': $route.fullPath === '/' }"
      @click="$router.push('/')"
    >
      <font-awesome-icon :icon="faHome" class="text-2xl" />
    </button> -->

    <button
      class="btn"
      :class="{ 'btn-primary': $route.fullPath === '/' }"
      @click="$router.push('/')"
    >
      <FontAwesomeIcon :icon="faGamepad" class="text-2xl" />
    </button>

    <button
      class="btn"
      :class="{ 'btn-primary': $route.fullPath === '/settings' }"
      @click="$router.push('/settings')"
    >
      <FontAwesomeIcon :icon="faCog" class="text-2xl" />
    </button>
    <div class="flex-grow"></div>

    <button class="btn btn-ghost text-neutral-content">
      <font-awesome-icon :icon="faArrowsRotate" class="text-2xl" @click="gameStore.reload" />
    </button>
    <div>
      <button
        class="btn btn-ghost text-neutral-content"
        @click="$router.push('/avatar')"
      >
        <img
          v-if="avatarStore.get()"
          :src="avatarStore.get() ?? undefined"
          alt="Avatar"
          class="w-10 h-10"
        />
      </button> 
    </div>
  </div>
</template>
