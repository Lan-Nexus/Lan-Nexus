<script setup lang="ts">
import GameForm from "@/components/gameForm/GameForm.vue";
import { useGamesStore, type postGameType } from "@/stores/games";

import { useRoute } from "vue-router";
import { ref, type Ref } from "vue";
import router from "@/router";

const route = useRoute();
const gamesStore = useGamesStore();

const id = ref(route.params.id) as Ref<string>;
const game = gamesStore.getGameById(Number(id.value));

function updateHandler(game: postGameType) {
  gamesStore
    .updateGame(id.value, {
      gameID: game.gameID,
      name: game.name,
      executable: game.executable,
      description: game.description,
      needsKey: game.needsKey,
      icon: game.icon,
      headerImage: game.headerImage,
      logo: game.logo,
      imageCard: game.imageCard,
      heroImage: game.heroImage,
      install: game.install,
      uninstall: game.uninstall,
      play: game.play,
      type: game.type,
      status: game.status,
      keys: [],
    })
    .then(() => {
      router.push({ name: "home" });
    })
    .catch((error) => {
      console.error("Error creating game:", error);
    });
}
</script>

<template>
  <h1 class="text-3xl font-bold mb-4">Edit Game</h1>
  <GameForm @primary="updateHandler" primary="Update" :game="game" />
</template>
