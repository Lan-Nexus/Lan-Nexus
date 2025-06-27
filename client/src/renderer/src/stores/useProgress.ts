import { defineStore } from 'pinia';
import Logger from '@renderer/utils/logger.js';
// Use the progressAPI object exposed by the preload script
const progressAPI = window.progressAPI;
const logger = Logger('useProgressStore')

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
    listenForIpcEvents() {
      if (!progressAPI) logger.error('Progress api not found')
      progressAPI.onProgress((amount: string, name: string) => {
        logger.log('Setting progress from api :', amount);
        this.setProgress(amount, name);
      });
      progressAPI.onProgressActive((state: boolean) => {
        logger.log('Setting active from api :', state);
        this.setActive(state);
      });
      logger.log('Progress api loaded')
    },
  },
});
