<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";

const prop = defineProps<{
  title?: string;
}>();
const model = defineModel<string>();
const editor = ref();
let view: EditorView | null = null;

onMounted(() => {
  if (view) return;
  view = new EditorView({
    parent: editor.value,
    doc: model.value,
    extensions: [
      basicSetup,
      javascript(),
      dracula,
      EditorView.updateListener.of((v) => {
        if (!v.docChanged) return;
        model.value = v.state.doc.toString();
      }),
    ],
  });
});

watch(
  () => model.value,
  (val) => {
    if (!view || view.state.doc.toString() === val) return;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: val || "" },
    });
  }
);
</script>

<template>
  <div class="mt-5">
    <div class="mb-2">
      {{ prop.title || "Code Editor" }}
    </div>
    <div ref="editor" class="h-60 w-full bg-base-200 base rounded"></div>
  </div>
</template>
