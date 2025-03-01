import { Request, Response } from 'express';
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
}