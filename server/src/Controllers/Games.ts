import {
  gamesInsertSchema,
  gamesSelectSchema,
  gamesUpdateSchema,
} from "../db/schema.js";
import GameModel from "../Models/Game.js";
import GameKeyModel from "../Models/GameKey.js";
import { ResourceController } from "./ResourceController.js";
import { Request, Response } from "express";

export default class GamesController extends ResourceController {
  constructor() {
    super(GameModel, gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema);
  }

  async list(_req: Request, res: Response) {
    const games = await this.model.list();
    for (const game of games) {
      game.keys = await GameKeyModel.listByGame(game.id);
    }
    res.send(games);
  }
}
