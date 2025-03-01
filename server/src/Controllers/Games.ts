import {
  gamesInsertSchema,
  gamesSelectSchema,
  gamesUpdateSchema,
} from "../db/schema.js";
import { Request, Response } from "express";
import GameModel from "../Models/Game.js";
import { Controller } from "./Controller.js";

export default class GamesController extends Controller {
  constructor() {
    super(GameModel, gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema);
  }
}
