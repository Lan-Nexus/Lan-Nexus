import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { gameKeysTable } from '../db/schema.js';
import GameKeyModel from '../Models/GameKey.js';
import GameModel from '../Models/Game.js';
import { PageController } from './PageController.js';
import { Request, Response } from "express";

export const gameKeysSelectSchema = createSelectSchema(gameKeysTable);
export const gameKeysInsertSchema = createInsertSchema(gameKeysTable);
export const gameKeysUpdateSchema = createUpdateSchema(gameKeysTable);

export default class GameKeyPageController extends PageController {
  static views = {
    list: 'gameKeys/index',
    createForm: 'gameKeys/new',
    updateForm: 'gameKeys/edit',
  };

  static redirect = {
    create: (req: Request, res: Response) => `/games/${req.params.gameId}/keys`,
    update: (req: Request, res: Response) => `/games/${req.params.gameId}/keys`,
    delete: (req: Request, res: Response) => `/games/${req.params.gameId}/keys`,
  };

  constructor() {
    super(GameKeyModel, gameKeysSelectSchema, gameKeysInsertSchema, gameKeysUpdateSchema);
  }

  async list(req: Request, res: Response) {
    const gameId = Number(req.params.gameId);
    const game = await GameModel.readById(gameId);
    const keys = await this.model.listByGame(gameId);
    this.localRender(res, (this.constructor as typeof GameKeyPageController).views.list, { game, keys });
  }

  async renderCreateForm(req: Request, res: Response) {
    const gameId = Number(req.params.gameId);
    const game = await GameModel.readById(gameId);
    this.localRender(res, (this.constructor as typeof GameKeyPageController).views.createForm, { game });
  }

  async renderUpdateForm(req: Request, res: Response) {
    const gameId = Number(req.params.gameId);
    const game = await GameModel.readById(gameId);
    const key = await this.model.read(Number(req.params.id));
    this.localRender(res, (this.constructor as typeof GameKeyPageController).views.updateForm, { game, key });
  }

  public mapRequestBody(body: any, req: Request, res: Response): any {
    if (typeof body.gameId === 'string') {
      body.gameId = Number(body.gameId);
    }
    return body;
  }
}
