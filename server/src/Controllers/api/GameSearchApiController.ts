import { gamesSelectSchema, gamesInsertSchema } from "../../db/schema.js";
import { z } from "zod";
import { Request, Response } from "express";
import { PageController } from "./../PageController.js";
import GameSearchModel from "../../Models/GameSearch.js";
import axios, { HttpStatusCode } from "axios";
import path from "path";
import fs from "fs";

export default class SearchController extends PageController {
    constructor() {
        super(
            GameSearchModel,
            gamesSelectSchema,
            gamesInsertSchema,
            z.object({})
        );
    }

    async get(req: Request, res: Response) {
        const gameID = req.params.game as string;
        const results = await GameSearchModel.read(gameID);
        res.status(200).json({ results: results });
    }

    async search(req: Request, res: Response) {
        if (!req.body.query || req.body.query.length < 3) {
            return res.status(HttpStatusCode.BadRequest).json({ error: "Query must be at least 3 characters long." });
        }
        const results = await GameSearchModel.search(req.body.query);
        const existingGames = await GameSearchModel.list();

        const query = req.body.query.toLowerCase();
        const filterResults = results.data.map((game) => {
            const hasGame = existingGames.some((g) => {
                // Match by id from results with id from existingGames
                return g.gameID === game.id.toString();
            });
            return { ...game, hasGame };
        });

        res.status(200).json({ results: filterResults });
    }

    async preCreate(req: Request, res: Response): Promise<void> {
        const uploadDir = path.join(
            process.cwd(),
            "public",
            "games",
            "images",
            "uploads"
        );

        const bodyTypes = { 'hero': 'hero', 'grid': 'grid', 'icon': 'icon', 'logo': 'logo', 'card': 'grid' };

        for (const field of Object.keys(bodyTypes)) {
            if (req.body[field]) {
                console.log(`Processing field: ${field} with value: ${req.body[field]}`);
                try {
                    const response = await axios.get(`https://cdn2.steamgriddb.com/${bodyTypes[field as keyof typeof bodyTypes]}/${req.body[field]}`, {
                        responseType: "arraybuffer"
                    });

                    const file = Buffer.from(response.data, "binary");

                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }

                    const filePath = path.join(uploadDir, req.body[field]);
                    fs.writeFileSync(filePath, file);
                    // Save relative path for use in frontend/static serving
                    req.body[field] = `/games/images/uploads/${req.body[field]}`;
                } catch (error) {
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }
                }
            }
        }
    }

    mapRequestBody(body: any, req: Request, res: Response): any {
        if (typeof body.hero === "string") {
            body.heroImage = body.hero;
            delete body.hero;
        }

        if (typeof body.grid === "string") {
            body.imageCard = body.grid;
            delete body.grid;
        }

        if (typeof body.card === "string") {
            body.headerImage = body.card;
            delete body.card;
        }

        return body;
    }
}
