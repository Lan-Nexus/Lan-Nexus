import { defineStore } from 'pinia';
import Logger from '@renderer/utils/logger.js';
import functions from '../functions.js';

const logger = Logger('useRunningStore');

export const useRunningStore = defineStore('running', {
  state: () => ({
    programs: [] as string[],
  }),
  actions: {
    init() {
        this.updatePrograms();
       setInterval(() => {
            this.updatePrograms();
       }, 5000);
    },
    async updatePrograms() {
        const programs = await functions.getRunningPrograms();
        this.programs = programs;
    },
    isRunning(program: string): boolean {
      return this.programs.includes(program);
    },
  },
});
