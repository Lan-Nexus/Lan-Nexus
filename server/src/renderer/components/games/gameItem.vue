<script setup lang="ts">
import type { GameType } from "@/stores/games";

const { game } = defineProps<{ game: GameType }>();
</script>

<template>
  <tr>
    <td><img width="32px" :src="game.icon" /></td>
    <td>{{ game.name }}</td>
    <td><img width="100px" :src="game.headerImage" /></td>
    <td class="text-end">
      <button class="btn m-1 btn-primary">View</button>
      <button class="btn m-1 btn-warning">Edit</button>
      <button class="btn m-1 btn-error">Delete</button>
    </td>
  </tr>
</template>
