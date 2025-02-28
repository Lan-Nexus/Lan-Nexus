import { Request, Response } from 'express';
import { gamesTable } from '../db/schema';
import { db } from '../db';
 
export default {

  create: async (req: Request, res: Response) => { 
    await db.insert(gamesTable).values({ name: 'Hello World!' });
    res.send('Hello World!')
  },

  read:(req: Request, res: Response) => {
    const id = req.params.id;

    res.send(id)
  },

  update:(req: Request, res: Response) => {
    const id = req.params.id;

    res.send(id)
  },

  delete:(req: Request, res: Response) => {
    const id = req.params.id;

    res.send(id)
  },

  list: async (req: Request, res: Response) => {
      console.log('Fetching games from the database...');
      const games = await db.select().from(gamesTable);
      console.log('Games fetched:', games);
      res.json(games);
  },
}

