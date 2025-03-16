import { defineStore } from 'pinia'

export const useProgressStore = defineStore('progress', {
  state: () => {
    return {
      active: true,
      progress: 0,
      message: 'Loading...'
    }
  },
  actions: {
    setProgress(amount, msg) {
      console.log('Setting progress:', amount);
      console.log('Setting message:', msg);
      this.progress = Number(amount);
      if (msg) {
        this.message = msg;
      }
    }
  }
})
