<script setup lang="ts">
import { useGamesStore, type getGameType } from "@/stores/games";
import ConfirmPopup from "@/components/ConfirmPopup.vue";
import { ref } from "vue";
import router from "@/router";

const { game } = defineProps<{ game: getGameType }>();

const showDeleteModal = ref(false);

const gamesStore = useGamesStore();

function deleteGame() {
  gamesStore.deleteGame(game.id!);
}

function handleDelete() {
  showDeleteModal.value = true;
}

function handleEdit() {
  router.push({
    name: "editGame",
    params: { id: game.id },
  });
}
</script>

<template>
  <tr>
    <td><img width="32px" :src="game.icon" /></td>
    <td>{{ game.name }}</td>
    <td><img width="100px" :src="game.headerImage" /></td>
    <td class="text-end" style="min-width: 260px">
      <button class="btn m-1 btn-primary">View</button>
      <button @click="handleEdit" class="btn m-1 btn-warning">Edit</button>
      <button @click="handleDelete" class="btn m-1 btn-error">Delete</button>
    </td>
  </tr>

  <ConfirmPopup
    v-model="showDeleteModal"
    primary="Delete"
    secondary="Cancel"
    @primary="deleteGame"
  >
    <template #title>Confirm Delete</template>
    <template #message>
      Are you sure you want to delete "
      <strong>{{ game.name }}</strong
      >"?
      <br />
      This action cannot be undone.
    </template>
    <message> </message>
  </ConfirmPopup>
</template>
