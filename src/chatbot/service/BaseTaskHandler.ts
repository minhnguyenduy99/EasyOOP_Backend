import { BaseHandler } from ".";
import { Request, Response } from "express";
import { HTTP_CODES } from "../helpers";
import { Logger } from "@nestjs/common";

export class BaseTaskHandler extends BaseHandler {
    constructor(
        protected req: Request,
        protected res: Response,
        protected Log: Logger = new Logger(),
    ) {
        super();
    }

    handler() {
        let mode = this.req.query["hub.mode"];
        this.Log.warn(`[unhandler mode]: ${mode}`);
        this.res
            .sendStatus(HTTP_CODES.FORBIDDEN)
            .send("unhandler mode " + mode);
    }
}
