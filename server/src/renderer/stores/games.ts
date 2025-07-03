import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export type getGameType = {
    id?: number,
    gameID: string, // Unique identifier for the game
    name: string,
    description: string,
    icon?: string,
    logo?: string,
    headerImage?: string,
    imageCard?: string,
    heroImage?: string,
    archives?: string, // Path to uploaded archive
    type: string,
    install: string, // Install script
    uninstall: string, // Uninstall script
    play: string, // Play script
    needsKey: string,
    executable: string, // Path to the executable file
    status: string,
    keys: string[]
};

export type postGameType = {
    id?: number,
    gameID: string, // Unique identifier for the game
    name: string,
    description: string,
    icon?: File,
    logo?: File,
    headerImage?: File,
    imageCard?: File,
    heroImage?: File,
    archives?: File, // Path to uploaded archive
    type: string,
    install: string, // Install script
    uninstall: string, // Uninstall script
    play: string, // Play script
    needsKey: string,
    executable: string, // Path to the executable file
    status: string,
    keys: string[]
};

export const useGamesStore = defineStore('games', {
    state: () => ({
        games: [] as getGameType[],
    }),
    actions: {
        async getGames() {
            const response = await axios.get<{ data: getGameType[] }>('/api/games')
            this.games = response.data.data
        },

        async deleteGame(gameId: number) {
            try {
                await axios.delete(`/api/games/${gameId}`);
                this.games = this.games.filter(game => game.id !== gameId);
            } catch (error) {
                console.error("Error deleting game:", error);
            }
        },

        async createGame(gameData: postGameType) {
            const formData = new FormData();

            for (const key in gameData) {
                const typedKey = key as keyof postGameType;
                if (gameData[typedKey] !== undefined) {
                    formData.append(key, gameData[typedKey] as any);
                }
            }

            const response = await axios.post<{ data: postGameType }>('/api/games', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });
            this.games.push(response.data.data as getGameType)
        }
    }
});
