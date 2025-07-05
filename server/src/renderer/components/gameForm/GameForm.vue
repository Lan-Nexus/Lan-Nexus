<script lang="ts" setup>
import { ref } from "vue";
import UploadImageForm from "./UploadImageForm.vue";
import CodeEditor from "./CodeEditor.vue";
import FileUpload from "./FileUpload.vue";
import { type getGameType, type postGameType } from "@/stores/games";

const props = defineProps<{
  game?: getGameType;
  primary: string;
}>();

const emit = defineEmits<{
  primary: [game: postGameType];
}>();

function onPressHandle() {
  emit("primary", {
    gameID: gameID.value,
    name: name.value,
    executable: executable.value,
    description: description.value,
    needsKey: needsKey.value,
    icon: iconImage.value,
    headerImage: headerImage.value,
    logo: Logo.value,
    imageCard: imageCard.value,
    heroImage: hero.value,
    install: install.value,
    uninstall: uninstall.value,
    play: play.value,
    type: type.value,
    status: status.value,
    archives: fileUpload.value,
    keys: [],
  });
}

const gameID = ref<string>(props.game?.gameID || "");
const name = ref<string>(props.game?.name || "");
const executable = ref<string>(props.game?.executable || "");
const description = ref<string>(props.game?.description || "");
const needsKey = ref<string>(props.game?.needsKey || "0");
const iconImage = ref<File | undefined>();
const headerImage = ref<File | undefined>();
const Logo = ref<File | undefined>();
const imageCard = ref<File | undefined>();
const hero = ref<File | undefined>();
const fileUpload = ref<File | undefined>();
const install = ref<string>(props.game?.install || "");
const uninstall = ref<string>(props.game?.uninstall || "");
const play = ref<string>(props.game?.play || "await run(GAME_EXECUTABLE);");
const type = ref<string>(props.game?.type || "archive");
const status = ref<string>(props.game?.status || "Draft");

const iconPath = ref<string>(props.game?.icon || "");
const headerPath = ref<string>(props.game?.headerImage || "");
const logoPath = ref<string>(props.game?.logo || "");
const imageCardPath = ref<string>(props.game?.imageCard || "");
const heroPath = ref<string>(props.game?.heroImage || "");
const archivePath = ref<string>(
  props.game?.archives ? props.game.archives.split(/[\\/]/).pop() || "" : ""
);
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">Game ID</legend>
    <input type="text" v-model="gameID" class="input input-bordered w-full" />
    <p class="label"></p>
  </fieldset>

  <fieldset class="fieldset">
    <legend class="fieldset-legend">Name</legend>
    <input type="text" v-model="name" class="input input-bordered w-full" />
    <p class="label"></p>
  </fieldset>

  <fieldset class="fieldset">
    <legend class="fieldset-legend">Executable</legend>
    <input
      type="text"
      v-model="executable"
      class="input input-bordered w-full"
      placeholder="e.g. game.exe"
    />
    <p class="label"></p>
  </fieldset>

  <fieldset class="fieldset">
    <legend class="fieldset-legend">Description (HTML allowed)</legend>
    <textarea
      v-model="description"
      class="textarea textarea-bordered w-full"
      rows="4"
    ></textarea>
    <p class="label"></p>
  </fieldset>
  <template v-if="type != 'steam'">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Needs Game Key?</legend>
      <select class="select select-bordered w-full" v-model="needsKey">
        <option value="1">Yes</option>
        <option selected value="0">No</option>
      </select>
      <p class="label"></p>
    </fieldset>
  </template>

  <div class="flex flex-row gap-2 mt-4 w-full">
    <UploadImageForm
      :path="iconPath"
      v-model="iconImage"
      title="Icon File"
      class="w-full"
    />
    <UploadImageForm
      v-model="headerImage"
      :path="headerPath"
      title="Header Image File"
      class="w-full"
    />
    <UploadImageForm
      :path="logoPath"
      v-model="Logo"
      title="Logo File"
      class="w-full"
    />
    <UploadImageForm
      :path="imageCardPath"
      v-model="imageCard"
      title="Image Card File"
      class="w-full"
    />
    <UploadImageForm
      :path="heroPath"
      v-model="hero"
      title="Hero Image File"
      class="w-full"
    />
  </div>
  <template v-if="type != 'steam'">
    <CodeEditor v-model="install" title="Install Script"></CodeEditor>
    <CodeEditor v-model="uninstall" title="Uninstall Script"></CodeEditor>
    <CodeEditor v-model="play" title="Play Script"></CodeEditor>
    <FileUpload
      v-model="fileUpload"
      :name="archivePath"
      class="mt-10"
    ></FileUpload>
  </template>

  <div class="flex justify-end mt-4">
    <button @click="onPressHandle" class="btn btn-primary ml-2">
      {{ props.primary }}
    </button>
  </div>
</template>
