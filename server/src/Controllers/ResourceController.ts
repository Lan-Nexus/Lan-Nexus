import { Request, Response } from "express";
import { ZodSchema } from "zod";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import Model from "../Models/Model.js";

export abstract class ResourceController {
  protected model: any;
  protected SelectSchema: any;
  protected InsertSchema: ZodSchema;
  protected UpdateSchema: ZodSchema;

  constructor(
    model: Model,
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
        this.sendStatus(res, StatusCodes.NOT_FOUND);
        return;
      }

      res.send(results);
    } catch (error) {
      this.sendStatus(res, StatusCodes.BAD_REQUEST);
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
      this.sendStatus(res, StatusCodes.BAD_REQUEST);
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
      this.sendStatus(res, StatusCodes.BAD_REQUEST);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = await this.SelectSchema.pick({ id: true }).parseAsync({
        id: Number(req.params.id),
      });

      const results = await this.model.read(id);
      if (results == void 0) {
        this.sendStatus(res, StatusCodes.NOT_FOUND);
        return;
      }

      await this.model.delete(id);

      this.sendStatus(res, StatusCodes.NO_CONTENT);
    } catch (error) {
      this.sendStatus(res, StatusCodes.BAD_REQUEST);
    }
  }

  sendStatus(res: Response, status: StatusCodes): void {
    const statusString: string = StatusCodes[status];
    res.status(status).send(ReasonPhrases[statusString as keyof typeof ReasonPhrases]);
  }
}
