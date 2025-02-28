
import { gamesInsertSchema, gameIdSchema,gamesUpdateSchema } from '../db/schema.js';
import { Request, Response } from 'express';
import GameNodel from '../Models/Game.js';


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

    await GameNodel.create(data);

    res.send(data);
  }

  public async read(req: Request, res: Response) {

    const data = await GameNodel.read(Number(req.params.id));

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
    }).catch((error) => {
      res.status(400).send(error);
      return;
    });

    if (!data) {
      res.status(400).send('Invalid data');
      return;
    }

     if (!data.id || !data.name) {
      return res.status(400).send('Missing required fields');
    }
     
    await GameNodel.update(id,data);

    res.send('Update Game');
  }

  public delete(req: Request, res: Response) {
    res.send('Delete Game');
  }

  public list(req: Request, res: Response) {
    res.send('List Games');
  }

}
