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

  async postList(req: Request, res: Response, games: any[]) {
    for (const game of games) {
      game.keys = await GameKeyModel.listByGame(game.id);
      if (typeof req.query.clientId === "string") {
        game.gamekey = await GameKeyModel.myKey(game.id, req.query.clientId);
      }
    }
  }
}
