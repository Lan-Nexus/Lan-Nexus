<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: 'Loading...'
    }
})
</script>

<template>
   <div class="flex h-full w-full">
      <div class="m-auto flex flex-col items-center justify-center">
        <img src="../assets/logo.svg" alt="Lan Exus Logo" class="h-32 pb-4" />
        <div class="loading loading-spinner text-primary loading-xl"></div>
        <div class="h-2"></div>
        <div><p class="text-2xl">{{ props.title }}</p></div>
      </div>
    </div>
</template>