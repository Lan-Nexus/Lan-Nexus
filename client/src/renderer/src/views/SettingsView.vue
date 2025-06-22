<template>
  <div class="flex flex-col items-center justify-center min-h-screen w-full bg-base-200 ">
    <h1 class="text-3xl font-bold mb-12">Settings</h1>
    <div class="flex flex-col gap-6 w-full max-w-3xl p-6 bg-base-100 rounded-lg shadow-lg">
      <div class="flex flex-col">
        <span class="text-lg mb-2">Server Address:</span>
        <div class="badge badge-primary text-base-100 p-3 mt-2 mb-2">{{ serverAddressStore.serverAddress || 'Loading...' }}</div> 
      </div>
      <div class="flex flex-col">
        <span class="text-lg mb-2">Client IP Address:</span>
        <div class="badge badge-info text-base-100 p-3 mt-2 mb-2">{{ clientIp || 'Loading...' }}</div>
      </div>
      <div class="flex flex-col mb-2">
        <label class="label">
          <span class="label-text">Logger Output:</span>
        </label>
        <pre ref="logContainer" class="bg-base-200 rounded p-3 text-xs overflow-x-auto min-h-92 mt-2 mb-2 w-full" style="max-height: 400px;">
          <template v-if="logHistory.length">
            <div v-for="(entry, idx) in logHistory" :key="idx" class="whitespace-nowrap">
              <span class="font-bold">[{{ new Date(entry.timestamp).toLocaleTimeString() }}]</span>
              <span class="ml-2 font-mono" style="display: inline-block; min-width: 120px;">{{ entry.type }}</span>
              <span class="ml-2">({{ entry.logType }})</span>
              <span class="ml-2" :style="{ color: entry.color.includes('color:') ? entry.color.replace('color: ', '') : undefined }">
                {{ entry.args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ') }}
              </span>
            </div>
          </template>
          <template v-else>
            No logs yet.
          </template>
        </pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useServerAddressStore } from '@renderer/stores/useServerAddress'
import { history } from '@renderer/utils/logger'
import { getIpAddress } from '@renderer/utils/api'
const serverAddressStore = useServerAddressStore()

const clientIp = ref('')
const logHistory = ref([])
const logContainer = ref(null)
let pollInterval = null

onMounted(async () => {
  const ip = await getIpAddress(serverAddressStore.serverAddress)
  clientIp.value = ip || 'Unable to fetch IP address'

  // Poll logger history every 500ms
  pollInterval = setInterval(async () => {
    logHistory.value = [...history]
    await nextTick()
  }, 500)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>
