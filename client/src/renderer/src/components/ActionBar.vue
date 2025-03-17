<script lang="ts" setup>
import { useGameStore } from '../stores/useGameStore.js';

const gameStore = useGameStore();
</script>

<template>
  <div class="flex flex-row gap-4 border-2 border-base-200 p-4 justify-between items-center">
    <select
      v-model="gameStore.selectedGame.selectedArchive"
      class="select select-bordered w-64"
      v-if="gameStore.selectedGame.type === 'zip'"
    >
      <option disabled value="">Select an archive</option>
      <option
        v-for="archive in gameStore.selectedGame.archives"
        :key="archive.id"
        :value="archive.id"
      >
        {{ archive.name }} => {{ archive.version }} ({{ archive.os }})
      </option>
    </select>
    <div v-if="gameStore.selectedGame.type !== 'zip'"></div>
    <button
      v-if="gameStore.selectedGame.type !== 'zip'"
      class="btn btn-warning"
      @click="gameStore.play"
    >
      Launch in {{ gameStore.selectedGame.type }}
    </button>

    <div v-if="gameStore.selectedGame.type === 'zip'" class="flex gap-2">
      <button
        v-if="gameStore.selectedArchive.isInstalled"
        class="btn btn-error w-24"
        @click="gameStore.uninstallArchive"
      >
        Uninstall
      </button>
      <button v-else class="btn btn-primary w-24" @click="gameStore.installArchive">Install</button>
      <button
        class="btn btn-warning"
        :disabled="!gameStore.selectedArchive.isInstalled"
        @click="gameStore.play"
      >
        Play
      </button>
    </div>
  </div>
</template>
