
<template>
  <div v-if="newGame.gameInfo" class="container mx-auto p-4">
    <h1 class="mb-4 text-3xl font-bold">Add Game</h1>
    <h2 class="text-2xl font-bold mb-6">{{ newGame.gameInfo.game.name }}</h2>

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
        :items="newGame.gameInfo.icon"
        :selected="newGame.selectedIcon"
        :onSelect="item => newGame.setSelectedIcon(item)"
        imgSize="w-16 h-16"
      />
      <StepImageGrid
        v-else-if="currentStep === 1"
        title="Select a Logo"
        :items="newGame.gameInfo.logo"
        :selected="newGame.selectedLogo"
        :onSelect="item => newGame.setSelectedLogo(item)"
        imgSize="w-42"
      />
      <StepImageGrid
        v-else-if="currentStep === 2"
        title="Select a Hero"
        :items="newGame.gameInfo.hero"
        :selected="newGame.selectedHero"
        :onSelect="item => newGame.setSelectedHero(item)"
        imgSize="w-42"
      />
      <StepImageGrid
        v-else-if="currentStep === 3"
        title="Select a Grid"
        :items="newGame.gameInfo.grid"
        :selected="newGame.selectedGrid"
        :onSelect="item => newGame.setSelectedGrid(item)"
        imgSize="w-42"
      />
      <StepImageGrid
        v-else-if="currentStep === 4"
        title="Select a Card"
        :items="newGame.gameInfo.card"
        :selected="newGame.selectedCard"
        :onSelect="item => newGame.setSelectedCard(item)"
        imgSize="w-42"
      />
    </div>


  </div>
</template>


<script setup>


import { ref, onMounted } from 'vue';
import api from '../utls/api';
import { useRouter } from 'vue-router';
import StepImageGrid from '../components/StepImageGrid.vue';
import { useGamesStore } from '../stores/games';
import { useNewGameStore } from '../stores/newGame';

const router = useRouter();
const gamesStore = useGamesStore();

const newGame = useNewGameStore();

const steps = [
  { key: 'icon', label: 'Icon' },
  { key: 'logo', label: 'Logo' },
  { key: 'hero', label: 'Hero' },
  { key: 'grid', label: 'Grid' },
  { key: 'card', label: 'Card' },
];

const currentStep = ref(0);

function save() {
  newGame.save(gamesStore, router);
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
  newGame.setGameId(route.params.gameId);
  try {
    const response = await api.get(`/api/games/search/${newGame.gameId}`);
    newGame.setGameInfo(response.data.data);
  } catch (error) {
    console.error('Error fetching game details:', error);
  }
});


</script>