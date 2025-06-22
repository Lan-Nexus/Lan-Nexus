import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { gameKeysTable } from '../../db/schema.js';
import GameKeyModel from '../../Models/GameKey.js';
import GameModel from '../../Models/Game.js';
import { PageController } from '../PageController.js';
import { Request, Response } from "express";

export const gameKeysSelectSchema = createSelectSchema(gameKeysTable);
export const gameKeysInsertSchema = createInsertSchema(gameKeysTable);
export const gameKeysUpdateSchema = createUpdateSchema(gameKeysTable);

export default class GameKeyApiController extends PageController {

  static views = {
    create: 'games/_gameKeys',
    delete: 'games/_gameKeys',
  };

  constructor() {
    super(GameKeyModel, gameKeysSelectSchema, gameKeysInsertSchema, gameKeysUpdateSchema);
  }

  public async postCreate(req: Request, res: Response): Promise<void> {
    this.otherData.gameKeys = await GameKeyModel.listByGame(Number(req.params.gameId));
  }

  public async postDelete(req: Request, res: Response): Promise<void> {
    this.otherData.gameKeys = await GameKeyModel.listByGame(Number(req.params.gameId));
  }

  public mapRequestBody(body: any, req: Request, res: Response): any {
    if (typeof body.gameId === 'string') {
      body.gameId = Number(body.gameId);
    }
    return body;
  }
}
