<script lang="ts" setup>
import { ref } from "vue";
import UploadImageForm from "./UploadImageForm.vue";
import CodeEditor from "./CodeEditor.vue";
import FileUpload from "./FileUpload.vue";
import { useGamesStore } from "@/stores/games";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref<HTMLFormElement | undefined>();
const iconImage = ref<File | undefined>();
const headerImage = ref<File | undefined>();
const Logo = ref<File | undefined>();
const imageCard = ref<File | undefined>();
const hero = ref<File | undefined>();

function createGame() {
  if (!form.value) return;
  const formData = new FormData(form.value);

  const needKeys = formData.get("needsKey") as string | undefined;

  useGamesStore()
    .createGame({
      gameID: (formData.get("gameId") as string | undefined) ?? "",
      name: (formData.get("name") as string | undefined) ?? "",
      executable: (formData.get("executable") as string | undefined) ?? "",
      description: (formData.get("description") as string | undefined) ?? "",
      needsKey: needKeys ?? "0",
      icon: iconImage.value,
      headerImage: headerImage.value,
      logo: Logo.value,
      imageCard: imageCard.value,
      heroImage: hero.value,
      install: "", // Placeholder for install script
      uninstall: "", // Placeholder for uninstall script
      play: "",
      type: "",
      status: "Draft",
      keys: [],
    })
    .then(() => {
      router.push({ name: "home" });
    })
    .catch((error) => {
      console.error("Error creating game:", error);
    });
}
</script>

<template>
  <form ref="form" class="w-full" @submit.prevent="createGame">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Game ID</legend>
      <input
        type="text"
        name="gameId"
        class="input input-bordered w-full"
        placeholder="Type here"
      />
      <p class="label"></p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Name</legend>
      <input
        type="text"
        name="name"
        class="input input-bordered w-full"
        placeholder="Type here"
      />
      <p class="label"></p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Executable</legend>
      <input
        type="text"
        name="executable"
        class="input input-bordered w-full"
        placeholder="Type here"
      />
      <p class="label"></p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Description (HTML allowed)</legend>
      <textarea
        name="description"
        class="textarea textarea-bordered w-full"
        placeholder="Type here"
        rows="4"
      ></textarea>
      <p class="label"></p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Needs Game Key?</legend>
      <select class="select select-bordered w-full" name="needsKey">
        <option value="">Select...</option>
        <option value="1">Yes</option>
        <option value="0">No</option>
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
