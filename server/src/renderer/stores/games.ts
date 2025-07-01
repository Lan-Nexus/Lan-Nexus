import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
export type GameType = {
    id: number,
    gameID: string, // Unique identifier for the game
    name: string,
    description: string,
    icon: string,
    logo: string,
    headerImage: string,
    imageCard: string,
    heroImage: string,
    archives: string, // Path to uploaded archive
    type: string,
    install: string, // Install script
    uninstall: string, // Uninstall script
    play: string, // Play script
    needsKey: number, // 0 = no key needed, 1 = key needed
    executable: string, // Path to the executable file
    status: string,
    keys: string[]
};

export const useGamesStore = defineStore('games', {
    state: () => ({
        games: [] as GameType[],
    }),
    actions: {
        async getGames() {
            const response = await axios.get<{ data: GameType[] }>('/api/games')
            this.games = response.data.data
        }
    }
});
