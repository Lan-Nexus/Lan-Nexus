import {
  gamesInsertSchema,
  gamesSelectSchema,
  gamesUpdateSchema,
} from "../db/schema.js";
import { Request, Response } from "express";
import GameModel from "../Models/Game.js";
import { ResourceController } from "./ResourceController.js";

export default class GamesController extends ResourceController {
  constructor() {
    super(GameModel, gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema);
  }
}
