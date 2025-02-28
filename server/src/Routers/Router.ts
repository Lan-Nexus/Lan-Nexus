import { Router as ExpressRouter } from 'express';
export default class Router {
  private router: ExpressRouter;
  private objects: any = {};

  constructor(router: ExpressRouter) {
      this.router = router;
      this.objects = {};
  }

  private makeOrFindObject(ObjectClass: any){
    const objName = ObjectClass.name;
    
    if (!this.objects[objName]) {
        this.objects[objName] = new ObjectClass();
    }
    
    return this.objects[objName];
  }

  public get(path: string,object: any, callback: string) {
    const obj = this.makeOrFindObject(object);
    this.router.get(path, (req, res) => obj[callback](req, res))
    return this;
  }

  public post(path: string,object: any, callback: string) {
    const obj = this.makeOrFindObject(object);
    this.router.post(path, (req, res) => obj[callback](req, res))
    return this;
  }

  public put(path: string,object: any, callback: string) {
    const obj = this.makeOrFindObject(object);
    this.router.put(path, (req, res) => obj[callback](req, res))
    return this;
  }

  public delete(path: string,object: any, callback: string) {
    const obj = this.makeOrFindObject(object);
    this.router.delete(path, (req, res) => obj[callback](req, res))
    return this;
  }

  public all(path: string,object: any, callback: string) {
    const obj = this.makeOrFindObject(object);
    this.router.all(path, (req, res) => obj[callback](req, res))
    return this;
  }

}
