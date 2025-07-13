<script setup lang="ts">
import Progress from './components/Progress.vue';
import TopNav from './components/TopNav.vue';
import { useServerAddressStore } from './stores/useServerAddress.js';
import Loading from './components/Loading.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import Alert from './components/Alert.vue';
import { useProgressStore } from './stores/useProgress';
import { useRunningStore } from './stores/useRunning';
import { useGameStore } from './stores/useGameStore';

const store = useProgressStore();
store.listenForIpcEvents();

const serverAddressStore = useServerAddressStore();
serverAddressStore.getServerAddress();

const runningStore = useRunningStore();
runningStore.init();

const gameStore = useGameStore();
gameStore.autoRefreshGames();

// Auto-updater state
const updateAvailable = ref(false);
const updateDownloaded = ref(false);
const downloadProgress = ref(0);
const updateInfo = ref(null);

// Setup auto-updater listeners
onMounted(() => {
  document.addEventListener("keyup", keyHandler);
  
  // Auto-updater event listeners
  if (window.updaterAPI) {
    window.updaterAPI.onUpdateAvailable((info) => {
      updateAvailable.value = true;
      updateInfo.value = info;
      console.log('Update available:', info);
    });

    window.updaterAPI.onUpdateDownloaded((info) => {
      updateDownloaded.value = true;
      console.log('Update downloaded:', info);
    });

    window.updaterAPI.onDownloadProgress((progress) => {
      downloadProgress.value = Math.round(progress.percent);
      console.log('Download progress:', progress.percent + '%');
    });

    window.updaterAPI.onError((error) => {
      console.error('Update error:', error);
    });
  }
});

onUnmounted(() => {
  document.removeEventListener("keyup", keyHandler);
});

const newIpAddress = ref(localStorage.getItem('serverAddress') || '');
const modalRef = ref<HTMLDialogElement | null>(null);

function keyHandler(event: KeyboardEvent) {
  if (event.key === 'Escape' && event.shiftKey == true) {
    // Handle the escape key press
    modalRef.value?.showModal()
  }
}

function addServerAddress() {
  if (newIpAddress.value) {
    if (!newIpAddress.value.startsWith('http://')) {
      newIpAddress.value = 'http://' + newIpAddress.value;
    }

    serverAddressStore.setServerAddress(newIpAddress.value);
    localStorage.setItem('serverAddress', newIpAddress.value);
    modalRef.value?.close();
  }
}

function checkForUpdates() {
  if (window.updaterAPI) {
    window.updaterAPI.checkForUpdates().catch(console.error);
  }
}

function installUpdate() {
  if (window.updaterAPI) {
    window.updaterAPI.quitAndInstall().catch(console.error);
  }
}

</script>
<template>

<template v-if="serverAddressStore.serverAddress == void 0">
    <Loading title="Getting Server Address" />
    <dialog id="my_modal_1" class="modal" ref="modalRef">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Server Address</h3>
        <input  type="text" v-model="newIpAddress" class="input input-bordered w-full max-w-xs mt-4 mb-4" placeholder="Enter server address" />
        <button @click="addServerAddress" class="btn btn-primary">Use Server Address</button>
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  </template>
  <template v-else>
    <div class="flex flex-col h-full w-full overflow-hidden">
      <TopNav />
      <Alert />
      
      <!-- Update notification -->
      <div v-if="updateAvailable && !updateDownloaded" class="alert alert-info mx-4 mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>A new update is available and downloading...</span>
        <div v-if="downloadProgress > 0" class="ml-4">
          <progress class="progress progress-primary w-32" :value="downloadProgress" max="100"></progress>
          <span class="ml-2">{{ downloadProgress }}%</span>
        </div>
      </div>

      <div v-if="updateDownloaded" class="alert alert-success mx-4 mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Update downloaded! Restart to apply the update.</span>
        <button @click="installUpdate" class="btn btn-sm btn-primary ml-4">Restart Now</button>
      </div>

      <div class="flex h-full w-full mt-18 bg-base-100">
        <router-view />
      </div>
      <Progress />
    </div>
  </template>
</template>
<style>
/* Works on Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #333 transparent;
}
</style>
