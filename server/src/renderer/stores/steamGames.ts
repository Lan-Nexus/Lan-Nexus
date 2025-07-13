import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';
import { useGamesStore } from './games';

import api from '../utls/api'


export type SteamGameType = {
    "appid": number,
    "name": string,
    "playtime_forever": number,
    "img_icon_url": string,
    "playtime_windows_forever": number,
    "playtime_mac_forever": number,
    "playtime_linux_forever": number,
    "playtime_deck_forever": number,
    "rtime_last_played": number,
    "playtime_disconnected": number,
    "content_descriptorids": number[],
}


export const useSteamGamesStore = defineStore('steamGames', {
    state: () => ({
        _gamesLoaded: false,
        steamGames: [] as SteamGameType[], // Replace 'any' with your specific type if available
    }),

    getters: {
        hasGame: (state) => {
            return (gameId: string) => {
                if (!state._gamesLoaded) {
                    state._gamesLoaded = true;
                    useGamesStore().getGames();
                    return true; // If no games are loaded, return false
                }
                return useGamesStore().hasGame(gameId);
            }
        }
    },

    actions: {
        async getSteamGames() {
            const response = await api.get('/api/steam');
            this.steamGames = response.data.data;
        },

        async addGame(steamGame: any) {
            await api.post('/api/steam', {
                appID: steamGame.appid,
            });
            await useGamesStore().getGames();

        }
    },
});
