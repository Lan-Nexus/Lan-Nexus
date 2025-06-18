import SteamModel from '../Models/Steam.js';
import GameModel from '../Models/Game.js';
import { PageController } from './PageController.js';
import { Request, Response } from 'express';
import { gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema } from '../db/schema.js';

export default class SteamPagesController extends PageController {
  static views = {
    list: 'games/steam',
  };

  constructor() {
    super(SteamModel, gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema);
  }

  // Override list to render the steam games page with data
  async list(req: Request, res: Response) {
    // Get all existing Steam gameIDs in the system
    const existingGames = await GameModel.list();
    const existingSteamIDs = new Set(existingGames.map(g => g.gameID));
    res.render(SteamPagesController.views.list, { existingSteamIDs: Array.from(existingSteamIDs) });
  }
}
