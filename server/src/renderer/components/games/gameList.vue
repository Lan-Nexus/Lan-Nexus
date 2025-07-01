<script lang="ts" setup>
import GameItem from "@/components/games/gameItem.vue";
import { useGamesStore } from "@/stores/games";
const gamesStore = useGamesStore();
gamesStore.getGames();
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Icon</th>
          <th>Name</th>
          <th>Header Image</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="game in gamesStore.games" :key="game.id">
          <GameItem :game="game" />
        </template>
      </tbody>
    </table>
  </div>
</template>
