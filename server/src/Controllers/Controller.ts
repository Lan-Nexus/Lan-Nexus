import { Request, Response } from 'express';
export abstract class Controller {
    public read(req: Request, res: Response): void {
        throw new Error('Method not implemented.');
    }

    public list(req: Request, res: Response): void {
        throw new Error('Method not implemented.');
    }

    public create(req: Request, res: Response): void {
        throw new Error('Method not implemented.');
    }

    public update(req: Request, res: Response): void {
        throw new Error('Method not implemented.');
    }

    public delete(req: Request, res: Response): void {
        throw new Error('Method not implemented.');
    }
}