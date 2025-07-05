
<template>
  <div v-if="gameInfo" class="container mx-auto p-4">
    <h1 class="mb-4 text-3xl font-bold">Add Game</h1>
    <h2 class="text-2xl font-bold mb-6">{{ gameInfo.game.name }}</h2>

    <div class="w-full flex justify-center mb-8">
      <ul class="steps steps-horizontal w-full max-w-2xl">
        <li v-for="(step, idx) in steps" :key="step.key"
            class="step"
            :class="{ 'step-primary': idx <= currentStep }">
          <div class="flex flex-col items-center">
            <span class="text-xs mt-1">{{ step.label }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="flex justify-between mt-6">
      <button @click="prevStep" :disabled="currentStep === 0" class="btn btn-outline btn-secondary" :class="{ 'btn-disabled': currentStep === 0 }">Back</button>
      <button @click="nextStep" class="btn btn-primary">
        {{ currentStep === steps.length - 1 ? 'Finish' : 'Next' }}
      </button>
    </div>
    <div class="mb-8">
      <StepImageGrid
        v-if="currentStep === 0"
        title="Select an Icon"
        :items="gameInfo.icon"
        :selected="selectedIcon"
        :onSelect="item => selectedIcon = item"
        imgSize="w-16 h-16"
      />
      <StepImageGrid
        v-else-if="currentStep === 1"
        title="Select a Logo"
        :items="gameInfo.logo"
        :selected="selectedLogo"
        :onSelect="item => selectedLogo = item"
        imgSize="w-42"
      />
      <StepImageGrid
        v-else-if="currentStep === 2"
        title="Select a Hero"
        :items="gameInfo.hero"
        :selected="selectedHero"
        :onSelect="item => selectedHero = item"
        imgSize="w-42"
      />
      <StepImageGrid
        v-else-if="currentStep === 3"
        title="Select a Grid"
        :items="gameInfo.grid"
        :selected="selectedGrid"
        :onSelect="item => selectedGrid = item"
        imgSize="w-42"
      />
      <StepImageGrid
        v-else-if="currentStep === 4"
        title="Select a Card"
        :items="gameInfo.card"
        :selected="selectedCard"
        :onSelect="item => selectedCard = item"
        imgSize="w-42"
      />
    </div>


  </div>
</template>


<script setup>

import { ref, computed, onMounted } from 'vue';
import api from '../utls/api';
import { useRouter } from 'vue-router';
import StepImageGrid from '../components/StepImageGrid.vue';
import { useGamesStore } from '../stores/games';

const router = useRouter();
const gamesStore = useGamesStore();

const gameId = ref(null);
const gameInfo = ref(null);
const selectedIcon = ref(null);
const selectedLogo = ref(null);
const selectedHero = ref(null);
const selectedGrid = ref(null);
const selectedCard = ref(null);

const steps = [
  { key: 'icon', label: 'Icon' },
  { key: 'logo', label: 'Logo' },
  { key: 'hero', label: 'Hero' },
  { key: 'grid', label: 'Grid' },
  { key: 'card', label: 'Card' },
];
const currentStep = ref(0);

async function save() {
    const res = await gamesStore.createGame({
      gameID: gameId.value,
      name: gameInfo.value.game.name,
      description: gameInfo.value.game.name,
      icon: selectedIcon.value?.url,
      headerImage: selectedHero.value?.url,
      logo: selectedLogo.value?.url,
      imageCard: selectedCard.value?.url,
      heroImage: selectedHero.value?.url,
      type: 'archive',
      install: '', 
      uninstall: '', 
      play: 'await run(GAME_EXECUTABLE);',
      status: 'installed',
      needsKey: 0,
      status: 'Draft',
    })
    if (res) {
      console.log('Game created successfully:', res);
      router.push({ name: 'editGame', params: { id: String(res.id) } });
    } else {
      console.error('Failed to create game');
    }

}

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  } else if (currentStep.value === steps.length - 1) {
    save();
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

onMounted(async () => {
  const route = router.currentRoute.value;
  gameId.value = route.params.gameId;
  try {
    const response = await api.get(`/api/games/search/${gameId.value}`);
    gameInfo.value = response.data.data;
  } catch (error) {
    console.error('Error fetching game details:', error);
  }
});


</script>