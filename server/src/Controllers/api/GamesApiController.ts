import {
  gamesInsertSchema,
  gamesSelectSchema,
  gamesUpdateSchema,
} from "../../db/schema.js";
import GameModel from "../../Models/Game.js";
import GameKeyModel from "../../Models/GameKey.js";
import { Request, Response } from "express";
import { PageController } from "../PageController.js";

export default class GamesController extends PageController {
  constructor() {
    super(GameModel, gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema);
  }

  async List(_req: Request, res: Response) {
    const games = await this.model.list();
    for (const game of games) {
      game.keys = await GameKeyModel.listByGame(game.id);
    }
    res.send(games);
  }
}
