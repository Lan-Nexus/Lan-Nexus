import { Router as ExpressRouter } from 'express';
import { PageController } from '../Controllers/PageController.js';

type routerHandlerGet = 'list' | 'read' | 'renderCreateForm' | 'renderUpdateForm';
type routerHandlerPost = 'create' | 'release' | 'reserve' | 'search';
type routerHandlerPut = 'update';
type routerHandlerDelete = 'delete';

export default class Router<T extends PageController> {
  #router: ExpressRouter;
  #objects: Record<string, T>;

  constructor(router: ExpressRouter) {
    this.#router = router;
    this.#objects = {};
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

  public get(path: string, object: new () => T, requestHandler: routerHandlerGet, middleware?: any) {
    const obj = this.#makeOrFindObject(object as new () => T);
    if (middleware) {
      this.#router.get(path, middleware, (req, res) => {
        console.log(`Handling GET request for ${path} with handler ${requestHandler}`);
        // @ts-ignore
        obj[requestHandler](req, res);
      });
    } else {
      this.#router.get(path, (req, res) => {
        console.log(`Handling GET request for ${path} with handler ${requestHandler}`);
        // @ts-ignore
        obj[requestHandler](req, res);
      });
    }
    return this;
  }

  public post(path: string, object: new () => T, requestHandler: routerHandlerPost, middleware?: any) {
    const obj = this.#makeOrFindObject(object as new () => T);
    if (middleware) {
      this.#router.post(path, middleware, (req, res) => obj[requestHandler](req, res));
    } else {
      this.#router.post(path, (req, res) => obj[requestHandler](req, res));
    }
    return this;
  }

  public put(path: string, object: new () => T, requestHandler: routerHandlerPut, middleware?: any) {
    const obj = this.#makeOrFindObject(object as new () => T);
    if (middleware) {
      this.#router.put(path, middleware, (req, res) => obj[requestHandler](req, res));
    } else {
      this.#router.put(path, (req, res) => obj[requestHandler](req, res));
    }
    return this;
  }

  public delete(path: string, object: new () => T, requestHandler: routerHandlerDelete, middleware?: any) {
    const obj = this.#makeOrFindObject(object as new () => T);
    if (middleware) {
      this.#router.delete(path, middleware, (req, res) => obj[requestHandler](req, res));
    } else {
      this.#router.delete(path, (req, res) => obj[requestHandler](req, res));
    }
    return this;
  }

  public addMiddleware(path: string, middleware: any) {
    this.#router.use(path, middleware);
    return this;
  }
}