<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <nav class="navbar bg-base-200">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl">Lan Launcher</a>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><RouterLink to="/about">About</RouterLink></li>
        </ul>
      </div>
    </nav>
    <main class="container mx-auto flex-1 p-6 bg-base-100">
      <RouterView />
    </main>
  </div>
</template>
