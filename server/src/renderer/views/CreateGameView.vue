<script setup lang="ts">
import GameForm from "@/components/gameForm/GameForm.vue";
import router from "@/router";
import { useGamesStore, type postGameType } from "@/stores/games";

function createGame(game: postGameType) {
  useGamesStore()
    .createGame({
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
      install: game.install, // Placeholder for install script
      uninstall: game.uninstall, // Placeholder for uninstall script
      play: game.play,
      type: game.type,
      status: game.status,
      keys: game.keys,
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
  <h1 class="text-3xl font-bold mb-4">Create Game</h1>
  <GameForm @primary="createGame" primary="Create" />
</template>
