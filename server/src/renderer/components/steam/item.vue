<script setup lang="ts">
import { useSteamGamesStore, type SteamGameType } from "@/stores/steamGames";
import { useNotificationStore } from "@/stores/notification";
import { ref } from "vue";

const steamGamesStore = useSteamGamesStore();

const isProcessing = ref(false);

const props = defineProps<{
  game: SteamGameType;
}>();

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
  <div class="card bg-base-200 w-65 shadow-sm">
    <figure>
      <div class="bg-base-300 h-30 w-full">
        <img
          loading="lazy"
          height="120px"
          :src="
            'https://cdn.cloudflare.steamstatic.com/steam/apps/' +
            game.appid +
            '/header.jpg'
          "
          alt="Game Header"
          @error="(event) => { if (event && event.target) { (event.target as HTMLElement).style.display = 'none'; } }"
        />
      </div>
    </figure>
    <div class="card-body justify-around relative">
      <div class="justify-center">
        <h3 class="card-title justify-center pb-14 text-center">
          {{ props.game.name }}
        </h3>
      </div>
      <div class="absolute left-1/2 bottom-4 transform -translate-x-1/2">
        <template v-if="isProcessing">
          <button disabled class="btn btn-primary loading"></button>
        </template>
        <template v-else-if="steamGamesStore.hasGame(game.appid.toString())">
          <button disabled class="btn btn-primary">Added</button>
        </template>
        <template v-else>
          <button @click="handleAddGame(game)" class="btn btn-primary">
            Add Game
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
