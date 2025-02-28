import { Request, Response } from 'express';

export default class Games {

  public create(req: Request, res: Response) {
    res.send('Create Game');
  }

  public read(req: Request, res: Response) {
    res.send('Read Game');
  }

  public update(req: Request, res: Response) {
    res.send('Update Game');
  }

  public delete(req: Request, res: Response) {
    res.send('Delete Game');
  }

  public list(req: Request, res: Response) {
    res.send('List Games');
  }
}
