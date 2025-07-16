<script setup lang="ts">
const props = defineProps<{
  gameId: number;
  name: string;
  image?: string;
  hasGame?: boolean;
  isProcessing?: boolean;
}>();

const emit = defineEmits<{
  (e: "handleAddGame"): void;
}>();
</script>

<template>
  <div class="card bg-base-200 w-65 shadow-sm relative justify-center">
    <template v-if="props.image">
      <figure>
        <div class="bg-base-300 h-30 w-full">
          <img
            loading="lazy"
            height="120px"
            :src="props.image"
            alt="Game Header"
            @error="(event) => { if (event && event.target) { (event.target as HTMLElement).style.display = 'none'; } }"
          />
        </div>
      </figure>
    </template>
    <div class="card-body justify-around">
      <div class="justify-center">
        <h3 class="card-title justify-center pb-14 text-center">
          {{ props.name }}
        </h3>
      </div>
      <div class="absolute left-1/2 bottom-4 transform -translate-x-1/2">
        <template v-if="isProcessing">
          <button disabled class="btn btn-primary loading"></button>
        </template>
        <template v-else-if="props.hasGame">
          <button disabled class="btn btn-primary">Added</button>
        </template>
        <template v-else>
          <button @click="emit('handleAddGame')" class="btn btn-primary">
            Add Game
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
