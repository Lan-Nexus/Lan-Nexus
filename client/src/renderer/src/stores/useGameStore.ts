import { defineStore } from 'pinia';
import axios from 'axios';
import functions from '../functions.js';

import { useProgressStore } from './useProgress.js';
import Logger from '@renderer/utils/logger.js';
import { useServerAddressStore } from './useServerAddress.js';


const logger = Logger('useGameStore');

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
      const serverAddressStore = useServerAddressStore();
      const game = this.games.find((game) => game.id === this.selectedGameId);
      if (!game || !game.archives) {
        logger.error('Game not found or no archive available for installation.');
        return;
      }
      const safeName = game.name.replaceAll(' ', '-');
      const archiveFile = safeName + '.zip';
      const progressStore = useProgressStore();
      progressStore.active = true;
      try {
        const url = serverAddressStore.serverAddress + game.archives
        await functions.download(progressStore.setProgress, progressStore.setActive, url, archiveFile);
        await functions.unzip(progressStore.setProgress, progressStore.setActive, archiveFile, safeName);
        await functions.run(progressStore.setProgress, progressStore.setActive, safeName, game.install);
        await functions.clearTemp(progressStore.setProgress);
        game.isInstalled = true;
      } catch (error) {
        logger.error(error);
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
        game.isInstalled = false;
      } catch (error) {
        logger.error(error);
      } finally {
        progressStore.active = false;
      }
    },
    async loadGames() {
      const serverAddressStore = useServerAddressStore();
      try {
        const response = await axios.get(`${serverAddressStore.serverAddress}/api/games`);
        const gamesData = response.data;
        this.games = await this._addInstallStatusToGames(gamesData.data);
      } catch (error) {
        logger.error('Failed to load games:', error);
      }
    },

    async _addInstallStatusToGames(gamesData: gameState[]): Promise<gameState[]> {
      debugger;
      const gamesWithStatus: gameState[] = [];
      for (const game of gamesData) {
        gamesWithStatus.push(await this._addInstallStatusToGame(game));
      }
      return gamesWithStatus;
    },

    async _addInstallStatusToGame(game: gameState): Promise<gameState> {
      let isInstalled = false;
      if (game.type === 'archive') {
        const safeName = game.name.replaceAll(' ', '-');
        const noOp = () => { };
        isInstalled = await functions.isGameInstalled(noOp, noOp, safeName);
        logger.log(`Game ${game.name} is installed: ${isInstalled}`);
      }
      return { ...game, isInstalled };
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
