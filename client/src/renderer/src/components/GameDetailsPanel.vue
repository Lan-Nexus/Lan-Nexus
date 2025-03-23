<script lang="ts" setup>
import type { gameState } from '@renderer/stores/useGameStore';
import ActionBar from '../components/ActionBar.vue';
import { onMounted, onUnmounted, onUpdated, ref, useTemplateRef } from 'vue';

const model = defineModel<gameState>();
const height = ref('0px');
const widthOrHeight = ref<string>();
const logoElement = useTemplateRef<HTMLElement>('logoElement');
const heroImageElement = useTemplateRef<HTMLElement>('heroImageElement');

function updateHeight() {
  if (heroImageElement.value) {
    height.value = heroImageElement.value.clientHeight / 2 + 'px';
  }
}

function getLogoSize() {
  const height = logoElement.value?.children[0]?.clientHeight;
  const width = logoElement.value?.children[0]?.clientWidth;
  if (!height || !width) {
    widthOrHeight.value = 'w-1/2';
    return;
  }
  if (height > width) {
    widthOrHeight.value = 'h-1/1';
    return;
  }
  widthOrHeight.value = 'w-1/2';
}

onMounted(() => {
  window.addEventListener('resize', updateHeight);
});

onUpdated(() => {
  updateHeight();
  getLogoSize();
});

onUnmounted(() => {
  window.addEventListener('resize', updateHeight);
});
</script>

<template>
  <template v-if="model">
    <div class="parallax relative">
      <div class="parallax__layer parallax__layer--back">
        <div ref="heroImageElement" class="w-full bg-error">
          <img
            v-if="model.heroImage"
            :onload="updateHeight"
            :src="'data:image/jpeg;base64,' + model.heroImage"
            alt="game"
            class="w-full"
          />
          <img
            v-else-if="model.headerImage"
            :src="'data:image/jpeg;base64,' + model.headerImage"
            alt="game"
            class="w-full"
          />
          <div v-else class="w-full h-150 bg-violet-500"></div>
        </div>
      </div>
      <div ref="logoElement" class="relative w-full logo">
        <img
          v-if="model.logo"
          :onload="getLogoSize"
          :src="'data:image/jpeg;base64,' + model.logo"
          :class="widthOrHeight"
          class="absolute -bottom-1/5 left-5"
        />
        <div
          v-else-if="!model.headerImage"
          style="text-shadow: 2px 2px 2px black"
          class="absolute -bottom-1/5 left-5 text-5xl text-white"
        >
          {{ model.name }}
        </div>
      </div>
      <div class="parallax__layer parallax__layer--base">
        <div class="my-[32%] bg-base-200">
          <ActionBar class="bg-base-200" />
          <div class="mt-4 flex flex-row gap-4 px-5">
            <div v-html="model?.description"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<style scoped>
.logo {
  height: v-bind(height);
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
