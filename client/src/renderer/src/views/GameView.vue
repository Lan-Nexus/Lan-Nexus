<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import SideNav from '../components/SideNav.vue';
import ActionBar from '../components/ActionBar.vue';
import { useGameStore } from '../stores/useGameStore';

const gameStore = useGameStore();
const height = ref('0px');
const heroImageElement = useTemplateRef<HTMLElement>('heroImageElement');

gameStore.loadGames();
const selectedGame = computed(() => {
  return gameStore.selectedGame;
});

function updateHeight() {
  if (heroImageElement.value) {
    height.value = heroImageElement.value.clientHeight / 2 + 'px';
  }
}

onMounted(() => {
  window.addEventListener('resize', updateHeight);
});

watch(selectedGame, async () => {
  updateHeight();
});

onUnmounted(() => {
  window.addEventListener('resize', updateHeight);
});
</script>

<template>
  <div class="flex flex-col h-full w-full flex flex-row">
    <SideNav />

    <div v-if="selectedGame" class="flex flex-col flex-1" style="height: 88vh; overflow: overlay">
      <div class="parallax relative">
        <div class="parallax__layer parallax__layer--back">
          <div ref="heroImageElement" class="w-full">
            <img
              v-if="selectedGame.heroImage"
              :src="'data:image/jpeg;base64,' + selectedGame.heroImage"
              alt="game"
              class="w-full"
            />
          </div>
        </div>
        <div class="relative w-full logo">
          <img
            v-if="selectedGame.logo"
            :src="'data:image/jpeg;base64,' + selectedGame.logo"
            class="absolute -bottom-1/5 left-5 w-1/2"
          />
        </div>
        <div class="parallax__layer parallax__layer--base">
          <div class="dynamic-margin bg-base-200">
            <ActionBar />
            <div class="mt-4 flex flex-row gap-4">
              <div v-html="selectedGame?.description"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: v-bind(height);
}

.dynamic-margin {
  margin: 32% 0;
}
.parallax {
  perspective: 1px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.parallax__layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.parallax__layer--base {
  transform: translateZ(0);
}

.parallax__layer--back {
  transform: translateZ(-0.5px);
  width: 150%;
  left: -25%;
  top: -25%;
}
</style>
