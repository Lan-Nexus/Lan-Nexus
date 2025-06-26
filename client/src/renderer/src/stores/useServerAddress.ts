import { defineStore } from 'pinia';
import Logger from '../utils/logger.js';
import functions from '../functions.js';

const logger = Logger('server');


export const useServerAddressStore = defineStore('serverAddress', {
  state: () => ({
    serverAddress: undefined as string | undefined,
  }),
  actions: {
    async setServerAddress(address: string) {
      await api.function('getServerIP', true);
      this.serverAddress = address;
    },
    async getServerAddress() {
      if (this.serverAddress) {
        logger.log('Using cached server address:', this.serverAddress);
        return this.serverAddress;
      }

      this.serverAddress = await api.function('getServerIP');

    }
  },
});
