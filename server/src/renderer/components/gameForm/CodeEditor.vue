<script lang="ts" setup>
const prop = defineProps<{
  title?: string;
}>();
const model = defineModel<string>();
</script>

<template>
  <div class="mt-5">
    <div class="mb-2">
      {{ prop.title || "Code Editor" }}
    </div>
    <textarea v-model="model" class="h-60 w-full bg-base-200 base"></textarea>
  </div>
</template>
