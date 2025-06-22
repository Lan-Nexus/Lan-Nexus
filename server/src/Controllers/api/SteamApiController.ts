import {
    gamesSelectSchema,
} from "../../db/schema.js";
import { z } from "zod";

import SteamModel from "../../Models/Steam.js";
import { PageController } from "./../PageController.js";

export default class SteamController extends PageController {
    constructor() {
        super(
            SteamModel,
            gamesSelectSchema,
            z.object({ appID: z.number() }),
            z.object({})
        );
    }
}
