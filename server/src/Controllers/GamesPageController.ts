import { create } from "domain";
import {
  gamesInsertSchema,
  gamesSelectSchema,
  gamesUpdateSchema,
} from "../db/schema.js";
import GameModel from "../Models/Game.js";
import { PageController } from "./PageController.js";
import { BAD_REQUEST } from "http-status-codes";

export default class GamesPageController extends PageController {

   static views = {
    list: "games/list",
    read: "games/read",
    createForm: "games/create",
    updateForm: "games/update",
    update: "games/_form",
  };

  static redirect = {
    delete: '/games',
    create: '/games',
  };

  static errorViews = {
    NOT_FOUND: "errors/notFound",
    INTERNAL_SERVER_ERROR: "errors/internalServerError",
  };


  constructor() {
    super(GameModel, gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema);
  }

  public mapRequestBody(body: any) {
    console.log("Mapping request body in GamesPageController");
    body = {
      ...body,
      id: body.id ? parseInt(body.id, 10) : undefined,
    };
    console.log("Mapped body:", body);
    return body;
  }

}