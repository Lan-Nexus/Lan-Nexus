import { Router as ExpressRouter } from 'express';
import { ResourceController } from '../Controllers/ResourceController.js';

type routerHandlerGet = 'list' | 'read';
type routerHandlerPost = 'create';
type routerHandlerPut = 'update';
type routerHandlerDelete = 'delete';

export default class Router<T extends ResourceController> {
  #router: ExpressRouter;
  #objects: any = {};

  constructor(router: ExpressRouter) {
    this.#router = router;
    this.#objects = {} as Record<string, T>;
  }

  #makeOrFindObject<T extends ResourceController>(ObjectClass: new () => T) {
    if (!(ObjectClass.prototype instanceof ResourceController)) {
      throw new Error(`ObjectClass must be a subclass of Controller`);
    }

    const objName = ObjectClass.name;

    if (!this.#objects[objName]) {
      this.#objects[objName] = new ObjectClass() as T;
    }

    return this.#objects[objName];
  }

  public get<T extends ResourceController>(path: string, object: new () => T, requestHandler: routerHandlerGet) {
    const obj = this.#makeOrFindObject<T>(object);
    this.#router.get(path, (req, res) => obj[requestHandler](req, res))
    return this;
  }

  public post<T extends ResourceController>(path: string, object: new () => T, requestHandler: routerHandlerPost) {
    const obj = this.#makeOrFindObject<T>(object);
    this.#router.post(path, (req, res) => obj[requestHandler](req, res))
    return this;
  }

  public put<T extends ResourceController>(path: string, object: new () => T, requestHandler: routerHandlerPut) {
    const obj = this.#makeOrFindObject<T>(object);
    this.#router.put(path, (req, res) => obj[requestHandler](req, res))
    return this;
  }

  public delete<T extends ResourceController>(path: string, object: new () => T, requestHandler: routerHandlerDelete) {
    const obj = this.#makeOrFindObject<T>(object);
    this.#router.delete(path, (req, res) => obj[requestHandler](req, res))
    return this;
  }

  public all<T extends ResourceController>(path: string, object: new () => T, requestHandler: string) {
    const obj = this.#makeOrFindObject<T>(object);
    this.#router.all(path, (req, res) => obj[requestHandler](req, res))
    return this;
  }

}
