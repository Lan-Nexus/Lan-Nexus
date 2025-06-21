import { Request, Response } from "express";
import { ZodSchema } from "zod";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import Model from "../Models/Model.js";

export abstract class PageController {
  protected model: any;
  protected SelectSchema: any;
  protected InsertSchema: ZodSchema;
  protected UpdateSchema: ZodSchema;

  protected static views?: Record<string, string>;
  protected static redirect?: Record<string, string | ((req: Request, res: Response, action: string) => string)>;
  protected static errorViews?: Record<string, string>;

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

  protected localRender(res: Response, view: string, options: any = {}) {
    const lastPart = view.split('/').pop() || '';
    if (lastPart.startsWith('_')) {
      options.layout = false;
    }
    res.render(view, options);
  }

  protected handleHxRedirect(req: Request, res: Response, action: string): boolean {
    const redirect = (this.constructor as typeof PageController).redirect;
    const redirectValue = redirect?.[action];
    if (!req.get('HX-Request') || !redirectValue) return false;

    if (typeof redirectValue === 'function') {
      const url = redirectValue(req, res, action);
      if (url) res.set('HX-Redirect', url);
    } else {
      res.set('HX-Redirect', redirectValue);
    }
    res.status(204).end();
    return true;
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
      const views = (this.constructor as typeof PageController).views;
      if (this.handleHxRedirect(req, res, 'read')) return;
      if (views?.read) {
        this.localRender(res, views.read, { data: results });
      } else {
        res.send(results);
      }
    } catch (error) {
      this.sendStatus(res, StatusCodes.BAD_REQUEST, error);
    }
  }

  public async list(req: Request, res: Response) {
    const data = await this.model.list();
    const views = (this.constructor as typeof PageController).views;
    if (this.handleHxRedirect(req, res, 'list')) return;
    if (views?.list && views.list.startsWith('_')) {
      res.render(views.list, { data, layout: false });
    } else if (views?.list) {
      this.localRender(res, views.list, { data });
    } else {
      res.send(data);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = this.mapRequestBody(req.body, req, res);
      const data = await this.InsertSchema.parseAsync(body)
      const results = await this.model.create(data);
      const views = (this.constructor as typeof PageController).views;
      if (this.handleHxRedirect(req, res, 'create')) return;
      if (views?.create && views.create.startsWith('_')) {
        res.render(views.create, { data: results, layout: false });
      } else if (views?.create) {
        this.localRender(res, views.create, { data: results });
      } else {
        res.send(results);
      }
    } catch (error) {
      this.sendStatus(res, StatusCodes.BAD_REQUEST, error);
    }
  }

  public async update(req: Request, res: Response) {
    const body = this.mapRequestBody(req.body, req, res);
    try {
      const data = await this.UpdateSchema.parseAsync({
        ...body,
        id: Number(req.params.id),
      });
      await this.model.update(data.id, data);
      const views = (this.constructor as typeof PageController).views;
      if (this.handleHxRedirect(req, res, 'update')) return;
      if (views?.update && views.update.startsWith('_')) {
        res.render(views.update, { data, layout: false });
      } else if (views?.update) {
        this.localRender(res, views.update, { data });
      } else {
        res.send(data);
      }
    } catch (error) {
      this.sendStatus(res, StatusCodes.BAD_REQUEST, error, { ...body,id: Number(req.params.id) });
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
      if (this.handleHxRedirect(req, res, 'delete')) return;
      this.sendStatus(res, StatusCodes.NO_CONTENT);
    } catch (error) {
      this.sendStatus(res, StatusCodes.BAD_REQUEST, error);
    }
  }

  public async renderCreateForm(req: Request, res: Response) {
    const views = (this.constructor as typeof PageController).views;
    if (this.handleHxRedirect(req, res, 'createForm')) return;
    if (views?.createForm && views.createForm.startsWith('_')) {
      res.render(views.createForm, { layout: false });
    } else if (views?.createForm) {
      this.localRender(res, views.createForm);
    } else {
      this.sendStatus(res, StatusCodes.INTERNAL_SERVER_ERROR, "Create form view not found");
    }
  }

  public  async renderUpdateForm(req: Request, res: Response) {
    const data = await this.model.read(Number(req.params.id));
    if (data == void 0) {
      this.sendStatus(res, StatusCodes.NOT_FOUND);
      return;
    }
    const views = (this.constructor as typeof PageController).views;
    if (this.handleHxRedirect(req, res, 'updateForm')) return;
    if (views?.updateForm && views.updateForm.startsWith('_')) {
      res.render(views.updateForm, { data, layout: false });
    } else if (views?.updateForm) {
      this.localRender(res, views.updateForm, { data });
    } else {
      data.id = Number(req.params.id); 
      this.sendStatus(res, StatusCodes.INTERNAL_SERVER_ERROR, "Update form view not found",data);
    }
  }
  
  sendStatus(res: Response, status: StatusCodes, error?: any, data?: any): void {
    const errorViews = (this.constructor as typeof PageController).errorViews;
    const statusString: string = StatusCodes[status];
    const reason: string = ReasonPhrases[statusString as keyof typeof ReasonPhrases];

    if (errorViews && errorViews[statusString]) {
      const view = errorViews[statusString];
      const lastPart = view.split('/').pop() || '';
      const renderOptions: any = { status: statusString, reason, error, data };
      if (lastPart.startsWith('_')) {
        renderOptions.layout = false;
      }
      res.status(status).render(view, renderOptions);
    } else {
      res.status(status).send({ status: statusString, reason, error });
    }
  }

  public mapRequestBody(body: any, req: Request, res: Response): any {
    console.warn("mapRequestBody method not implemented in PageController, using default implementation");
    return body;
  }
}
