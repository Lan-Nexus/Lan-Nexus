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
  protected static redirect?: Record<string, string | ((req: Request, res: Response, action: string, data?: any) => string)>;
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

  protected otherData: Record<string, any> = {};

  protected localRender(res: Response, view: string, options: any = {}) {
    const lastPart = view.split('/').pop() || '';
    if (lastPart.startsWith('_')) {
      options.layout = false;
    }
    res.render(view, options);
  }

  protected handleHxRedirect(req: Request, res: Response, action: string, data?: any): boolean {
    const redirect = (this.constructor as typeof PageController).redirect;
    const redirectValue = redirect?.[action];
    if (!req.get('HX-Request') || !redirectValue) return false;

    if (typeof redirectValue === 'function') {
      const url = redirectValue(req, res, data);
      if (url) res.set('HX-Redirect', url);
    } else {
      res.set('HX-Redirect', redirectValue);
    }
    res.status(204).end();
    return true;
  }

  protected renderWithViews(res: Response, action: string, data: any) {
    const views = (this.constructor as typeof PageController).views;
    // Prefer req.headers['accept'] over res.getHeader('Accept') for request Accept header
    const acceptHeader = (res.req?.headers?.['accept'] as string | string[] | undefined) ?? '';
    const isJson = typeof acceptHeader === 'string'
      ? acceptHeader.includes('application/json')
      : Array.isArray(acceptHeader)
        ? acceptHeader.some(h => typeof h === 'string' && h.includes('application/json'))
        : false;
    if (
      isJson ||
      !views || !views[action]
    ) {
      res.send({ data, ...this.otherData });
      return;
    }
    const view = views[action];
    if (view.startsWith('_')) {
      res.render(view, { data, layout: false, ...this.otherData });
    } else {
      this.localRender(res, view, { data, ...this.otherData });
    }
  }

  protected errorRenderWithViews(res: Response, action: string, error: any, data?: any, status: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR) {
    const errorViews = (this.constructor as typeof PageController).errorViews;
    if (!errorViews || !errorViews[action]) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error });
      return;
    }
    const view = errorViews[action];
    const lastPart = view.split('/').pop() || '';
    const renderOptions: any = { error, data, ...this.otherData };
    if (lastPart.startsWith('_')) {
      renderOptions.layout = false;
    }
    res.status(status).render(view, renderOptions);
  }



  // --- Pre/Post hooks ---
  protected async preCreate(req: Request, res: Response) { }
  protected async postCreate(req: Request, res: Response, results: any): Promise<any> { return results; }
  protected async preRead(req: Request, res: Response) { }
  protected async postRead(req: Request, res: Response, results: any): Promise<any> { return results; }
  protected async preList(req: Request, res: Response) { }
  protected async postList(req: Request, res: Response, data: any): Promise<any> { return data; }
  protected async preUpdate(req: Request, res: Response) { }
  protected async postUpdate(req: Request, res: Response, data: any): Promise<any> { return data; }
  protected async preDelete(req: Request, res: Response) { }
  protected async postDelete(req: Request, res: Response, results: any): Promise<any> { return results; }

  public async create(req: Request, res: Response) {
    try {
      await this.preCreate(req, res);
      const body = this.mapRequestBody(req.body, req, res);
      const data = await this.InsertSchema.parseAsync(body)
      const results = await this.model.create(data);
      const finalResults = await this.postCreate?.(req, res, results) ?? results;
      if (this.handleHxRedirect(req, res, 'create', finalResults)) return;
      this.renderWithViews(res, 'create', finalResults);
    } catch (error) {
      this.sendStatus(res, StatusCodes.BAD_REQUEST, error);
    }
  }

  public async read(req: Request, res: Response) {
    try {
      await this.preRead(req, res);
      const { id } = await this.SelectSchema.pick({ id: true }).parseAsync({
        id: Number(req.params.id),
      });
      const results = await this.model.read(id);
      const finalResults = await this.postRead?.(req, res, results) ?? results;
      if (finalResults == void 0) {
        this.sendStatus(res, StatusCodes.NOT_FOUND);
        return;
      }
      if (this.handleHxRedirect(req, res, 'read', finalResults)) return;
      this.renderWithViews(res, 'read', finalResults);
    } catch (error) {
      this.sendStatus(res, StatusCodes.BAD_REQUEST, error);
    }
  }

  public async list(req: Request, res: Response) {
    await this.preList(req, res);
    let data = await this.model.list();
    const finalData = await this.postList?.(req, res, data) ?? data;
    if (this.handleHxRedirect(req, res, 'list', finalData)) return;
    this.renderWithViews(res, 'list', finalData);
  }

  public async update(req: Request, res: Response) {
    await this.preUpdate(req, res);
    const body = this.mapRequestBody(req.body, req, res);
    try {
      const data = await this.UpdateSchema.parseAsync({
        ...body,
        id: Number(req.params.id),
      });
      await this.model.update(data.id, data);
      const finalData = await this.postUpdate?.(req, res, data) ?? data;
      if (this.handleHxRedirect(req, res, 'update', finalData)) return;
      this.renderWithViews(res, 'update', finalData);
    } catch (error) {
      this.sendStatus(res, StatusCodes.BAD_REQUEST, error, { ...body, id: Number(req.params.id) });
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      await this.preDelete(req, res);
      const { id } = await this.SelectSchema.pick({ id: true }).parseAsync({
        id: Number(req.params.id),
      });
      const results = await this.model.read(id);
      if (results == void 0) {
        this.sendStatus(res, StatusCodes.NOT_FOUND);
        return;
      }
      await this.model.delete(id);
      const finalResults = await this.postDelete?.(req, res, results) ?? {};
      if (this.handleHxRedirect(req, res, 'delete')) return;
      this.renderWithViews(res, 'delete', finalResults);
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

  public async renderUpdateForm(req: Request, res: Response) {
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
      this.sendStatus(res, StatusCodes.INTERNAL_SERVER_ERROR, "Update form view not found", data);
    }
  }

  sendStatus(res: Response, status: StatusCodes, error?: any, data?: any): void {
    const errorViews = (this.constructor as typeof PageController).errorViews;
    const statusString: string = StatusCodes[status];
    const reason: string = ReasonPhrases[statusString as keyof typeof ReasonPhrases];

    if (errorViews && errorViews[statusString]) {
      const view = errorViews[statusString];
      const lastPart = view.split('/').pop() || '';
      const renderOptions: any = { status: statusString, reason, error, data, ...this.otherData };

      if (lastPart.startsWith('_')) {
        renderOptions.layout = false;
      }
      res.status(status).render(view, renderOptions);
    } else {
      res.status(status).send({ status: statusString, reason, error });
    }
  }

  public release(req: Request, res: Response): void {
    console.warn("release method not implemented in PageController, using default implementation");
    this.sendStatus(res, StatusCodes.NOT_IMPLEMENTED, "Release method not implemented");
  }

  public reserve(req: Request, res: Response): void {
    console.warn("reserve method not implemented in PageController, using default implementation");
    this.sendStatus(res, StatusCodes.NOT_IMPLEMENTED, "Reserve method not implemented");
  }

  public search(req: Request, res: Response): void {
    console.warn("reserve method not implemented in PageController, using default implementation");
    this.sendStatus(res, StatusCodes.NOT_IMPLEMENTED, "Reserve method not implemented");
  }

  public mapRequestBody(body: any, req: Request, res: Response): any {
    console.warn("mapRequestBody method not implemented in PageController, using default implementation");
    return body;
  }
}
