<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <nav class="navbar bg-base-200">
      <div class="flex-1">
        <RouterLink to="/" class="btn btn-ghost text-xl">Lan Launcher</RouterLink>
      </div>
    </nav>
    <main class="container mx-auto flex-1 p-6 bg-base-100">
      <RouterView />
    </main>
  </div>
</template>
