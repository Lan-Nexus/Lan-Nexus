<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <a class="btn btn-ghost text-xl">LanLauncher Server</a>
  </div>

  <div class="container p-4 mx-auto">
    <RouterView />
  </div>
</template>
