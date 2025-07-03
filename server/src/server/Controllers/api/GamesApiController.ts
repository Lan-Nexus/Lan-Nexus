import {
  gamesInsertSchema,
  gamesSelectSchema,
  gamesUpdateSchema,
} from "../../db/schema.js";
import GameModel from "../../Models/Game.js";
import GameKeyModel from "../../Models/GameKey.js";
import { Request, Response } from "express";
import { PageController } from "../PageController.js";
import Ip from "../../ip.js";
import path from "path";
import fs from "fs";

export default class GamesController extends PageController {


  constructor() {
    super(GameModel, gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema);
  }

  async postList(req: Request, res: Response, games: any[]) {
    for (const game of games) {
      game.keys = await GameKeyModel.listByGame(game.id);
      if (typeof req.query.clientId === "string") {
        game.gamekey = await GameKeyModel.myKey(game.id, req.query.clientId);
      }
    }
  }

  public mapRequestBody(body: any, req: Request, res: Response): any {
    if (body.id) {
      body.id = Number(body.id);
    }

    body.needsKey = Number(body.needsKey);
    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "games",
        "images",
        "uploads"
      );
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const imageFields = [
        "icon",
        "logo",
        "headerImage",
        "imageCard",
        "heroImage",
      ];
      for (const field of imageFields) {
        if (files[field] && files[field][0]) {
          const file = files[field][0];
          const ext = path.extname(file.originalname) || ".png";
          const fileName = `${field}-${Date.now()}${ext}`;
          const filePath = path.join(uploadDir, fileName);
          fs.writeFileSync(filePath, file.buffer);
          // Save relative path for use in frontend/static serving
          body[field] = `/games/images/uploads/${fileName}`;
        }
      }
    }
    return body;
  }
}
