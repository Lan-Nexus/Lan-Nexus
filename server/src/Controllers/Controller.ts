import { Request, Response } from 'express';
import { StatusCodes,ReasonPhrases } from "http-status-codes";

type ReasonPhrasesKeys = keyof typeof ReasonPhrases;

export abstract class Controller {
    read(req: Request, res: Response): Promise<void> {
        throw new Error('Method not implemented.');
    }

    list(req: Request, res: Response): Promise<void> {
        throw new Error('Method not implemented.');
    }

    create(req: Request, res: Response): Promise<void> {
        throw new Error('Method not implemented.');
    }

    update(req: Request, res: Response): Promise<void> {
        throw new Error('Method not implemented.');
    }

    delete(req: Request, res: Response): Promise<void> {
        throw new Error('Method not implemented.');
    }

    sendStatus(res: Response, status: StatusCodes): void {
      const statusString: string = StatusCodes[status];
      res.status(status).send(ReasonPhrases[statusString as keyof typeof ReasonPhrases]);
  }


}
