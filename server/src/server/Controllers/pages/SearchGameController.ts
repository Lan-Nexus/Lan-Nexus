import { PageController } from '../PageController.js';
import { gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema } from '../../db/schema.js';
import GameSearchModel from '../../Models/GameSearch.js';
import { Request, Response } from 'express';

export default class SearchGameController extends PageController {
    static views = {
        list: 'games/search',
        read: 'search/selectedGame',
    };

    constructor() {
        super(GameSearchModel, gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema);
    }

}
