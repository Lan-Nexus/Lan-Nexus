import {
  gamesInsertSchema,
  gamesSelectSchema,
  gamesUpdateSchema,
} from "../../db/schema.js";
import GameModel from "../../Models/Game.js";
import GameKeyModel from "../../Models/GameKey.js";
import { Request, Response } from "express";
import { PageController } from "../PageController.js";
import Ip from "../../ip.js";

export default class GamesController extends PageController {

  
  constructor() {
    super(GameModel, gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema);
  }

  async postList(_req: Request, res: Response, games: any[]) {
    const ip = Ip(_req, res);
    for (const game of games) {
      game.keys = await GameKeyModel.listByGame(game.id);
      game.gamekey = await GameKeyModel.myKey(game.id, ip);
    }
  }
}
