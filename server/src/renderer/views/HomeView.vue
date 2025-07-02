<script setup lang="ts">
import GameList from "@/components/games/GameList.vue";
</script>

<template>
  <main>
    <div class="dropdown">
      <label tabindex="0" class="btn mb-2 btn-success">Create Game</label>
      <ul
        tabindex="0"
        class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52"
      >
        <li><router-link :to="{ name: 'home' }">Find Game</router-link></li>
        <li><router-link :to="{ name: 'home' }">From Steam</router-link></li>
        <li>
          <router-link :to="{ name: 'createGame' }">Create Game</router-link>
        </li>
      </ul>
    </div>
    <GameList />
  </main>
</template>
``
