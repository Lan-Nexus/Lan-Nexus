<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../utls/api';

interface GameKey {
  id: number;
  key: string;
  gameId: number;
  ipAddress?: string;
  clientId?: string;
}

const props = defineProps<{ gameId: number }>();
const keys = ref<GameKey[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const newKey = ref('');
const newIpAddress = ref('');
const adding = ref(false);
const fieldErrors = ref<{ [key: string]: string }>({});
const removingKeyId = ref<number | null>(null);
const reservingKeyId = ref<number | null>(null);
const releasingKeyId = ref<number | null>(null);
const reserveDialog = ref<{ show: boolean; keyObj: GameKey | null }>({ show: false, keyObj: null });
const reserveClientId = ref('');

async function fetchKeys() {
    if (!props.gameId) {
        error.value = 'Game ID is required';
        loading.value = false;
        return;
    }
    loading.value = true;
    error.value = null;
    try {
        const res = await api.get(`/api/games/${props.gameId}/keys`);
        keys.value = res.data.data || [];
    } catch (e: any) {
        error.value = e?.message || 'Failed to load keys';
    } finally {
        loading.value = false;
    }
}

async function addKey() {
    if (!newKey.value.trim()) return;
    adding.value = true;
    error.value = null;
    fieldErrors.value = {};
    try {
        await api.post(`/api/games/${props.gameId}/keys`, {
            key: newKey.value,
            gameId: props.gameId,
            ipAddress: newIpAddress.value || ''
        });
        newKey.value = '';
        newIpAddress.value = '';
        await fetchKeys();
    } catch (e: any) {
        if (e?.response?.data?.error?.issues) {
            const issues = e.response.data.error.issues;
            for (const issue of issues) {
                if (issue.path && issue.path.length > 0) {
                    fieldErrors.value[issue.path[0]] = issue.message || 'Invalid';
                }
            }
            error.value = 'Please fix the errors below.';
        } else if (e?.response?.data?.error?.message) {
            error.value = e.response.data.error.message;
        } else if (e?.message) {
            error.value = e.message;
        } else {
            error.value = 'Failed to add key';
        }
    } finally {
        adding.value = false;
    }
}

async function removeKey(keyObj: GameKey) {
  if (!confirm(`Remove key: ${keyObj.key}?`)) return;
  removingKeyId.value = keyObj.id;
  error.value = null;
  try {
    await api.delete(`/api/games/${props.gameId}/keys/${keyObj.id}`);
    await fetchKeys();
  } catch (e: any) {
    error.value = e?.response?.data?.error?.message || e?.message || 'Failed to remove key';
  } finally {
    removingKeyId.value = null;
  }
}

function openReserveDialog(keyObj: GameKey) {
  reserveDialog.value = { show: true, keyObj };
  reserveClientId.value = '';
}

async function reserveKey() {
  if (!reserveDialog.value.keyObj) return;
  reservingKeyId.value = reserveDialog.value.keyObj.id;
  error.value = null;
  try {
    await api.post(`/api/games/${props.gameId}/keys/${reserveDialog.value.keyObj.id}/reserve`, {
      clientId: reserveClientId.value
    });
    reserveDialog.value = { show: false, keyObj: null };
    await fetchKeys();
  } catch (e: any) {
    error.value = e?.response?.data?.error?.message || e?.message || 'Failed to reserve key';
  } finally {
    reservingKeyId.value = null;
  }
}

function closeReserveDialog() {
  reserveDialog.value = { show: false, keyObj: null };
}

async function releaseKey(keyObj: GameKey) {
  releasingKeyId.value = keyObj.id;
  error.value = null;
  try {
    await api.post(`/api/games/${props.gameId}/keys/${keyObj.id}/release`);
    await fetchKeys();
  } catch (e: any) {
    error.value = e?.response?.data?.error?.message || e?.message || 'Failed to release key';
  } finally {
    releasingKeyId.value = null;
  }
}

onMounted(fetchKeys);
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-2">Game Keys</h2>
    <form @submit.prevent="addKey" class="mb-4 flex gap-2 items-start">
      <div class="flex flex-col">
        <input
          v-model="newKey"
          type="text"
          placeholder="Enter new key"
          class="input input-bordered input-sm"
          :disabled="adding"
        />
        <span v-if="fieldErrors.key" class="text-xs text-red-500">{{ fieldErrors.key }}</span>
      </div>
      <div class="flex flex-col">
        <input
          v-model="newIpAddress"
          type="text"
          placeholder="IP Address (required)"
          class="input input-bordered input-sm"
          :disabled="adding"
        />
        <span v-if="fieldErrors.ipAddress" class="text-xs text-red-500">{{ fieldErrors.ipAddress }}</span>
      </div>
      <button
        type="submit"
        class="btn btn-primary btn-sm mt-0.5"
        :disabled="adding || !newKey.trim()"
      >
        <span v-if="adding">Adding...</span>
        <span v-else>Add Key</span>
      </button>
    </form>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <table v-else class="bg-base-200 p-2 rounded w-full">
      <thead>
        <tr>
          <th class="text-left p-1">Key</th>
          <th class="text-left p-1">IP Address</th>
          <th class="text-left p-1">Client ID</th>
          <th class="text-left p-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(keyObj, idx) in keys" :key="keyObj.id">
          <td class="font-mono p-1">{{ keyObj.key }}</td>
          <td class="p-1">{{ keyObj.ipAddress || '-' }}</td>
          <td class="p-1">{{ keyObj.clientId || '-' }}</td>
          <td class="p-1">
            <button
              class="btn btn-xs btn-error"
              @click="removeKey(keyObj)"
              :disabled="removingKeyId === keyObj.id"
            >
              <span v-if="removingKeyId === keyObj.id">Removing...</span>
              <span v-else>Remove</span>
            </button>
            <button
              class="btn btn-xs btn-secondary ml-2"
              @click="openReserveDialog(keyObj)"
              :disabled="reservingKeyId === keyObj.id"
            >
              <span v-if="reservingKeyId === keyObj.id">Reserving...</span>
              <span v-else>Reserve</span>
            </button>
            <button
              class="btn btn-xs btn-accent ml-2"
              @click="releaseKey(keyObj)"
              :disabled="releasingKeyId === keyObj.id"
            >
              <span v-if="releasingKeyId === keyObj.id">Releasing...</span>
              <span v-else>Release</span>
            </button>
          </td>
        </tr>
        <tr v-if="!keys || keys.length === 0">
          <td colspan="4" class="text-gray-500 p-1">No keys available.</td>
        </tr>
      </tbody>
    </table>

    <!-- Reserve Dialog -->
    <div v-if="reserveDialog.show" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded shadow w-80">
        <h3 class="text-lg font-semibold mb-2">Reserve Key</h3>
        <div class="mb-2">
          <label class="block text-sm mb-1">Client ID</label>
          <input v-model="reserveClientId" class="input input-bordered input-sm w-full" placeholder="Enter client ID" />
        </div>
        <div class="flex gap-2 justify-end">
          <button class="btn btn-sm" @click="closeReserveDialog">Cancel</button>
          <button class="btn btn-primary btn-sm" :disabled="!reserveClientId.trim() || reservingKeyId === reserveDialog.keyObj?.id" @click="reserveKey">
            <span v-if="reservingKeyId === reserveDialog.keyObj?.id">Reserving...</span>
            <span v-else>Reserve</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-mono {
  font-family: monospace;
}
</style>
