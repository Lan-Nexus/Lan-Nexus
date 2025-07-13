<script setup lang="ts">
import { useSteamGamesStore } from "@/stores/steamGames";
import SteamItem from "@/components/steam/item.vue";
import { ref } from "vue";

const steamGamesStore = useSteamGamesStore();
steamGamesStore.getSteamGames();
const isProcessing = ref(false);
</script>

<template>
  <h1 class="text-3xl text-center font-bold mb-4">Steam Games</h1>

  <div class="flex flex-wrap gap-4 justify-center">
    <template v-for="game in steamGamesStore.steamGames" :key="game.appid">
      <SteamItem :game="game" />
    </template>
  </div>
</template>
