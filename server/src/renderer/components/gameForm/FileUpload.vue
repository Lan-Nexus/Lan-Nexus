<script lang="ts" setup>
import { ref } from "vue";

const quotes = [
  "I like it rough, drop me hard",
  "I like it when you drop me like it's hot, daddy",
  "slam me with your files",
  "give it to me hard and fast",
  "stuff me full of your data",
  "make me beg for your upload",
  "wreck me with that file drop",
  "pound me with your biggest file",
  "make this transfer filthy",
  "I'm desperate for your payload",
  "ruin me with your upload",
  "drag it in, don't be gentle",
  "overwhelm me with your files",
  "make this upload unforgettable",
  "hit me with your best file",
  "don't hold back, upload everything",
  "show me what you've got",
  "let's make this transfer wild",
];

const model = defineModel<File | null>();

const props = withDefaults(
  defineProps<{
    accept?: string;
    name?: string;
  }>(),
  {
    accept:
      "zip,application/zip,application/x-zip,application/x-zip-compressed",
    showEdit: true,
    showView: true,
  }
);
function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    model.value = input.files[0];
  }
}

const isDragover = ref(false);

function onDragover(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "copy";
  }
}

function onDrop(event: DragEvent) {
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    model.value = file;
    isDragover.value = false;
  }
}
</script>

<template>
  <div class="form-control">
    <label
      tabindex="0"
      :class="{
        'bg-base-200': !isDragover,
        'bg-base-300': isDragover,
      }"
      class="flex flex-col items-center justify-center w-full h-32 border-2 border-base-300 rounded-lg cursor-pointer hover:bg-base-300 transition-colors"
      @dragover="onDragover"
      @drop.prevent="onDrop"
      @dragenter="isDragover = true"
      @dragleave="isDragover = false"
    >
      <template v-if="isDragover">
        <span class="text-base-content p-2 text-center pointer-events-none">
          {{ quotes[Math.floor(Math.random() * quotes.length)] }}
        </span>
      </template>
      <template v-else-if="model">
        <span class="text-base-content p-2 text-center pointer-events-none">
          {{
            model.name.length > 20
              ? model.name.slice(0, 20) + "..."
              : model.name
          }}
        </span>
      </template>
      <template v-else-if="name">
        <span class="text-base-content p-2 text-center pointer-events-none">
          {{ name.length > 20 ? name.slice(0, 20) + "..." : name }}
        </span>
      </template>
      <template v-else>
        <span class="text-base-content p-2 text-center pointer-events-none">
          Drag and drop a file here or click to select
        </span>
      </template>

      <input
        ref="fileInput"
        type="file"
        :accept="props.accept"
        class="hidden"
        @change="onFileChange"
        multiple="false"
      />
    </label>
  </div>
</template>
