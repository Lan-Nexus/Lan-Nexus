import { create } from "domain";
import { Request, Response } from "express";
import {
  gamesInsertSchema,
  gamesSelectSchema,
  gamesUpdateSchema,
} from "../../db/schema.js";
import GameModel from "../../Models/Game.js";
import GameKeyModel from "../../Models/GameKey.js";
import { PageController } from "../PageController.js";
import path from "path";
import fs from "fs";

export default class GamesPageController extends PageController {
  static views = {
    list: "games/list",
    read: "games/read",
    createForm: "games/create",
    updateForm: "games/update",
  };

  static redirect = {
    delete: "/games",
    create: (req: Request, res: Response, data: any) => `/games/${data.id}`,
    update: (req: Request, res: Response, data: any) => `/games/${data.id}`,
  };

  static errorViews = {
    NOT_FOUND: "errors/notFound",
    INTERNAL_SERVER_ERROR: "errors/internalServerError",
  };

  constructor() {
    super(GameModel, gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema);
  }

  public async preRead(req: Request, res: Response) {
    this.otherData.gameKeys = await GameKeyModel.listByGame(Number(req.params.id));
  }


  public mapRequestBody(body: any, req: Request, res: Response): any {
    body.id = Number(body.id);
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
      // Handle archives (zip file)
      if (files["archives"] && files["archives"][0]) {
        const archive = files["archives"][0];
        const archiveDir = path.join(
          process.cwd(),
          "public",
          "games",
          "archives"
        );
        if (!fs.existsSync(archiveDir)) {
          fs.mkdirSync(archiveDir, { recursive: true });
        }
        const ext = path.extname(archive.originalname) || ".zip";
        const fileName = `archive-${Date.now()}${ext}`;
        const filePath = path.join(archiveDir, fileName);
        fs.writeFileSync(filePath, archive.buffer);
        body["archives"] = `/games/archives/${fileName}`;
      }
    }
    return body;
  }
}