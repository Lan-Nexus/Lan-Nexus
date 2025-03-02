import {
    gamesSelectSchema,
} from "../db/schema.js";
import { z } from "zod";

import SteamModel from "../Models/Steam.js";
import { ResourceController } from "./ResourceController.js";

export default class GamesController extends ResourceController {
    constructor() {
        super(
            SteamModel,
            gamesSelectSchema,
            z.object({ appID: z.number() }),
            z.object({})
        );
    }
}
