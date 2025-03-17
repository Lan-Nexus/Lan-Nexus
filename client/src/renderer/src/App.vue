<script setup lang="ts">
import Progress from './components/Progress.vue';

import TopNav from './components/TopNav.vue';
</script>

<template>
  <div class="flex flex-col h-full w-full overflow-hidden">
    <TopNav />
    <div class="flex h-full w-full mt-16 sm:mt-20 bg-base-100">
      <router-view />
    </div>
    <Progress />
  </div>
</template>
