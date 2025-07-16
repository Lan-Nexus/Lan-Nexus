<script setup lang="ts">
import { useSteamGamesStore } from "@/stores/steamGames";
import { ref } from "vue";
import { useNotificationStore } from "@/stores/notification";
import AddGameItem from "@/components/games/AddGameItem.vue";

const steamGamesStore = useSteamGamesStore();
steamGamesStore.getSteamGames();
const isProcessing = ref(false);

async function handleAddGame(game: any) {
  try {
    isProcessing.value = true;
    await steamGamesStore.addGame(game);
  } catch (error) {
    const notificationStore = useNotificationStore();
    notificationStore.addNotification(
      "error",
      "Failed to add game. Please try again later"
    );
  } finally {
    isProcessing.value = false;
  }
}
</script>

<template>
  <h1 class="text-3xl text-center font-bold mb-4">Steam Games</h1>

  <div class="flex flex-wrap gap-4 justify-center">
    <template v-for="game in steamGamesStore.steamGames" :key="game.appid">
      <AddGameItem
        :gameId="game.appid"
        :name="game.name"
        :image="`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`"
        :hasGame="steamGamesStore.hasGame(game.appid.toString())"
        :isProcessing="isProcessing"
        @handleAddGame="handleAddGame(game)"
      />
    </template>
  </div>
</template>
