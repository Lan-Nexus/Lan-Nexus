<script lang="ts" setup>
import { ref } from "vue";
import UploadImageForm from "./uploadImageForm.vue";
import CodeEditor from "./CodeEditor.vue";
import FileUpload from "./FileUpload.vue";

const form = ref<HTMLFormElement | null>(null);
const iconImage = ref<string | null>(null);
const headerImage = ref<string | null>(null);
const Logo = ref<string | null>(null);
const imageCard = ref<string | null>(null);
const hero = ref<string | null>(null);

function onCancel() {
  if (form.value) {
    form.value.reset();
    iconImage.value = null;
    headerImage.value = null;
    Logo.value = null;
    imageCard.value = null;
    hero.value = null;
  }
}
</script>

<template>
  <form ref="form" class="w-full">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Game ID</legend>
      <input
        type="text"
        class="input input-bordered w-full"
        placeholder="Type here"
      />
      <p class="label"></p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Name</legend>
      <input
        type="text"
        class="input input-bordered w-full"
        placeholder="Type here"
      />
      <p class="label"></p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Executable</legend>
      <input
        type="text"
        class="input input-bordered w-full"
        placeholder="Type here"
      />
      <p class="label"></p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Description (HTML allowed)</legend>
      <textarea
        class="textarea textarea-bordered w-full"
        placeholder="Type here"
        rows="4"
      ></textarea>
      <p class="label"></p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Needs Game Key?</legend>
      <select class="select select-bordered w-full">
        <option value="">Select...</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
      <p class="label"></p>
    </fieldset>

    <div class="flex flex-row gap-2 mt-4 w-full">
      <UploadImageForm v-model="iconImage" title="Icon File" class="w-full" />
      <UploadImageForm
        v-model="headerImage"
        title="Header Image File"
        class="w-full"
      />
      <UploadImageForm v-model="Logo" title="Logo File" class="w-full" />
      <UploadImageForm
        v-model="imageCard"
        title="Image Card File"
        class="w-full"
      />
      <UploadImageForm v-model="hero" title="Hero Image File" class="w-full" />
    </div>
    <CodeEditor title="Install Script"></CodeEditor>
    <CodeEditor title="Uninstall Script"></CodeEditor>
    <CodeEditor title="Play Script"></CodeEditor>

    <FileUpload class="mt-2"></FileUpload>
    <div class="flex justify-end mt-4">
      <button class="btn btn-primary ml-2">Create</button>
    </div>
  </form>
</template>
