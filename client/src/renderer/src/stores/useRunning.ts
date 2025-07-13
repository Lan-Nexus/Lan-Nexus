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
      if (!program) {
        logger.warn('isRunning called with empty program name');
        return false;
      }
      program = program.substring(0, 25); // Limit to 25 characters to avoid issues with long names as tasklist can truncate names
      logger.log(`Checking if program is running: ${program}`);
      return this.programs.includes(program);
    },
  },
});
