import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { gameKeysTable } from '../../db/schema.js';
import GameKeyModel from '../../Models/GameKey.js';
import GameModel from '../../Models/Game.js';
import { PageController } from '../PageController.js';
import { Request, Response } from "express";
import Ip from '../../ip.js';

export const gameKeysSelectSchema = createSelectSchema(gameKeysTable);
export const gameKeysInsertSchema = createInsertSchema(gameKeysTable);
export const gameKeysUpdateSchema = createUpdateSchema(gameKeysTable);

export default class GameKeyApiController extends PageController {

  static views = {
    create: 'games/_gameKeys',
    delete: 'games/_gameKeys',
    release: 'games/_gameKeys',
    reserve: 'games/_gameKeys',
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

  public async release (req: Request, res: Response): Promise<void> {
    const KeyId = Number(req.params.id);
    await GameKeyModel.release(KeyId);
    this.otherData.gameKeys = await GameKeyModel.listByGame(Number(req.params.gameId));
    this.renderWithViews(res, 'release', {});
  }

  public async reserve(req: Request, res: Response): Promise<void> {
    let KeyId = Number(req.params.id); 

    const ip = Ip(req, res);
  
    if(isNaN(KeyId)) {
      const nextKey = await GameKeyModel.getNextAvailableKey(Number(req.params.gameId));
      KeyId = nextKey.id;
    }

    await GameKeyModel.reserve(KeyId,ip);
    this.otherData.gameKeys = await GameKeyModel.listByGame(Number(req.params.gameId));
    const gamekey = await GameKeyModel.read(KeyId);
    this.renderWithViews(res, 'reserve', {...gamekey, ipAddress: ip});
  }

  public mapRequestBody(body: any, req: Request, res: Response): any {
    if (typeof body.gameId === 'string') {
      body.gameId = Number(body.gameId);
    }
    return body;
  }
}
