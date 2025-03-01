import { Request, Response } from "express";
import { ZodObject, ZodSchema } from "zod";

export abstract class Controller {
  protected model: any;
  protected SelectSchema: any;
  protected InsertSchema: ZodSchema;
  protected UpdateSchema: ZodSchema;

  constructor(
    model: any,
    SelectSchema: ZodSchema,
    InsertSchema: ZodSchema,
    UpdateSchema: ZodSchema,
  ) {
    this.model = model;
    this.SelectSchema = SelectSchema;
    this.InsertSchema = InsertSchema;
    this.UpdateSchema = UpdateSchema;
  }

  public async read(req: Request, res: Response) {
    try {
      const { id } = await this.SelectSchema.pick({ id: true }).parseAsync({
        id: Number(req.params.id),
      });

      const results = await this.model.read(id);
      if (results == void 0) {
        res.status(404).send({ message: "Game not found" });
        return;
      }

      res.send(results);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public async list(req: Request, res: Response) {
    const data = await this.model.list();
    res.send(data);
  }

  public async create(req: Request, res: Response) {
    try {
      const data = await this.InsertSchema.parseAsync(req.body);
      const results = await this.model.create(data);

      res.send(results);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const data = await this.UpdateSchema.parseAsync({
        ...req.body,
        id: req.params.id,
      });

      await this.model.update(data.id, data);

      res.send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = await this.SelectSchema.pick({ id: true }).parseAsync({
        id: Number(req.params.id),
      });

      const results = await this.model.read(id);
      if (results == void 0) {
        res.status(404).send("Game not found");
        return;
      }

      await this.model.delete(id);

      res.status(204).send();
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

