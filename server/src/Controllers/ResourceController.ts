import { Controller } from "./Controller.js";
import { Request, Response } from "express";
import { ZodObject, ZodSchema } from "zod";
import { StatusCodes,ReasonPhrases } from "http-status-codes";

export abstract class ResourceController extends Controller {
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
    super();
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
}
