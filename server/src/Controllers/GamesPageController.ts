import { create } from "domain";
import { Request, Response } from "express";
import {
  gamesInsertSchema,
  gamesSelectSchema,
  gamesUpdateSchema,
} from "../db/schema.js";
import GameModel from "../Models/Game.js";
import { PageController } from "./PageController.js";
import { BAD_REQUEST } from "http-status-codes";
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
    create: "/games",
    update: "/games",
  };

  static errorViews = {
    NOT_FOUND: "errors/notFound",
    INTERNAL_SERVER_ERROR: "errors/internalServerError",
  };

  constructor() {
    super(GameModel, gamesSelectSchema, gamesInsertSchema, gamesUpdateSchema);
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
    }
    return body;
  }
}