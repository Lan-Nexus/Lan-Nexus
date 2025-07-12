import { defineStore } from 'pinia';
import axios from 'axios';
import functions from '../functions.js';
import { useAuthStore } from './useAuthStore.js';
import { useProgressStore } from './useProgress.js';
import Logger from '@renderer/utils/logger.js';
import { useServerAddressStore } from './useServerAddress.js';
import { useAlerts } from './useAlerts.js';
import { reserveGameKey, releaseGameKey, loadGames as apiLoadGames } from '../utils/api.js';

const logger = Logger('useGameStore');

import type { gameState } from '@renderer/types.js';

export const useGameStore = defineStore('game', {
  state: () => ({
    games: [] as gameState[],
    selectedGameId: -1,
    loading: false,
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

    _findSelectedGame() {
      return this.games.find((game) => game.id === this.selectedGameId);
    },

    autoRefreshGames() {
      const refreshRate = 600 * 1000;
      logger.log(`Auto-refreshing games every ${refreshRate / 1000} seconds`);
      setInterval(() => {
        logger.log('Refreshing games...');
        this.loadGames();
      }, refreshRate);
    },

    reload() {
      this.loadGames();
    },

    async reserveGameKey(gameId: number) {
      const serverAddressStore = useServerAddressStore();
      const authStore = useAuthStore();
      const alerts = useAlerts();
      try {
        const data = await reserveGameKey(serverAddressStore.serverAddress!, gameId, authStore.clientId);
        logger.log('Game key reserved:', data);
        return data;
      } catch (error) {
        logger.error('Failed to reserve game key:', error);
        let description = 'Failed to reserve game key.';
        if (axios.isAxiosError(error) && error.response?.data?.error?.error) {
          description += '<br>' + error.response.data.error.error;
        }
        alerts.showError({ title: 'Key Reservation Failed', description });
        this.loading = false;
        throw error;
      }
    },

    async installArchive() {
      this.loading = true;
      const serverAddressStore = useServerAddressStore();
      const alerts = useAlerts();
      const game = this._findSelectedGame();
      if (!game || !game.archives) {
        logger.error('Game not found or no archive available for installation.');
        alerts.showError({ title: 'Install Failed', description: 'Game not found or no archive available for installation.' });
        this.loading = false;
        return;
      }

      if(game.needsKey) {
        game.gamekey = await this.reserveGameKey(game.id)
      }

      const safeName = game.gameID.replaceAll(' ', '-');
      const archiveFile = safeName + '.zip';
      const progressStore = useProgressStore();
      progressStore.active = true;
      try {
        const url = serverAddressStore.serverAddress + game.archives
        await functions.download(url, archiveFile);
        await functions.unzip(archiveFile, safeName);
        await functions.run(safeName, game.install, { GAME_KEY: game.gamekey?.key ?? '', GAME_ID: String(game.gameID), GAME_NAME: game.name, GAME_EXECUTABLE: game.executable || '' });
        await functions.clearTemp();
        game.isInstalled = true;
        alerts.showSuccess({ title: 'Install Success', description: 'Game installed successfully!' });
      } catch (error) {
        logger.error(error);
        this.uninstallArchive(true);
        await functions.clearTemp();
        alerts.showError({ title: 'Install Failed', description: 'Failed to install game.<br>' + (error instanceof Error ? error.message : '') });
      } finally {
        progressStore.active = false;
        this.loading = false;
      }
    },

    async uninstallArchive(hideAlerts = false) {
      this.loading = true;
      const serverAddressStore = useServerAddressStore();
      const alerts = useAlerts();
      const keyid = this.selectedGame?.gamekey?.id;
      if (keyid) {
        logger.log('Releasing game key:', keyid);
        await releaseGameKey(serverAddressStore.serverAddress!, this.selectedGameId, keyid);
        this.selectedGame.gamekey = void 0;
        logger.log('Game key released:', keyid);
      }
      const progressStore = useProgressStore();
      progressStore.active = false;
      const game = this._findSelectedGame();
      if (!game) {
        alerts.showError({ title: 'Uninstall Failed', description: 'Game not found for uninstall.' });
        return;
      }
      const safeName = game.gameID.replaceAll(' ', '-');
      try {
        await functions.run(safeName, game.uninstall);
        await functions.removeGame(safeName);
        game.isInstalled = false;
        if(!hideAlerts) {
          alerts.showSuccess({ title: 'Uninstall Success', description: 'Game uninstalled successfully!' });
        } 
      } catch (error) {
        logger.error(error);
        if(!hideAlerts){
          alerts.showError({ title: 'Uninstall Failed', description: 'Failed to uninstall game.' });
        }
      } finally {
        progressStore.active = false;
        this.loading = false;
      }
    },

    async loadGames() {
      this.loading = true;
      const serverAddressStore = useServerAddressStore();
      const authStore = useAuthStore();
      const alerts = useAlerts();
      try {
        const gamesData = await apiLoadGames(serverAddressStore.serverAddress!, authStore.clientId);
        this.games = await this._addInstallStatusToGames(gamesData);
      } catch (error) {
        logger.error('Failed to load games:', error);
        alerts.showError({ title: 'Load Failed', description: 'Failed to load games.' });
      } finally {
        this.loading = false;
      }
    },

    async _addInstallStatusToGames(gamesData: gameState[]): Promise<gameState[]> {
      const gamesWithStatus: gameState[] = [];
      for (const game of gamesData) {
        gamesWithStatus.push(await this._addInstallStatusToGame(game));
      }
      return gamesWithStatus;
    },

    async _addInstallStatusToGame(game: gameState): Promise<gameState> {
      let isInstalled = false;
      if (game.type === 'archive') {
        const safeName = game.gameID.replaceAll(' ', '-');
        isInstalled = await functions.isGameInstalled(safeName);
        logger.log(`Game ${game.name} is installed: ${isInstalled}`);
      }
      return { ...game, isInstalled };
    },

    async play() {
      const selectedGame = this.selectedGame;
      if (!selectedGame) return;

      if (selectedGame.type === 'steam') {
        await this.playSteam();
        return;
      }
      if (selectedGame.type === 'archive') {
        await this.playArchive();
        return;
      }
    },

    async playSteam() {
      const selectedGame = this.selectedGame;
      if (selectedGame && selectedGame.type === 'steam') {
        document.location.href = `steam://run/${selectedGame.gameID}`;
      }
    },

    async playArchive() {
      const game = this._findSelectedGame();
      if (!game || game.type !== 'archive') {
        return;
      }
      const safeName = game.gameID.replaceAll(' ', '-');
      // const progressStore = useProgressStore();
      logger.log(`Preparing to play game: ${game.name}`);
      await functions.run(safeName, game.play, {
        GAME_KEY: game.gamekey?.key ?? '',
        GAME_ID: String(game.gameID),
        GAME_NAME: game.name,
        GAME_EXECUTABLE: game.executable || '',
      });
      logger.log(`Playing game: ${game.name}`);

    },
  },
});
