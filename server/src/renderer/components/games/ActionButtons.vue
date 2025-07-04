<script setup lang="ts">
import router from "@/router";
import type { getGameType } from "@/stores/games";
import { useGamesStore } from "@/stores/games";
import { ref } from "vue";
import ConfirmPopup from "@/components/ConfirmPopup.vue";

const gameStore = useGamesStore();
const showDeleteModal = ref(false);

const props = withDefaults(
  defineProps<{
    game: getGameType;
    showDelete?: boolean;
    showEdit?: boolean;
    showView?: boolean;
  }>(),
  {
    showDelete: true,
    showEdit: true,
    showView: true,
  }
);

function handleView() {
  router.push({
    name: "viewGame",
    params: { id: props.game.id },
  });
}

function handleEdit() {
  router.push({
    name: "editGame",
    params: { id: props.game.id },
  });
}

function handleDelete() {
  showDeleteModal.value = true;
}

function deleteGame() {
  gameStore.deleteGame(props.game.id!);
}
</script>

<template>
  <template v-if="props.showView">
    <button @click="handleView" class="btn m-1 btn-primary">View</button>
  </template>
  <template v-if="props.showEdit">
    <button @click="handleEdit" class="btn m-1 btn-warning">Edit</button>
  </template>
  <template v-if="props.showDelete">
    <button @click="handleDelete" class="btn m-1 btn-error">Delete</button>
  </template>

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
  </ConfirmPopup>
</template>
