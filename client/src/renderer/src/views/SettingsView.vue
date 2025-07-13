<template>
    <div class="flex flex-col gap-6 p-6 mb-30 w-full bg-base-100 rounded-lg shadow-lg overflow-scroll">
      <!-- App Version & Updates Section -->
      <div class="flex flex-col">
        <span class="text-lg mb-2">App Version:</span>
        <div class="badge badge-secondary text-base-100 p-3 mt-2 mb-2">{{ appVersion || 'Loading...' }}</div>
        
        <div class="flex flex-col mt-4">
          <span class="text-lg mb-2">Update Status:</span>
          <div class="flex items-center gap-3 mb-3">
            <div class="badge p-3" :class="updateStatusBadgeClass">{{ updateStatus }}</div>
            <button 
              v-if="!isCheckingForUpdates" 
              @click="checkForUpdates" 
              class="btn btn-sm btn-outline"
              :disabled="isCheckingForUpdates"
            >
              Check for Updates
            </button>
            <button 
              v-if="updateDownloaded" 
              @click="installUpdate" 
              class="btn btn-sm btn-success"
            >
              Restart & Install
            </button>
          </div>
          
          <!-- Download Progress -->
          <div v-if="downloadProgress > 0 && downloadProgress < 100" class="w-full">
            <div class="flex justify-between text-sm mb-1">
              <span>Downloading update...</span>
              <span>{{ downloadProgress }}%</span>
            </div>
            <progress class="progress progress-primary w-full" :value="downloadProgress" max="100"></progress>
          </div>
        </div>
      </div>

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
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useServerAddressStore } from '@renderer/stores/useServerAddress'
import { history } from '@renderer/utils/logger'
import { getIpAddress } from '@renderer/utils/api'

const serverAddressStore = useServerAddressStore()

const clientIp = ref('')
const logHistory = ref([])
const logContainer = ref(null)
let pollInterval = null

// Auto-updater state
const appVersion = ref('')
const isCheckingForUpdates = ref(false)
const updateAvailable = ref(false)
const updateDownloaded = ref(false)
const downloadProgress = ref(0)
const updateInfo = ref(null)
const lastUpdateCheck = ref(null)

// Computed property for update status
const updateStatus = computed(() => {
  if (isCheckingForUpdates.value) return 'Checking for updates...'
  if (updateDownloaded.value) return 'Update ready to install'
  if (updateAvailable.value) return 'Update available'
  if (downloadProgress.value > 0 && downloadProgress.value < 100) return 'Downloading update...'
  return 'Up to date'
})

// Computed property for badge styling
const updateStatusBadgeClass = computed(() => {
  if (isCheckingForUpdates.value) return 'badge-warning'
  if (updateDownloaded.value) return 'badge-success'
  if (updateAvailable.value) return 'badge-info'
  if (downloadProgress.value > 0 && downloadProgress.value < 100) return 'badge-warning'
  return 'badge-success'
})

// Auto-updater functions
async function checkForUpdates() {
  if (!window.updaterAPI) {
    console.warn('Updater API not available')
    return
  }

  isCheckingForUpdates.value = true
  try {
    await window.updaterAPI.checkForUpdates()
    lastUpdateCheck.value = new Date()
  } catch (error) {
    console.error('Failed to check for updates:', error)
  } finally {
    // Reset checking state after a delay to show feedback
    setTimeout(() => {
      isCheckingForUpdates.value = false
    }, 2000)
  }
}

function installUpdate() {
  if (window.updaterAPI) {
    window.updaterAPI.quitAndInstall()
  }
}

onMounted(async () => {
  const ip = await getIpAddress(serverAddressStore.serverAddress)
  clientIp.value = ip || 'Unable to fetch IP address'

  // Get app version
  if (window.updaterAPI) {
    try {
      appVersion.value = await window.updaterAPI.getVersion()
    } catch (error) {
      console.error('Failed to get app version:', error)
      appVersion.value = 'Unknown'
    }

    // Setup auto-updater event listeners
    window.updaterAPI.onUpdateAvailable((info) => {
      updateAvailable.value = true
      updateInfo.value = info
      isCheckingForUpdates.value = false
      console.log('Update available:', info)
    })

    window.updaterAPI.onUpdateNotAvailable(() => {
      updateAvailable.value = false
      isCheckingForUpdates.value = false
      console.log('No updates available')
    })

    window.updaterAPI.onUpdateDownloaded((info) => {
      updateDownloaded.value = true
      downloadProgress.value = 100
      console.log('Update downloaded:', info)
    })

    window.updaterAPI.onDownloadProgress((progress) => {
      downloadProgress.value = Math.round(progress.percent)
      console.log('Download progress:', progress.percent + '%')
    })

    window.updaterAPI.onError((error) => {
      isCheckingForUpdates.value = false
      console.error('Update error:', error)
    })
  } else {
    appVersion.value = 'Development'
  }

  // Poll logger history every 500ms
  pollInterval = setInterval(async () => {
    logHistory.value = [...history].length > 100 ? history.slice(-100) : history
    await nextTick()
  }, 500)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>
