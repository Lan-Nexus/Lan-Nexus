import SteamModel from '../../Models/Steam.js';
import GameModel from '../../Models/Game.js';
import { PageController } from '../PageController.js';
import { Request, Response } from 'express';
import { gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema } from '../../db/schema.js';

export default class SteamPagesController extends PageController {
  static views = {
    list: 'games/steam',
  };

  constructor() {
    super(SteamModel, gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema);
  }

  async preList(req: Request, res: Response) {
    const existingGames = await GameModel.list();
    this.otherData.existingSteamIDs = existingGames.map(g => g.gameID);
  }
}
