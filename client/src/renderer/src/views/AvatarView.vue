<script lang="ts" setup>
import { ref, watch } from 'vue';
import { createAvatar } from '@dicebear/core';
import { bigEarsNeutral } from '@dicebear/collection';
import { useAvatarStore } from '../stores/useAvatarStore.js';
import { useAuthStore } from '../stores/useAuthStore.js';
import { useRouter } from 'vue-router';

const avatarStore = useAvatarStore();
const auth = useAuthStore();
const router = useRouter();

// Expanded color palette for backgrounds
const colors = [
  "b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf", "c2f5b5", "f7f7b6", "f7c6b6", "e0bb95", "f1c27d", "ffdbac", "d1a17b", "a87554", "6f4e37", "f5e6da", "f7cac9", "b5ead7", "ffb7b2", "b28dff", "f7b267", "f4845f", "f27059", "b8b8ff", "b5ead7", "c7ceea"
];

// Reactive state for avatar options
const backgroundColor = ref(colors[0]);

// Correct variant options for bigEarsNeutral (from DiceBear docs)
const eyesOptions = [
  'variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10',
  'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18', 'variant19', 'variant20',
  'variant21', 'variant22', 'variant23', 'variant24', 'variant25', 'variant26', 'variant27', 'variant28', 'variant29', 'variant30',
  'variant31', 'variant32'
];
const cheeksOptions = [
  'variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06'
];
const mouthOptions = [
  'variant0701', 'variant0702', 'variant0703', 'variant0704', 'variant0705', 'variant0706', 'variant0707', 'variant0708'
];
const noseOptions = [
  'variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06'
];

// Add blank options for each category
eyesOptions.unshift('blank');
cheeksOptions.unshift('blank');
mouthOptions.unshift('blank');
noseOptions.unshift('blank');

const eyes = ref(eyesOptions[0]);
const cheeks = ref(cheeksOptions[0]);
const mouth = ref(mouthOptions[0]);
const nose = ref(noseOptions[0]);

const avatar = ref('');

// Update avatar logic to handle blank options
function updateAvatar() {
  avatar.value = createAvatar(bigEarsNeutral, {
    radius: 25,
    backgroundColor: [backgroundColor.value],
    eyes: eyes.value === 'blank' ? [] : [eyes.value as any],
    cheek: cheeks.value === 'blank' ? [] : [cheeks.value as any],
    mouth: mouth.value === 'blank' ? [] : [mouth.value as any],
    nose: nose.value === 'blank' ? [] : [nose.value as any]
  }).toDataUri();
}

// Helper to generate a preview avatar for blank options
function getPreview({ backgroundOpt, eyesOpt, cheeksOpt, mouthOpt, noseOpt }: { backgroundOpt?: string, eyesOpt?: string, cheeksOpt?: string, mouthOpt?: string, noseOpt?: string }) {
  return createAvatar(bigEarsNeutral, {
    radius: 25,
    backgroundColor: [backgroundOpt || backgroundColor.value],
    eyes: eyesOpt === 'blank' ? [] : [(eyesOpt || eyes.value) as any],
    cheek: cheeksOpt === 'blank' ? [] : [(cheeksOpt || cheeks.value) as any],
    mouth: mouthOpt === 'blank' ? [] : [(mouthOpt || mouth.value) as any],
    nose: noseOpt === 'blank' ? [] : [(noseOpt || nose.value) as any]
  }).toDataUri();
}

// Update avatar when options change
watch([backgroundColor, eyes, cheeks, mouth, nose], updateAvatar, { immediate: true });

// Bind userName and seatNumber to the store
const userName = ref(auth.getUsername);
const seatNumber = ref(auth.getSeatNumber);

watch(userName, (val) => {
  auth.setUsername(val);
});
watch(seatNumber, (val) => {
  auth.setSeatNumber(val);
});

function saveAvatar() {
  avatarStore.set(avatar.value);
  router.push('/games');
}

