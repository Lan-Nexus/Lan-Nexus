import Model from './Model.js';
import axios from 'axios';
import { SteamDBGameImage, SteamDBGameSearch } from '../types/SteamDB.js';
import GameModel from './Game.js';

// Create an Axios instance
const steamGridDb = axios.create({
    baseURL: 'https://www.steamgriddb.com/api/v2',
    headers: {
        'Authorization': `Bearer ${process.env.STEAM_GRID_ID_KEY}`
    },
    params: {
        "types": "static",
        "limit": 50,
        "style": "official"
    }
});


export default class GameSearchModel extends Model {

    static async read(gameID: string) {

        const game = steamGridDb.get<SteamDBGameImage>(`/games/id/${gameID}`);
        const icons = steamGridDb.get<SteamDBGameImage>(`/icons/game/${gameID}`);
        const logos = steamGridDb.get<SteamDBGameImage>(`/logos/game/${gameID}`);
        const heroes = steamGridDb.get<SteamDBGameImage>(`/heroes/game/${gameID}`, {
            params: {
                "dimensions": "1920x620"
            }
        });
        const grids = steamGridDb.get<SteamDBGameImage>(`/grids/game/${gameID}`, {
            params: {
                "dimensions": "600x900"
            }
        });
        const header = steamGridDb.get<SteamDBGameImage>(`/grids/game/${gameID}`, {
            params: {
                "dimensions": "460x215"
            }
        });

        const [gameResponse, iconsResponse, logosResponse, heroesResponse, gridsResponse, headerResponse] = await Promise.all([game, icons, logos, heroes, grids, header]);

        console.log(gameResponse.data.data);
        return {
            game: gameResponse.data.data,
            icon: iconsResponse.data.data,
            logo: logosResponse.data.data,
            hero: heroesResponse.data.data,
            grid: gridsResponse.data.data,
            card: headerResponse.data.data
        };

    }

    static create(game: Parameters<typeof GameModel.create>[0]) {
        console.log("Creating game", game);
        return GameModel.create(game);
    }

    static async list() {
        return GameModel.list();
    }

    static async search(query: string) {
        const response = await steamGridDb.get<SteamDBGameSearch>(`/search/autocomplete/${query}`);
        return response.data;
    }

}
