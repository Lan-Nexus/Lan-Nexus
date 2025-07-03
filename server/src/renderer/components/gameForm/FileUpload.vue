<script lang="ts" setup>
const model = defineModel<File | null>();
function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    model.value = input.files[0];
  }
}

function onDrop(event: DragEvent) {
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    model.value = file;
  }
}
</script>

<template>
  <div class="form-control">
    <label
      tabindex="0"
      class="flex flex-col items-center justify-center w-full h-32 border-2 border-base-300 rounded-lg cursor-pointer bg-base-200 hover:bg-base-300 transition-colors"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <template v-if="model">
        <span class="text-base-content p-2 text-center">
          {{
            model.name.length > 20
              ? model.name.slice(0, 20) + "..."
              : model.name
          }}
        </span>
      </template>
      <template v-else>
        <span class="text-base-content p-2 text-center">
          Drag and drop a file here or click to select
        </span>
      </template>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileChange"
        multiple="false"
      />
    </label>
  </div>
</template>
