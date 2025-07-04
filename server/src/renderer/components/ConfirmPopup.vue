<script setup lang="ts">
import { defineSlots, defineProps } from "vue";

const showDeleteModal = defineModel();
const emit = defineEmits(["onPrimary", "onSecondary"]);

const props = defineProps<{
  primary?: string;
  secondary?: string;
}>();

defineSlots<{
  title(): undefined;
  message(): undefined;
}>();

const handleDelete = () => {
  showDeleteModal.value = true;
};

const onPrimary = () => {
  showDeleteModal.value = false;
  emit("onPrimary");
};

const onSecondary = () => {
  showDeleteModal.value = false;
  emit("onSecondary");
};
</script>

<template>
  <div class="modal" :class="{ 'modal-open': showDeleteModal }">
    <div class="modal-box">
      <h3 class="font-bold text-lg"><slot name="title">Are you sure?</slot></h3>
      <p class="py-4">
        <slot name="message">Are you sure you want to do this?</slot>
      </p>
      <div class="modal-action">
        <button @click="onSecondary" class="btn">
          {{ props.secondary ?? "Cancel" }}
        </button>
        <button @click="onPrimary" class="btn btn-error">
          {{ props.primary ?? "Continue" }}
        </button>
      </div>
    </div>
  </div>
</template>
