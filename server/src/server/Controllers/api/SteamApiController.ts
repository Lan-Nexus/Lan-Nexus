import {
    gamesSelectSchema,
} from "../../db/schema.js";
import { z } from "zod";

import SteamModel from "../../Models/Steam.js";
import { PageController } from "./../PageController.js";
import { Request, Response } from "express";

export default class SteamController extends PageController {
    constructor() {
        super(
            SteamModel,
            gamesSelectSchema,
            z.object({ appID: z.number() }),
            z.object({})
        );
    }

    public mapRequestBody(body: any, req: Request, res: Response): any {
        if (typeof body.appID === 'string') {
            body.appID = Number(body.appID);
        }
        return body;
    }


}
