import { Router as ExpressRouter } from 'express';
import { PageController } from '../Controllers/PageController.js';
import { jwtAuth } from '../jwt.js';
import roles, { hasPermission } from '../roles.js';

type routerHandlerGet = 'list' | 'read' | 'renderCreateForm' | 'renderUpdateForm';
type routerHandlerPost = 'create' | 'release' | 'reserve' | 'search' | 'uploadArchive';
type routerHandlerPut = 'update';
type routerHandlerDelete = 'delete';

export default class Router<T extends PageController> {
  #router: ExpressRouter;
  #objects: Record<string, T>;
  _permissions: Record<string, string>;

  constructor(router: ExpressRouter) {
    this.#router = router;
    this.#objects = {};
    this._permissions = {};
  }

  #makeOrFindObject(ObjectClass: new () => T) {
    if (!(ObjectClass.prototype instanceof PageController)) {
      throw new Error(`ObjectClass must be a subclass of ResourceController or PageController`);
    }

    const objName = ObjectClass?.name;

    if (!this.#objects[objName]) {
      this.#objects[objName] = new ObjectClass() as T;
    }

    return this.#objects[objName];
  }

  /**
   * Creates a generic handler for all HTTP methods, with permission check.
   */
  #makeHandler(obj: T, requestHandler: string) {
    return (req: any, res: any) => {
      const permissions = this._permissions?.[requestHandler];
      console.log(`Checking permissions for ${requestHandler} on ${req.method} ${req.path}`);
      if (permissions && !hasPermission(req.user, permissions)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      console.log(`Handling ${req.method} request for ${req.path} with handler ${requestHandler}`);
      // @ts-ignore
      obj[requestHandler](req, res);
    };
  }

  public get(path: string, object: new () => T, requestHandler: routerHandlerGet, middleware?: any) {
    const obj = this.#makeOrFindObject(object as new () => T);
    const handler = this.#makeHandler(obj, requestHandler);
    if (middleware) {
      this.#router.get(path, middleware, handler);
    } else {
      this.#router.get(path, handler);
    }
    return this;
  }

  public post(path: string, object: new () => T, requestHandler: routerHandlerPost, middleware?: any) {
    const obj = this.#makeOrFindObject(object as new () => T);
    const handler = this.#makeHandler(obj, requestHandler);
    if (middleware) {
      this.#router.post(path, middleware, handler);
    } else {
      this.#router.post(path, handler);
    }
    return this;
  }

  public put(path: string, object: new () => T, requestHandler: routerHandlerPut, middleware?: any) {
    const obj = this.#makeOrFindObject(object as new () => T);
    const handler = this.#makeHandler(obj, requestHandler);
    if (middleware) {
      this.#router.put(path, middleware, handler);
    } else {
      this.#router.put(path, handler);
    }
    return this;
  }

  public delete(path: string, object: new () => T, requestHandler: routerHandlerDelete, middleware?: any) {
    const obj = this.#makeOrFindObject(object as new () => T);
    const handler = this.#makeHandler(obj, requestHandler);
    if (middleware) {
      this.#router.delete(path, middleware, handler);
    } else {
      this.#router.delete(path, handler);
    }
    return this;
  }

  public addMiddleware(path: string, middleware: any) {
    this.#router.use(path, middleware);
    return this;
  }

  public Permissions(permissions: Record<string, string>) {
    console.log('Setting permissions:', permissions);
    this._permissions = permissions;
    return this;
  }
}