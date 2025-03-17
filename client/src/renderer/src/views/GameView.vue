<script lang="ts" setup>
import { computed } from 'vue';
import SideNav from '../components/SideNav.vue';
import ActionBar from '../components/ActionBar.vue';
import { useGameStore } from '../stores/useGameStore';

const gameStore = useGameStore();

gameStore.loadGames();
const selectedGame = computed(() => {
  return gameStore.selectedGame;
});
</script>

<template>
  <div class="flex flex-col h-full w-full flex flex-row">
    <SideNav />
    <div v-if="selectedGame" class="flex flex-col flex-1" style="height: 88vh; overflow: overlay">
      <div class="parallax">
        <div class="parallax__layer parallax__layer--back">
          <div class="w-full">
            <img
              v-if="selectedGame.heroImage"
              :src="'data:image/jpeg;base64,' + selectedGame.heroImage"
              alt="game"
              class="w-full"
            />
          </div>
        </div>
        <div class="parallax__layer parallax__layer--base">
          <div class="dynamic-margin bg-base-200 relative">
            <img
              v-if="selectedGame.logo"
              :src="'data:image/jpeg;base64,' + selectedGame.logo"
              class="absolute md:-top-15 -top-8 left-5 w-1/2"
            />
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
