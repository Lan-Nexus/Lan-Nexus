import { Request, Response } from 'express';
export default {

  create:(req: Request, res: Response) => { 
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

  list:(req: Request, res: Response) => {
      res.send('Hello World!')
  },
}

