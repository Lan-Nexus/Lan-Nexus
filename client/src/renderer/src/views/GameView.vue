<script lang="ts" setup>
import SideNav from '../components/SideNav.vue';

import { useGameStore } from '../stores/useGameStore';
import GameDetailsPanel from '@renderer/components/GameDetailsPanel.vue';

const gameStore = useGameStore();
gameStore.loadGames();
</script>

<template>
  <div class="flex flex-col h-full w-full flex flex-row">
    <SideNav />
    <template v-if="gameStore.selectedGame">
      <GameDetailsPanel
        v-model="gameStore.selectedGame"
        class="flex flex-col flex-1"
        style="height: 88vh; overflow: overlay"
      ></GameDetailsPanel>
    </template>
  </div>
</template>
