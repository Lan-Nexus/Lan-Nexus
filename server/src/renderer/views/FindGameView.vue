<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-center mb-8">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search games..."
        class="input input-bordered w-full max-w-md"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="game in games" :key="game.id" class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">{{ game.name }}</h2>
          <p>{{ game.description }}</p>
          <div class="card-actions justify-end">
            <router-link :to="`/game/find/add/${game.id}`" class="btn btn-secondary">add</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import api from '../utls/api'

const searchQuery = ref('');
const games = ref([]);

let debounceTimeout = null;

watch(searchQuery, (newQuery) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
        const response = await api.post('/api/games/search', { query: newQuery });
        console.log('Search results:', response.data);
        games.value = response.data.results || [];
    }, 300); // 300ms debounce
});


</script>

