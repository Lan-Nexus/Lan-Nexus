<script lang="ts" setup>
import FileUpload from "./FileUpload.vue";
import { watch, ref } from "vue";

const props = defineProps<{
  title: string;
}>();

const model = defineModel<File | null>();
const imageUrl = ref<string | null>(null);

watch(model, (newFile) => {
  if (!newFile) {
    imageUrl.value = null;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    debugger;
    imageUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(newFile!);
});
</script>

<template>
  <div class="flex flex-col space-y-4">
    <div class="text-center">{{ props.title }}</div>
    <div>
      <template v-if="imageUrl">
        <div
          class="h-32 bg-base-200 border-2 border-dashed border-base-300 rounded-lg overflow-hidden"
        >
          <img
            class="h-full rounded-lg mx-auto"
            :src="imageUrl"
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