// New reactive reference for client ID
const clientId = ref(auth.getClientId ?? 'unknown');
</script>

<template>
  <div class="flex min-h-screen w-full">
    <div class="flex-1 max-w-[33vw] min-w-[320px] box-border p-8 pb-0 overflow-y-auto h-full">
      <div class="mb-4">
        <div class="mb-4">
          <span class="font-semibold">Background:</span>
          <div class="flex flex-wrap gap-2 mt-2">
            <button v-for="color in colors" :key="color" @click="backgroundColor = color" :class="backgroundColor === color ? 'border-2 border-gray-800' : 'border border-gray-300'" class="p-1 bg-transparent rounded">
              <img :src="getPreview({ backgroundOpt: color })" :style="{ background: '#' + color, borderRadius: '4px' }" width="32" height="32" :alt="color" />
            </button>
          </div>
        </div>
        <div class="mb-4">
          <span class="font-semibold">Eyes:</span>
          <div class="flex flex-wrap gap-2 mt-2">
            <button v-for="option in eyesOptions" :key="option" @click="eyes = option" :class="eyes === option ? 'border-2 border-gray-800' : 'border border-gray-300'" class="p-1 bg-transparent rounded">
              <img :src="getPreview({ eyesOpt: option })" :alt="option" width="32" height="32" />
            </button>
          </div>
        </div>
        <div class="mb-4">
          <span class="font-semibold">Cheeks:</span>
          <div class="flex flex-wrap gap-2 mt-2">
            <button v-for="option in cheeksOptions" :key="option" @click="cheeks = option" :class="cheeks === option ? 'border-2 border-gray-800' : 'border border-gray-300'" class="p-1 bg-transparent rounded">
              <img :src="getPreview({ cheeksOpt: option })" :alt="option" width="32" height="32" />
            </button>
          </div>
        </div>
        <div class="mb-4">
          <span class="font-semibold">Mouth:</span>
          <div class="flex flex-wrap gap-2 mt-2">
            <button v-for="option in mouthOptions" :key="option" @click="mouth = option" :class="mouth === option ? 'border-2 border-gray-800' : 'border border-gray-300'" class="p-1 bg-transparent rounded">
              <img :src="getPreview({ mouthOpt: option })" :alt="option" width="32" height="32" />
            </button>
          </div>
        </div>
        <div class="mb-4">
          <span class="font-semibold">Nose:</span>
          <div class="flex flex-wrap gap-2 mt-2">
            <button v-for="option in noseOptions" :key="option" @click="nose = option" :class="nose === option ? 'border-2 border-gray-800' : 'border border-gray-300'" class="p-1 bg-transparent rounded">
              <img :src="getPreview({ noseOpt: option })" :alt="option" width="32" height="32" />
            </button>
          </div>
        </div>
      </div>
      <div class="h-32 flex items-center justify-center">
      </div>
    </div>
    <div class="flex flex-col w-full h-screen p-8">
      <div class="flex gap-4 w-full mb-4">
        <label class="form-control w-full max-w-xs">
          <div class="label"><span class="label-text">Name</span></div>
          <input v-model="userName" type="text" placeholder="Enter your name" class="input input-bordered w-full max-w-xs" />
        </label>
        <label class="form-control w-24">
          <div class="label"><span class="label-text">Seat #</span></div>
          <input v-model="seatNumber" type="text" placeholder="Seat" class="input input-bordered w-full" />
        </label>
      </div>
      <div class="relative flex flex-col items-center justify-center flex-1">
        <img :src="avatar" alt="Avatar" class="w-64 h-64 rounded-2xl shadow-lg bg-white mx-auto block" />
        <button @click="saveAvatar" class="btn btn-primary mt-8 self-center">Save Avatar</button>
      </div>
    </div>
  </div>
  <div class="fixed bottom-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded shadow z-50">
    Client ID: {{ clientId }}
  </div>
</template>
