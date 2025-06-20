import { defineStore } from 'pinia';
import axios from 'axios';
import functions from '../functions.js';

import { useProgressStore } from './useProgress.js';
import { getServerAddress } from '@renderer/utils/server.js';

export type gameState = {
  description: string;
  gameID: string;
  id: number;
  name: string;
  type: string;
  heroImage: string;
  headerImage: string;
  logo: string;
  icon: string;
  archives: string;
  install: string;
  uninstall: string;
  play: string;
  isInstalled?: boolean; // Added property
};

export const useGameStore = defineStore('game', {
  state: () => ({
    games: [] as gameState[],
    selectedGameId: -1,
  }),
  getters: {
    selectedGame: (state) => {
      const game = state.games.find((game) => game.id === state.selectedGameId);
      if (game) {
        return game;
      }
      return void 0;
    },
  },
  actions: {
    selectGame(id) {
      this.selectedGameId = id;
    },
    reload() {
      this.loadGames();
    },
    async installArchive() {
      const game = this.games.find((game) => game.id === this.selectedGameId);
      if (!game || !game.archives) {
        console.error('Game not found or no archive available for installation.');
        return;
      }
      const safeName = game.name.replaceAll(' ', '-');
      const archiveFile = safeName + '.zip';
      const progressStore = useProgressStore();
      progressStore.active = true;
      try {
        const url = getServerAddress() + game.archives
        await functions.download(progressStore.setProgress, progressStore.setActive, url, archiveFile);
        await functions.unzip(progressStore.setProgress, progressStore.setActive, archiveFile, safeName);
        await functions.run(progressStore.setProgress, progressStore.setActive, safeName, game.install);
        await functions.clearTemp(progressStore.setProgress);
        // Set isInstalled to true after install
        game.isInstalled = true;
      } catch (error) {
        console.error(error);
      } finally {
        progressStore.active = false;
      }
    },
    async uninstallArchive() {
      const progressStore = useProgressStore();
      progressStore.active = false;
      const game = this.games.find((game) => game.id === this.selectedGameId);
      if (!game) {
        return;
      }
      const safeName = game.name.replaceAll(' ', '-');
      try {
        await functions.run(progressStore.setProgress, progressStore.setActive, safeName, game.uninstall);
        await functions.removeGame(progressStore.setProgress, progressStore.setActive, safeName);
        // Set isInstalled to false after uninstall
        game.isInstalled = false;
      } catch (error) {
        console.error(error);
      } finally {
        progressStore.active = false;
      }
    },
    async loadGames() {
      const response = await axios.get(`${getServerAddress()}/api/games`);
      // Set isInstalled to false by default; update with real logic as needed
      this.games = response.data.map((game) => ({ ...game, isInstalled: false }));
    },
    async play() {
      const selectedGame = this.selectedGame;
      if (selectedGame && selectedGame.type === 'steam') {
        document.location.href = `steam://run/${selectedGame.gameID}`;
      }
      if (selectedGame && selectedGame.type === 'archive') {
        const game = this.games.find((game) => game.id === this.selectedGameId);
        if (!game) {
          return;
        }
        const safeName = game.name.replaceAll(' ', '-');
        const progressStore = useProgressStore();
        await functions.run(progressStore.setProgress, progressStore.setActive, safeName, game.play);
      }
    },
  },
});
