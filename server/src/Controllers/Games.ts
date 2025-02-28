
import { gamesInsertSchema, gameIdSchema,gamesUpdateSchema } from '../db/schema.js';
import { Request, Response } from 'express';
import GameModel from '../Models/Game.js';


export default class GamesController {

  public async create(req: Request, res: Response) {

    const data = await gamesInsertSchema.parseAsync(req.body).catch((error) => {
      res.status(400).send(error);
      return;
    });

    if (!data) {
      res.status(400).send('Invalid data');
      return;
    }

    await GameModel.create(data);

    res.send(data);
  }

  public async read(req: Request, res: Response) {

    const data = await GameModel.read(Number(req.params.id));

    res.send(data);
  }

  public async update(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).send('Invalid id');
    }

    const data = await gamesUpdateSchema.parseAsync({
      ...req.body,
      id: req.params.id
    });
      
    await GameModel.update(id, data);
    res.send(data);
  }

  public async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).send('Invalid id');
    }

    if (!await GameModel.read(id)) {
      return res.status(404).send('Game not found');
    }

    await GameModel.delete(id);

    res.status(204).send();
  }

  public async list(req: Request, res: Response) {
    const data = await GameModel.list();

    res.send(data);
  }

}
