import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useProgressStore = defineStore('progress', () => {
  const active = ref(true);
  const progress = ref(0);
  const message = ref('Loading...');

  watch(progress, (value) => {
    console.log('Progress:', value);
  })


  const setProgress = (amount, msg) => {
    console.log('Setting progress:', amount);
    console.log('Setting message:', msg);
    progress.value = Number(amount);
    if(msg){
      message.value = msg;
    }
  }


  return { active,progress, message, setProgress };
});
