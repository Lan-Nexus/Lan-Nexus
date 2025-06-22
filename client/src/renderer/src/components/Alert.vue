<template>
  <div v-if="visible" :class="['alert', daisyType, 'shadow-lg', 'alert-popup', 'flex', 'items-start', 'pr-10']" role="alert">
    <span v-if="icon" class="mr-2 mt-1">
      <FontAwesomeIcon :icon="faIcon" />
    </span>
    <div class="flex-1 min-w-0">
      <span v-if="title" class="font-bold" v-html="title"></span>
      <span v-if="description" class="block mt-1" v-html="description"></span>
    </div>
    <button type="button" class="btn btn-sm btn-ghost close-btn ml-4 mt-1" aria-label="Close" @click="hide">
      <FontAwesomeIcon icon="fa-solid fa-xmark" />
    </button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAlerts } from '../stores/useAlerts.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

library.add(faXmark)

const alerts = useAlerts()
const { icon, title, description, type, visible } = storeToRefs(alerts)
const hide = alerts.hide

const daisyType = computed(() => {
  switch (type.value) {
    case 'success': return 'alert-success'
    case 'error': return 'alert-error'
    case 'info': return 'alert-info'
    case 'warning': return 'alert-warning'
    default: return ''
  }
})

const faIcon = computed(() => {
  return icon.value ? ['fas', icon.value] : null
})
</script>

<style>
.alert-popup {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 300px;
  max-width: 90vw;
}
.close-btn {
  position: absolute;
  right: 12px;
  top: 12px;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
}
</style>
