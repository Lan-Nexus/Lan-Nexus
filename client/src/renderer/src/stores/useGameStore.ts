import { defineStore } from 'pinia';
import axios from 'axios';
import functions from '../functions.js';

import { useProgressStore } from './useProgress.js';

type archives = {
  id: number;
  name: string;
  file: string;
  isInstalled: boolean;
};

type gameState = {
  description: string;
  gameID: string;
  id: number;
  name: string;
  selectedArchive: number;
  type: string;
  archives: archives[];
};

export const useGameStore = defineStore('game', {
  state: () => ({
    games: [] as gameState[],
    selectedGameId: 1,
  }),
  getters: {
    selectedGame: (state) => {
      const game = state.games.find((game) => game.id === state.selectedGameId);
      if (game) {
        console.log(game.name);
        return game;
      }
      return void 0;
    },
    selectedArchive: (state) => {
      const game = state.games.find((game) => game.id === state.selectedGameId);
      if (game) {
        const archive = game.archives.find((archive) => archive.id === game.selectedArchive);
        if (archive) {
          console.log(archive.name);
          return archive;
        }
      }
      return void 0;
    },
  },
  actions: {
    selectGame(id) {
      this.selectedGameId = id;
    },
    async installArchive() {
      const game = this.games.find((game) => game.id === this.selectedGameId);
      const archive = game!.archives.find((archive) => archive.id === game!.selectedArchive);
      if (archive === void 0) {
        return;
      }

      const safeName = game!.name.replaceAll(' ', '-');
      const archiveFile = safeName + '/' + archive.name;

      const progressStore = useProgressStore();
      progressStore.active = true;

      try {
        await functions.download(progressStore.setProgress, archive.file, archiveFile + '.zip');
        await functions.unzip(progressStore.setProgress, archiveFile + '.zip', archiveFile);
        await functions.run(progressStore.setProgress, archiveFile, 'install');
        await functions.clearTemp(progressStore.setProgress);
      } catch (error) {
        console.error(error);
      } finally {
        progressStore.active = false;
      }

      archive.isInstalled = true;
    },
    async uninstallArchive() {
      const progressStore = useProgressStore();
      progressStore.active = false;
      const game = this.games.find((game) => game.id === this.selectedGameId);
      if (game === void 0) {
        return;
      }
      const archive = game.archives.find((archive) => archive.id === game.selectedArchive);
      if (archive === void 0) {
        return;
      }

      const safeName = game.name.replaceAll(' ', '-');
      const archiveFile = safeName + '/' + archive.name;

      try {
        await functions.run(progressStore.setProgress, archiveFile, 'uninstall');
        await functions.removeGame(progressStore.setProgress, archiveFile);
      } catch (error) {
        console.error(error);
      } finally {
        progressStore.active = false;
      }

      archive.isInstalled = false;
    },
    loadGames() {
      axios.get('http://localhost:3000/api/games').then((response) => {
        this.games = response.data;
      });
    },
    async play() {
      const selectedGame = this.selectedGame;
      if (selectedGame && selectedGame.type === 'steam') {
        document.location.href = `steam://run/${selectedGame.gameID}`;
      }
      if (selectedGame && selectedGame.type === 'zip') {
        const game = this.games.find((game) => game.id === this.selectedGameId);
        if (game === void 0) {
          return;
        }
        const archive = game!.archives.find((archive) => archive.id === game.selectedArchive);
        if (archive === void 0) {
          return;
        }
        const safeName = game!.name.replaceAll(' ', '-');
        const archiveFile = safeName + '/' + archive.name;
        await functions.run(useProgressStore().setProgress, archiveFile, 'play');
      }
    },
  },
});
