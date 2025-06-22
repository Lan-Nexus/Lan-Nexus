import { defineStore } from 'pinia';
import axios from 'axios';
import functions from '../functions.js';

import { useProgressStore } from './useProgress.js';
import Logger from '@renderer/utils/logger.js';
import { useServerAddressStore } from './useServerAddress.js';
import { useAlerts } from './useAlerts.js';

const logger = Logger('useGameStore');

export type gameKey = {
  id: number;
  key: string;
  gameId: number;
  ipAddress: string;
};

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
  gamekey?: gameKey;
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
    async reserveGameKey(gameId: number) {
      const serverAddressStore = useServerAddressStore();
      const alerts = useAlerts();
      try {
        const response = await axios.post(
          `${serverAddressStore.serverAddress}/api/games/${gameId}/keys/reserve`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        logger.log('Game key reserved:', response.data);
        return response.data.data;
      } catch (error) {
        logger.error('Failed to reserve game key:', error);
        let description = 'Failed to reserve game key.';
        if (axios.isAxiosError(error) && error.response?.data?.error?.error) {
          description += '<br>' + error.response.data.error.error;
        }
        alerts.showError({ title: 'Key Reservation Failed', description });
        throw error;
      }
    },
    async installArchive() {
      const serverAddressStore = useServerAddressStore();
      const alerts = useAlerts();
      const game = this.games.find((game) => game.id === this.selectedGameId);
      if (!game || !game.archives) {
        logger.error('Game not found or no archive available for installation.');
        alerts.showError({ title: 'Install Failed', description: 'Game not found or no archive available for installation.' });
        return;
      }

      game.gamekey = await this.reserveGameKey(game.id)

      const safeName = game.name.replaceAll(' ', '-');
      const archiveFile = safeName + '.zip';
      const progressStore = useProgressStore();
      progressStore.active = true;
      try {
        const url = serverAddressStore.serverAddress + game.archives
        await functions.download(progressStore.setProgress, progressStore.setActive, url, archiveFile);
        await functions.unzip(progressStore.setProgress, progressStore.setActive, archiveFile, safeName);
        await functions.run(progressStore.setProgress, progressStore.setActive, safeName, game.install,{GAME_KEY: game.gamekey?.key ?? ''});
        await functions.clearTemp(progressStore.setProgress);
        game.isInstalled = true;
        alerts.showSuccess({ title: 'Install Success', description: 'Game installed successfully!' });
      } catch (error) {
        logger.error(error);
        alerts.showError({ title: 'Install Failed', description: 'Failed to install game.<br>' + (error instanceof Error ? error.message : '') });
      } finally {
        progressStore.active = false;
      }
    },
    async uninstallArchive() {
      const alerts = useAlerts();
      const keyid = this.selectedGame?.gamekey?.id;
      if( keyid) {
        logger.log('Releasing game key:', keyid);
        await axios.post(`${useServerAddressStore().serverAddress}/api/games/${this.selectedGameId}/keys/${keyid}/release`);
        this.selectedGame.gamekey = void 0;
        logger.log('Game key released:', keyid);
      }
      const progressStore = useProgressStore();
      progressStore.active = false;
      const game = this.games.find((game) => game.id === this.selectedGameId);
      if (!game) {
        alerts.showError({ title: 'Uninstall Failed', description: 'Game not found for uninstall.' });
        return;
      }
      const safeName = game.name.replaceAll(' ', '-');
      try {
        await functions.run(progressStore.setProgress, progressStore.setActive, safeName, game.uninstall);
        await functions.removeGame(progressStore.setProgress, progressStore.setActive, safeName);
        game.isInstalled = false;
        alerts.showSuccess({ title: 'Uninstall Success', description: 'Game uninstalled successfully!' });
      } catch (error) {
        logger.error(error);
        alerts.showError({ title: 'Uninstall Failed', description: 'Failed to uninstall game.' });
      } finally {
        progressStore.active = false;
      }
    },
    async loadGames() {
      const serverAddressStore = useServerAddressStore();
      const alerts = useAlerts();
      try {
        const response = await axios.get(`${serverAddressStore.serverAddress}/api/games`,{
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const gamesData = response.data;
        this.games = await this._addInstallStatusToGames(gamesData.data);
      } catch (error) {
        logger.error('Failed to load games:', error);
        alerts.showError({ title: 'Load Failed', description: 'Failed to load games.' });
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
