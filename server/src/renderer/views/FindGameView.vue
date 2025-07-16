<script setup>
import { ref, watch } from "vue";
import api from "../utls/api";
import AddGameItem from "@/components/games/AddGameItem.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchQuery = ref("");
const games = ref([]);

let debounceTimeout = null;

watch(searchQuery, (newQuery) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    const response = await api.post("/api/games/search", { query: newQuery });
    console.log("Search results:", response.data);
    games.value = response.data.results || [];
  }, 300); // 300ms debounce
});

function handle(game) {
  router.push(`/game/find/add/${game.id}`);
}
</script>

<template>
  <div class="flex justify-center mb-8">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search games..."
      class="input input-bordered w-full max-w-md"
    />
  </div>
  <div class="flex flex-wrap gap-4 justify-center">
    <template v-for="game in games" :key="game.id">
      <AddGameItem
        :gameId="game.id"
        :name="game.name"
        :image="game.image"
        :hasGame="game.hasGame"
        :isProcessing="false"
        @handleAddGame="handle(game)"
      ></AddGameItem>
    </template>
  </div>
</template>
