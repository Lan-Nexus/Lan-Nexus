import { defineStore } from 'pinia';
import Logger from '../utils/logger.js';
import functions from '../functions.js';

const logger = Logger('server');


export const useServerAddressStore = defineStore('serverAddress', {
  state: () => ({
    serverAddress: undefined as string | undefined,
  }),
  actions: {
    setServerAddress(address: string) {
      this.serverAddress = address;
    },
    getServerAddress() {
      if (this.serverAddress) {
        logger.log('Using cached server address:', this.serverAddress);
        return this.serverAddress;
      }
      return new Promise((resolve) => {
        logger.log('Fetching server address...');
        functions.getServerIP((ip) => {
          if (!ip) {
            logger.error('Failed to fetch server address');
            return;
          }
          logger.log('Server address fetched:', ip);
          this.serverAddress = ip;
          resolve(this.serverAddress);
        });
      });
    }
  },
});
