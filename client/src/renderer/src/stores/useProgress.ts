import { defineStore } from 'pinia';
import Logger from '@renderer/utils/logger.js';

const logger = Logger('useProgressStore');

export const useProgressStore = defineStore('progress', {
  state: () => {
    return {
      active: false,
      progress: 0,
      message: 'Loading...',
    };
  },
  actions: {
    setActive(active: boolean) {
      this.active = active;
    },
    setProgress(amount: string, msg: string) {
      this.active = true;
      logger.log('Setting progress:', amount);
      logger.log('Setting message:', msg);
      this.progress = Number(amount);

      if (this.progress < 0 || this.progress > 100) {
        logger.warn('Progress value out of bounds:', this.progress);
        this.progress = 50; 
      }
      
      if (msg) {
        this.message = msg;
      }
    },
  },
});
