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

  async setImage(req: Request, res: Response) {
    const { id } = req.params;
    const { image, imageType, fileType } = req.body;

    try {
      await GameModel.setImage(Number(id), image, imageType, fileType);
      res.status(200).json({ message: "Image updated successfully" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
}
