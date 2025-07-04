<script setup lang="ts">
import { useGamesStore } from "@/stores/games";
import ActionButtons from "@/components/games/ActionButtons.vue";

import GameKeys from "@/components/games/GameKeys.vue";

import { useRoute } from "vue-router";
import { ref, type Ref, onMounted, watch } from "vue";
import api from "@/utls/api";

const route = useRoute();
const gamesStore = useGamesStore();

const id = ref(route.params.id) as Ref<string>;
let game = gamesStore.getGameById(Number(id.value));

const keys = ref([]);

</script>

<template>
  <template v-if="!game">
    <h1 class="text-3xl font-bold mb-4 text-center">
      These are not the games you're looking for.
    </h1>
  </template>
  <template v-else>
    <h1 class="text-3xl font-bold mb-4 text-center">Game Details</h1>

    <div class="flex justify-between mb-6">
      <div class="text-2xl font-bold">
        <img width="32px" :src="game.icon" class="inline-block mr-2" />
        {{ game.name.toUpperCase() }}
      </div>
      <div class="text-primary">
        <ActionButtons :showView="false" :game="game"></ActionButtons>
      </div>
    </div>
    
    <div class="mb-4">
      <GameKeys v-if="game.needsKey" :gameId="Number(game.id)"></GameKeys>
    </div>

    <div class="mb-4">
      <h2 class="text-l font-semibold mb-2">Description:</h2>
      <p class="bg-base-200 p-2" v-html="game.description"></p>
    </div>

    
  </template>
</template>
