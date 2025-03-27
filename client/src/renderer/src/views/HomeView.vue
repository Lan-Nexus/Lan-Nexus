<script lang="ts" setup>
import { useCounterStore } from '../stores/useCounter.js';

const counterStore = useCounterStore();
</script>

<template>
  <div>
    <h1>Hello Home!</h1>
    <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
    <p>
      <strong>Counter:</strong> {{ counterStore.count }} <strong>Double:</strong>
      {{ counterStore.doubleCount }}
    </p>
    <div class="flex space-x-4">
      <button class="btn" @click="counterStore.increment">Increment</button>
      <button class="btn" @click="counterStore.decrement">Decrement</button>
    </div>
  </div>
</template>
