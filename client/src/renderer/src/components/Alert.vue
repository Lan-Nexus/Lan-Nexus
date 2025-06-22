<template>
  <div v-if="visible" :class="['alert', daisyType, 'shadow-lg', 'alert-popup']" role="alert">
    <span v-if="icon" class="mr-2">
      <FontAwesomeIcon :icon="faIcon" />
    </span>
    <span v-if="title" class="font-bold" v-html="title"></span>
    <span v-if="description" class="block mt-1" v-html="description"></span>
    <button type="button" class="btn btn-sm btn-ghost absolute right-2 top-2" aria-label="Close" @click="hide">×</button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAlerts } from '../stores/useAlerts.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

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

// Map store icon string to FontAwesome icon array
const faIcon = computed(() => {
  // icon.value should be a FontAwesome icon name like 'check-circle', 'circle-xmark', etc.
  // You can adjust this mapping if you use different icon sets (fas, far, etc.)
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
</style>
