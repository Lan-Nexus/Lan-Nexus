import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProgressStore = defineStore('progress', () => {
  const active = ref(true);
  const progress = ref(20);
  const message = ref('Loading...');

  return { active,progress, message };
});
