import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { post } from "request";
import { HTTP_CODES } from "../helpers";
import { TaskID } from "./task";
import Lang from "./task/Lang";

@Injectable()
export class SubcriberService {
    constructor(
        protected readonly Log: Logger
    ) { }

    async handler(req: Request, res: Response) {
        this.Log.log("WEBHOOK_VERIFIED");
        let challenge = req.query["hub.challenge"];
        res.status(HTTP_CODES.OK).send(challenge);

        let payload = { tid: TaskID.Greeting }

        // getting started button
        post(
            {
                uri: process.env.FACEBOOK_HOOK_PROFILE,
                qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
                json: {
                    get_started: {
                        payload: JSON.stringify(payload)
                    }
                },
            },
            (err, res, body) => err && this.Log.error(err, err.trace)
        )
        // greeting text
        post(
            {
                uri: process.env.FACEBOOK_HOOK_PROFILE,
                qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
                json: {
                    greeting: [
                        { locale: "default", text: Lang.get(Lang.txt_Greeting) },
                        { locale: "vi_VN", text: Lang.get(Lang.txt_Greeting_VN) }
                    ]
                },
            },
            (err, res, body) => err && this.Log.error(err, err.trace)
        )
    }
}
