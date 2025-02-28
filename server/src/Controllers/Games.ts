
import { gamesInsertSchema, gamesSelectSchema, gamesUpdateSchema } from '../db/schema.js';
import { Request, Response } from 'express';
import GameModel from '../Models/Game.js';


export default class GamesController {

  public async read(req: Request, res: Response) {
    try {
      const { id } = await gamesSelectSchema
        .pick({ id: true })
        .parseAsync({ id: Number(req.params.id) });

      const results = await GameModel.read(id);
      if (results == void 0) {
        return res.status(404).send({ message: 'Game not found' });
      }

      res.send(results);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public async list(req: Request, res: Response) {
    const data = await GameModel.list();
    res.send(data);
  }

  public async create(req: Request, res: Response) {

    try {
      const data = await gamesInsertSchema.parseAsync(req.body);
      const results = await GameModel.create(data);

      res.send(results);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const data = await gamesUpdateSchema.parseAsync({
        ...req.body,
        id: req.params.id
      });

      await GameModel.update(data.id, data);

      res.send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = await gamesSelectSchema
        .pick({ id: true })
        .parseAsync({ id: Number(req.params.id) });

      const results = await GameModel.read(id);
      if (results == void 0) {
        return res.status(404).send('Game not found');
      }

      await GameModel.delete(id);

      res.status(204).send();
    } catch (error) {
      res.status(400).send(error);
    }
  }
}
