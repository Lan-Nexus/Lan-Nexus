<script setup lang="ts">
import { useGamesStore, type getGameType } from "@/stores/games";
import ConfirmPopup from "@/components/ConfirmPopup.vue";
import { ref } from "vue";
import router from "@/router";
import ActionButtons from "./ActionButtons.vue";

const { game } = defineProps<{ game: getGameType }>();

const gamesStore = useGamesStore();
</script>

<template>
  <tr>
    <td><img width="32px" :src="game.icon" /></td>
    <td>{{ game.name }}</td>
    <td><img width="100px" :src="game.headerImage" /></td>
    <td class="text-end" style="min-width: 260px">
      <ActionButtons :game="game"></ActionButtons>
    </td>
  </tr>
</template>
