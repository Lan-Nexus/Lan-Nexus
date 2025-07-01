import { Request, Response } from "express";
export default (req: Request, res: Response) => {
    const ip = req.connection.remoteAddress 

    if (!ip) {
        throw new Error("IP address not found");
    }

    return ip;
}