import { Controller, Get, Logger, Param, Post, Req, Query } from "@nestjs/common";
import { Request } from "express";
import { HTTP_CODES } from "./helpers";
import { ChatbotService } from "./chatbot.service";
import { SubcriberService } from "./service/service.subscriber";

@Controller("/chatwebhook")
export class ChatBotController {
    private readonly logTag = "[ChatBotController]"

    constructor(
        protected readonly Log: Logger,
        protected readonly chatbotService: ChatbotService,
        protected readonly subcriberService: SubcriberService,
    ) { }

    @Post()
    posFanpageChatBotWebHook(@Req() req: Request) {
        const body = req.body;
        const res = req.res;
        if (body.object === "page") {
            res.status(HTTP_CODES.OK).send("EVENT_RECEIVED");
            body.entry?.forEach(entry => this.chatbotService.handleRaw(entry.messaging[0]).catch(err => this.Log.error(this.logTag + err, err.trace)));
        } else {
            res.sendStatus(HTTP_CODES.NOT_FOUND);
        }
    }

    @Get("/test/taskNLP")
    getResults(@Query("text") text: string) {
        this.chatbotService.handle(text).catch(err => this.Log.error(this.logTag + err, err.trace))
    }

    @Get()
    getFanpageChatBotWebHook(@Req() req: Request) {
        const res = req.res;
        let mode = req.query["hub.mode"];
        let token = req.query["hub.verify_token"];

        if (mode && token) {
            if (token !== process.env.PAGE_VERIFY_TOKEN)
                res.sendStatus(403).send("Token invalid");
            else {
                switch (mode) {
                    case "subscribe":
                        this.subcriberService.handler(req, res).catch(err => this.Log.error(this.logTag + err, err.trace))
                        break;
                    default:
                        let mode = req.query["hub.mode"];
                        this.Log.warn(mode, `${this.logTag} unhandler mode`);
                        res.sendStatus(HTTP_CODES.FORBIDDEN).send(`unhandler mode ${mode}`);
                }
            }
        }
    }
}
