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

onMounted(() => {
  document.addEventListener("keyup", keyHandler);
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

</script>
<template>

  <template v-if="serverAddressStore.serverAddress == void 0">
      <Loading title="Getting Server Address" />
  </template>
  <template v-else>
    <div class="flex flex-col h-full w-full overflow-hidden">
      <TopNav />
      <Alert />
      <div class="flex h-full w-full mt-18 bg-base-100">
        <router-view />
      </div>
      <Progress />
    </div>
  </template>
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
<style>
/* Works on Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #333 transparent;
}
</style>
