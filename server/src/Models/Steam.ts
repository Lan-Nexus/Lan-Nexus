import Model from './Model.js';
import { gamesTable } from '../db/schema.js';
import { db } from '../db.js';
import axios from 'axios';
import type { steamOwnedGame, SteamResponseAppDetails, SteamResponseOwnGames } from '../types/Steam.js';

export default class SteamModel extends Model {

    static async create(data: { appID: number }) {
        const [game, icon] = await Promise.all([this.#getGameData(data.appID), this.#getIcon(data.appID)]);
        const [logo, header, libraryHero, library600x900] = await this.#getAllImages(data.appID);
        const gameData = {
            gameID: game.steam_appid.toString(),
            name: game.name,
            icon: icon,
            logo: logo,
            headerImage: header,
            imageCard: library600x900,
            heroImage: libraryHero,
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

    static #getAllImages(appID: number) {
        const logo = this.#getImageAsBase64(`https://steamcdn-a.akamaihd.net/steam/apps/${appID}/logo.png`);
        const header = this.#getImageAsBase64(`https://steamcdn-a.akamaihd.net/steam/apps/${appID}/header.jpg`);
        const libraryHero = this.#getImageAsBase64(`https://steamcdn-a.akamaihd.net/steam/apps/${appID}/library_hero.jpg`);
        const library600x900 = this.#getImageAsBase64(`https://steamcdn-a.akamaihd.net/steam/apps/${appID}/library_600x900.jpg`);
        return Promise.all([logo, header, libraryHero, library600x900]);
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

    static async #getIcon(appID: number) {
        const ownGames = await this.#getOwnedGames()
        const filter = ownGames.filter((game: any) => game.appid === appID);
        if (filter.length === 0) {
            return null;
        }
        return this.#getImageAsBase64(`http://media.steampowered.com/steamcommunity/public/images/apps/${appID}/${filter[0].img_icon_url}.jpg`);
    }

    static async #getGameData(appID: number) {
        const response = await axios.get<SteamResponseAppDetails>(`http://store.steampowered.com/api/appdetails?appids=${appID}`);
        if (!response.data[appID].success) {
            throw new Error('Game not found');
        }
        return response.data[appID.toString()].data;
    }

    static async #getImageAsBase64(imageUrl: string) {
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            return buffer.toString('base64');
        } catch (e) {
            return null;
        }
    }
}
