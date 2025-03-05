import Model from './Model.js';
import { gamesTable } from '../db/schema.js';
import { db } from '../db.js';
import axios from 'axios';
import type { steamOwnedGame, SteamResponseAppDetails, SteamResponseOwnGames } from '../types/Steam.js';

export default class SteamModel extends Model {

    static async create(data: { appID: number }) {
        console.log('data', data);
        const [game, icon] = await Promise.all([this.#getSteamGameData(data.appID), this.#getSteamGameIcon(data.appID)])
        const gameData = {
            gameID: game.steam_appid.toString(),
            name: game.name,
            icon: icon,
            headerImage: game.header_image,
            bannerImage: game.background_raw,
            description: game.detailed_description,
            type: 'steam',
        };
        return db.insert(gamesTable).values(gameData).$returningId();
    }

    static list(): Promise<steamOwnedGame[]> {
        return this.#getOwnedGames();
    }

    static async read(id: undefined): Promise<void> {
        throw new Error('Method not implemented.');
    }


    static async update(id: undefined, data: undefined): Promise<void> {
        throw new Error('Method not implemented.');
    }

    static async delete(id: undefined): Promise<void> {
        throw new Error('Method not implemented.');
    }

    static async #getOwnedGames() {
        const response = await axios.get<SteamResponseOwnGames>(
            `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`, {
            params: {
                key: process.env.STEAM_API_KEY,
                steamid: process.env.STEAM_USER_ID,
                include_appinfo: true,
                include_played_free_games: true,
            }
        });
        if (!response.data.response.games) {
            throw new Error('Game not found');
        }
        return response.data.response.games;
    }

    static async #getSteamGameIcon(appID: number) {
        const ownGames = await this.#getOwnedGames()
        console.log('response', appID);
        const filter = ownGames.filter((game: any) => game.appid === appID);
        console.log('filter', filter);
        return `http://media.steampowered.com/steamcommunity/public/images/apps/${appID}/${filter[0].img_icon_url}.jpg`;
    }

    static async #getSteamGameData(appID: number) {
        const response = await axios.get<SteamResponseAppDetails>(`http://store.steampowered.com/api/appdetails?appids=${appID}`);
        if (!response.data[appID].success) {
            throw new Error('Game not found');
        }
        return response.data[appID].data;
    }
}
