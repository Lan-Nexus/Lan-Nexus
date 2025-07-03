<script setup lang="ts">
import { useGamesStore, type getGameType } from "@/stores/games";
import { ref } from "vue";

const { game } = defineProps<{ game: getGameType }>();

const gamesStore = useGamesStore();
const showDeleteModal = ref(false);

const handleDelete = () => {
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  gamesStore.deleteGame(game.id!);
  showDeleteModal.value = false;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
};
</script>

<template>
  <tr>
    <td><img width="32px" :src="game.icon" /></td>
    <td>{{ game.name }}</td>
    <td><img width="100px" :src="game.headerImage" /></td>
    <td class="text-end" style="min-width: 260px">
      <button class="btn m-1 btn-primary">View</button>
      <button class="btn m-1 btn-warning">Edit</button>
      <button @click="handleDelete" class="btn m-1 btn-error">Delete</button>
    </td>
  </tr>

  <!-- Delete Confirmation Modal -->
  <div class="modal" :class="{ 'modal-open': showDeleteModal }">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Confirm Delete</h3>
      <p class="py-4">
        Are you sure you want to delete "<strong>{{ game.name }}</strong
        >"?
        <br />
        This action cannot be undone.
      </p>
      <div class="modal-action">
        <button @click="cancelDelete" class="btn">Cancel</button>
        <button @click="confirmDelete" class="btn btn-error">Delete</button>
      </div>
    </div>
  </div>
</template>
