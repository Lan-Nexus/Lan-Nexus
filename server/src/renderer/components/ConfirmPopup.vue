<script setup lang="ts">
import { defineSlots, defineProps } from "vue";

const showDeleteModal = defineModel();

const emit = defineEmits<{
  primary: [];
  secondary: [];
}>();

const props = defineProps<{
  primary?: string;
  secondary?: string;
}>();

defineSlots<{
  title(): undefined;
  message(): undefined;
}>();

const onPrimary = () => {
  showDeleteModal.value = false;
  emit("primary");
};

const onSecondary = () => {
  showDeleteModal.value = false;
  emit("secondary");
};
</script>

<template>
  <div class="modal" :class="{ 'modal-open': showDeleteModal }">
    <div class="modal-box">
      <h3 class="font-bold text-lg text-center">
        <slot name="title">Are you sure?</slot>
      </h3>
      <p class="py-4 text-center">
        <slot class="" name="message">Are you sure you want to do this? </slot>
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
