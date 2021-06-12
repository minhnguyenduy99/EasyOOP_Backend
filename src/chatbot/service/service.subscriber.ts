import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { HTTP_CODES } from "../helpers";

@Injectable()
export class SubcriberService {
    constructor(
        protected readonly Log: Logger
    ) { }

    async handler(req: Request, res: Response) {
        this.Log.log("WEBHOOK_VERIFIED");
        let challenge = req.query["hub.challenge"];
        res.status(HTTP_CODES.OK).send(challenge);
    }
}
