<script lang="ts" setup>
import FileUpload from "./FileUpload.vue";
import { watch, ref } from "vue";

const props = defineProps<{
  title: string;
  path: string;
}>();

const model = defineModel<File | null>();
const imageUrl = ref<string | null>(null);
const processing = ref<boolean>(false);

watch(model, (newFile) => {
  if (!newFile) {
    imageUrl.value = null;
  }
  const reader = new FileReader();
  processing.value = true;
  reader.onload = (e) => {
    imageUrl.value = e.target?.result as string;
    processing.value = false;
  };
  reader.readAsDataURL(newFile!);
});
</script>

<template>
  <div class="flex flex-col space-y-4">
    <div class="text-center">{{ props.title }}</div>
    <div>
      <template v-if="processing">
        <div
          class="h-32 bg-base-200 border-2 border-dashed border-base-300 rounded-lg overflow-hidden flex items-center justify-center"
        >
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      </template>
      <template v-else-if="imageUrl || props.path">
        <div
          class="h-32 bg-base-200 border-2 border-dashed border-base-300 rounded-lg overflow-hidden"
        >
          <img
            class="h-full rounded-lg mx-auto"
            :src="imageUrl ?? props.path"
            alt="Game Image"
          />
        </div>
      </template>
      <template v-else>
        <div
          class="h-32 text-center border-2 border-dashed border-base-300 rounded-lg flex items-center justify-center bg-base-200"
        >
          No image
        </div>
      </template>
      <FileUpload v-model="model" class="mt-2"></FileUpload>
    </div>
  </div>
</template>
